import json
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, init_db, DatasetSession
from template_matcher import find_template, get_all_templates, get_template_by_id
from gemini_service import generate_schema_from_gemini
from dataset_generator import generate_dataset
from export_utils import to_csv, to_xlsx, to_json

app = FastAPI(title="Dataset Studio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


# ─── Pydantic models ──────────────────────────────────────────────────────────

class PromptRequest(BaseModel):
    prompt: str


class Column(BaseModel):
    name: str
    type: str
    semantic_type: str | None = None


class SchemaModel(BaseModel):
    dataset_name: str
    target: str
    columns: list[Column]


class GenerateSettings(BaseModel):
    size: int = 500
    style: str = "random"      # random | balanced | realistic
    missing_pct: float = 0.0
    noise: str = "low"         # low | medium | high


class GenerateRequest(BaseModel):
    session_id: int
    schema: dict
    settings: GenerateSettings


class SaveSessionRequest(BaseModel):
    name: str
    prompt: Optional[str] = None
    schema: Optional[dict] = None
    settings: Optional[dict] = None
    source: Optional[str] = None
    template_id: Optional[str] = None


# In-memory store for the last generated DataFrame (per process, MVP only)
_last_df_store: dict = {}


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Dataset Studio API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# --- Template endpoints ---

@app.get("/templates")
def list_templates():
    """Return all templates grouped by category."""
    return get_all_templates()


@app.get("/templates/{template_id}")
def get_template(template_id: str):
    t = get_template_by_id(template_id)
    if not t:
        raise HTTPException(404, detail=f"Template '{template_id}' not found")
    return t


# --- Schema generation ---

@app.post("/generate-schema")
async def generate_schema(req: PromptRequest, db: Session = Depends(get_db)):
    """
    Main entry point for schema generation.

    Workflow:
    1. Try template matching.
    2. High confidence -> use template.
    3. Medium confidence -> use template.
    4. Low confidence -> Gemini fallback.
    """
    template, score, confidence = find_template(req.prompt)

    if template and confidence in ["high", "medium"]:
        schema = {
            "dataset_name": template["name"],
            "target": template["target"],
            "columns": template["columns"],
        }
        source = "template"
        template_id = template["id"]
    else:
        try:
            schema = await generate_schema_from_gemini(req.prompt)
        except Exception as e:
            raise HTTPException(500, detail=f"Gemini API error: {str(e)}")
        source = "gemini"
        template_id = None
        score = 0

    # Persist the session
    session = DatasetSession(
        name=schema["dataset_name"],
        prompt=req.prompt,
        schema=schema,
        source=source,
        template_id=template_id,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "session_id": session.id,
        "source": source,
        "confidence": confidence,
        "match_score": score,
        "template_id": template_id,
        "schema": schema,
    }


# --- Dataset generation ---

@app.post("/generate-dataset")
def generate_dataset_endpoint(
    req: GenerateRequest,
    db: Session = Depends(get_db)
):
    """
    Generate dataset using schema stored in DB session.
    """

    session = (
        db.query(DatasetSession)
        .filter(DatasetSession.id == req.session_id)
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    schema_dict = req.schema
    session.schema = schema_dict
    db.commit()
    settings_dict = req.settings.dict()

    print("\n===== SCHEMA LOADED =====")
    print(json.dumps(schema_dict, indent=2))
    print("=========================\n")

    df = generate_dataset(
        schema_dict,
        settings_dict
    )

    _last_df_store[str(req.session_id)] = df

    preview = (
        df.head(20)
        .fillna("")
        .to_dict(orient="records")
    )

    numeric_cols = (
        df.select_dtypes(include="number")
        .columns
        .tolist()
    )

    stats = {}

    if numeric_cols:
        stats = (
            df[numeric_cols]
            .describe()
            .round(2)
            .to_dict()
        )

    col_info = []

    for col in df.columns:
        col_info.append({
            "name": col,
            "dtype": str(df[col].dtype),
            "null_count": int(df[col].isna().sum())
        })

    return {
        "session_key": str(req.session_id),
        "row_count": len(df),
        "col_count": len(df.columns),
        "preview": preview,
        "column_info": col_info,
        "stats": stats
    }

# --- Visualization data ---

@app.get("/visualize/{session_key}")
def get_visualization_data(session_key: str, col1: Optional[str] = None, col2: Optional[str] = None):
    """Return Plotly-ready chart data for a generated dataset."""
    df = _last_df_store.get(session_key)

    if df is None:
        df = _last_df_store.get("latest")
    if df is None:
        raise HTTPException(404, detail="No dataset found. Generate one first.")

    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    string_cols = df.select_dtypes(include="object").columns.tolist()
    bool_cols = [c for c in df.columns if df[c].dtype == bool]

    charts = {}

    # Histogram: first numeric column
    if numeric_cols:
        target_col = col1 or numeric_cols[0]
        if target_col in numeric_cols:
            series = df[target_col].dropna()
            charts["histogram"] = {
                "type": "histogram",
                "column": target_col,
                "values": series.tolist(),
            }

    # Scatter: first two numeric columns
    if len(numeric_cols) >= 2:
        x_col = col1 or numeric_cols[0]
        y_col = col2 or numeric_cols[1]
        charts["scatter"] = {
            "type": "scatter",
            "x_col": x_col,
            "y_col": y_col,
            "x": df[x_col].fillna(0).tolist(),
            "y": df[y_col].fillna(0).tolist(),
        }

    # Bar chart: first string column value counts
    if string_cols:
        bar_col = string_cols[0]
        vc = df[bar_col].value_counts().head(10)
        charts["bar"] = {
            "type": "bar",
            "column": bar_col,
            "labels": vc.index.tolist(),
            "values": vc.values.tolist(),
        }

    # Pie chart: second string column or boolean
    pie_source = (string_cols[1:2] or bool_cols[:1])
    if pie_source:
        pie_col = pie_source[0]
        vc = df[pie_col].value_counts()
        charts["pie"] = {
            "type": "pie",
            "column": pie_col,
            "labels": [str(v) for v in vc.index.tolist()],
            "values": vc.values.tolist(),
        }

    # Correlation heatmap: all numeric
    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr().round(3)
        charts["heatmap"] = {
            "type": "heatmap",
            "columns": numeric_cols,
            "values": corr.values.tolist(),
        }

    return {
        "numeric_cols": numeric_cols,
        "string_cols": string_cols,
        "charts": charts,
    }


# --- Export ---

@app.get("/export/{session_key}/{format}")
def export_dataset(session_key: str, format: str, filename: Optional[str] = "dataset"):
    """Export the generated dataset as CSV, XLSX, or JSON."""
    df = _last_df_store.get(session_key)

    if df is None:
      df = _last_df_store.get("latest")

    if df is None:
      raise HTTPException(
        404,
        detail="No dataset found. Generate one first."
    )

    format = format.lower()
    if format == "csv":
        content = to_csv(df)
        media_type = "text/csv"
        ext = "csv"
    elif format == "xlsx":
        content = to_xlsx(df)
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ext = "xlsx"
    elif format == "json":
        content = to_json(df)
        media_type = "application/json"
        ext = "json"
    else:
        raise HTTPException(400, detail=f"Unsupported format: {format}. Use csv, xlsx, or json.")

    safe_name = filename.replace(" ", "_") if filename else "dataset"
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{safe_name}.{ext}"'},
    )


# --- Session management ---

@app.get("/sessions")
def list_sessions(db: Session = Depends(get_db)):
    sessions = db.query(DatasetSession).order_by(DatasetSession.created_at.desc()).limit(20).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "prompt": s.prompt,
            "source": s.source,
            "template_id": s.template_id,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in sessions
    ]


@app.get("/sessions/{session_id}")
def get_session(session_id: int, db: Session = Depends(get_db)):
    s = db.query(DatasetSession).filter(DatasetSession.id == session_id).first()
    if not s:
        raise HTTPException(404, detail="Session not found")
    return {
        "id": s.id,
        "name": s.name,
        "prompt": s.prompt,
        "schema": s.schema,
        "settings": s.settings,
        "source": s.source,
        "template_id": s.template_id,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    }
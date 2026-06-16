import random
import numpy as np
import pandas as pd
from faker import Faker
from datetime import date, timedelta

fake = Faker()

# ─── Realistic value generators per column name hint ─────────────────────────

GENDER_VALUES = ["Male", "Female", "Non-binary"]
EDUCATION_VALUES = ["High School", "Associate", "Bachelor", "Master", "PhD"]
EMPLOYMENT_VALUES = ["Employed", "Self-employed", "Unemployed", "Retired", "Student"]
CONTRACT_VALUES = ["Month-to-month", "One year", "Two year"]
PAYMENT_VALUES = ["Credit card", "Bank transfer", "Electronic check", "Mailed check"]
DEPARTMENT_VALUES = ["Engineering", "Sales", "HR", "Marketing", "Finance", "Operations"]
JOB_ROLES = ["Manager", "Analyst", "Engineer", "Specialist", "Director", "Associate"]
PROPERTY_AREAS = ["Urban", "Suburban", "Rural"]
CROP_TYPES = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Barley"]
SEASONS = ["Kharif", "Rabi", "Whole Year"]
SOIL_TYPES = ["Sandy", "Clay", "Loam", "Silt", "Peat", "Chalk"]
CHEST_PAIN_TYPES = ["Typical angina", "Atypical angina", "Non-anginal", "Asymptomatic"]
PAYMENT_HISTORY = ["Excellent", "Good", "Fair", "Poor"]
HOME_OWNERSHIP = ["Own", "Rent", "Mortgage"]
LOAN_PURPOSE = ["Education", "Medical", "Home", "Auto", "Business", "Personal"]
FAMILY_INCOME = ["Low", "Middle", "High"]
INTERNET_SERVICE = ["DSL", "Fiber optic", "No"]
COMPANY_SIZE = ["Startup", "Small", "Medium", "Large", "Enterprise"]
INDUSTRY = ["Tech", "Finance", "Healthcare", "Education", "Retail", "Manufacturing"]
SUBJECTS = ["Mathematics", "Science", "English", "History", "Geography", "Art"]
SEMANTIC_GENERATORS = {
    "person_name": lambda: fake.name(),
    "company_name": lambda: fake.company(),
    "city": lambda: fake.city(),
    "state": lambda: fake.state(),
    "country": lambda: fake.country(),
    "email": lambda: fake.email(),
    "phone": lambda: fake.phone_number(),
    "address": lambda: fake.address().replace("\n", ", "),
    "job_title": lambda: random.choice(JOB_ROLES),
    "department": lambda: random.choice(DEPARTMENT_VALUES),
    "industry": lambda: random.choice(INDUSTRY),
    "gender": lambda: random.choice(GENDER_VALUES),
    "education": lambda: random.choice(EDUCATION_VALUES),
    "id": lambda: random.randint(1, 100000),
}


STRING_COLUMN_MAP = {
    "gender": GENDER_VALUES,
    "sex": GENDER_VALUES,
    "education": EDUCATION_VALUES,
    "parental_education": EDUCATION_VALUES,
    "parent_education": EDUCATION_VALUES,
    "employment_status": EMPLOYMENT_VALUES,
    "contract_type": CONTRACT_VALUES,
    "payment_method": PAYMENT_VALUES,
    "department": DEPARTMENT_VALUES,
    "job_role": JOB_ROLES,
    "job_title": JOB_ROLES,
    "property_area": PROPERTY_AREAS,
    "crop_type": CROP_TYPES,
    "season": SEASONS,
    "soil_type": SOIL_TYPES,
    "chest_pain_type": CHEST_PAIN_TYPES,
    "payment_history": PAYMENT_HISTORY,
    "home_ownership": HOME_OWNERSHIP,
    "purpose": LOAN_PURPOSE,
    "family_income": FAMILY_INCOME,
    "internet_service": INTERNET_SERVICE,
    "company_size": COMPANY_SIZE,
    "industry": INDUSTRY,
    "subject": SUBJECTS,
    "race_ethnicity": ["Group A", "Group B", "Group C", "Group D", "Group E"],
    "lunch_type": ["Standard", "Free/reduced"],
    "location": [fake.city() for _ in range(10)],
    "state": [fake.state() for _ in range(10)],
    "zipcode": [fake.zipcode() for _ in range(20)],
    "teacher": [fake.name() for _ in range(10)],
    "reason_for_absence": ["Illness", "Family", "Travel", "Personal", "Unknown"],
}

# Integer column ranges (name → (min, max))
INT_COLUMN_RANGES = {
    "age": (18, 75),
    "tenure_months": (1, 72),
    "num_support_calls": (0, 20),
    "satisfaction_score": (1, 10),
    "years_at_company": (0, 40),
    "years_experience": (0, 35),
    "job_satisfaction": (1, 4),
    "work_life_balance": (1, 4),
    "distance_from_home": (1, 60),
    "education": (1, 5),
    "performance_rating": (1, 4),
    "num_companies_worked": (0, 10),
    "dependents": (0, 5),
    "existing_loans": (0, 5),
    "num_credit_accounts": (1, 20),
    "employment_length": (0, 30),
    "loan_term_months": (12, 360),
    "credit_score": (300, 850),
    "view": (0, 4),
    "condition": (1, 5),
    "grade": (1, 13),
    "year_built": (1950, 2022),
    "semester": (1, 8),
    "pregnancies": (0, 10),
    "bedrooms": (1, 7),
    "floors": (1, 3),
}

# Float column ranges (name → (min, max))
FLOAT_COLUMN_RANGES = {
    "attendance_rate": (0.5, 1.0),
    "previous_grade": (40.0, 100.0),
    "final_grade": (40.0, 100.0),
    "total_score": (50.0, 300.0),
    "math_score": (0.0, 100.0),
    "science_score": (0.0, 100.0),
    "english_score": (0.0, 100.0),
    "history_score": (0.0, 100.0),
    "study_hours_per_week": (0.0, 40.0),
    "sleep_hours": (4.0, 10.0),
    "assignment_completion": (0.0, 1.0),
    "monthly_charges": (20.0, 120.0),
    "total_charges": (100.0, 8000.0),
    "monthly_income": (2000.0, 20000.0),
    "income": (20000.0, 200000.0),
    "annual_income": (20000.0, 300000.0),
    "salary": (25000.0, 250000.0),
    "loan_amount": (1000.0, 500000.0),
    "glucose": (60.0, 200.0),
    "blood_pressure": (60.0, 140.0),
    "bmi": (15.0, 50.0),
    "insulin": (0.0, 900.0),
    "skin_thickness": (0.0, 100.0),
    "diabetes_pedigree": (0.05, 2.5),
    "resting_blood_pressure": (80.0, 200.0),
    "cholesterol": (100.0, 400.0),
    "max_heart_rate": (60.0, 220.0),
    "oldpeak": (0.0, 6.2),
    "sqft_living": (500.0, 13000.0),
    "sqft_lot": (500.0, 1700000.0),
    "lat": (47.1, 47.8),
    "long": (-122.5, -121.3),
    "price": (75000.0, 7700000.0),
    "annual_rainfall_mm": (200.0, 3000.0),
    "fertilizer_kg": (0.0, 500.0),
    "pesticide_kg": (0.0, 300.0),
    "avg_temperature": (8.0, 45.0),
    "area_hectares": (0.5, 200.0),
    "yield_per_hectare": (0.5, 50.0),
    "bathrooms": (1.0, 8.0),
    "debt_to_income_ratio": (0.0, 1.0),
    "credit_utilization": (0.0, 1.0),
}


def _generate_value(
    col_name: str,
    col_type: str,
    semantic_type: str | None = None,
    noise: float = 0.0
):
    """Generate a single realistic value for a given column."""
    name = col_name.lower()
    if semantic_type:
        semantic_type = semantic_type.lower()

        if semantic_type in SEMANTIC_GENERATORS:
            return SEMANTIC_GENERATORS[semantic_type]()
    if col_type == "boolean":
        return random.choice([True, False])

    if col_type == "date":
        start = date(2015, 1, 1)
        days = random.randint(0, 3650)
        return (start + timedelta(days=days)).isoformat()

    if col_type == "integer":
        lo, hi = INT_COLUMN_RANGES.get(name, (0, 100))
        val = random.randint(lo, hi)
        if noise > 0:
            val = int(val + np.random.normal(0, noise * (hi - lo) * 0.1))
            val = max(lo, min(hi, val))
        return val

    if col_type == "float":
        lo, hi = FLOAT_COLUMN_RANGES.get(name, (0.0, 1.0))
        val = round(random.uniform(lo, hi), 2)
        if noise > 0:
            val += round(np.random.normal(0, noise * (hi - lo) * 0.1), 2)
            val = round(max(lo, min(hi, val)), 2)
        return val

    if col_type == "string":
        if name in STRING_COLUMN_MAP:
            return random.choice(STRING_COLUMN_MAP[name])
        # Generic faker fallbacks
        if "name" in name:
            return fake.name()
        if "email" in name:
            return fake.email()
        if "city" in name or "location" in name:
            return fake.city()
        if "country" in name:
            return fake.country()
        if "phone" in name:
            return fake.phone_number()
        if "address" in name:
            return fake.address().replace("\n", ", ")
        if "company" in name:
            return fake.company()
        if "url" in name or "website" in name:
            return fake.url()
        # Fallback: random word
        return fake.word().capitalize()

    return None


def _apply_missing(series: pd.Series, pct: float) -> pd.Series:
    """Randomly set `pct` fraction of values to NaN."""
    if pct <= 0:
        return series
    mask = np.random.rand(len(series)) < pct
    series = series.astype(object)
    series[mask] = np.nan
    return series


def _noise_level_to_float(noise: str) -> float:
    return {"low": 0.05, "medium": 0.15, "high": 0.30}.get(noise.lower(), 0.1)


def _style_adjust(df: pd.DataFrame, style: str, target_col: str) -> pd.DataFrame:
    """
    Adjust the dataframe based on style.
    - random: no change
    - balanced: balance boolean/string target
    - realistic: add mild correlations
    """
    if style == "balanced" and target_col in df.columns:
        col = df[target_col]
        if col.dtype == object:
            # Balance string categories
            unique = col.dropna().unique()
            if len(unique) > 1:
                per_class = len(df) // len(unique)
                rows = []
                for val in unique:
                    subset = df[df[target_col] == val]
                    if len(subset) < per_class:
                        subset = subset.sample(per_class, replace=True)
                    else:
                        subset = subset.sample(per_class)
                    rows.append(subset)
                df = pd.concat(rows).sample(frac=1).reset_index(drop=True)
        elif col.dtype == bool or set(col.dropna().unique()) <= {True, False, 0, 1}:
            half = len(df) // 2
            trues = df[df[target_col].astype(bool)].sample(min(half, df[target_col].astype(bool).sum()), replace=True)
            falses = df[~df[target_col].astype(bool)].sample(min(half, (~df[target_col].astype(bool)).sum()), replace=True)
            df = pd.concat([trues, falses]).sample(frac=1).reset_index(drop=True)

    return df


def generate_dataset(schema: dict, settings: dict) -> pd.DataFrame:
    """
    Main entry point. Generates a synthetic pandas DataFrame.

    schema: {"dataset_name": str, "target": str, "columns": [{"name": str, "type": str}]}
    settings: {"size": int, "style": str, "missing_pct": float, "noise": str}
    """
    size = int(settings.get("size", 500))
    style = settings.get("style", "random").lower()
    missing_pct = float(settings.get("missing_pct", 0.0))
    noise_str = settings.get("noise", "low")
    noise = _noise_level_to_float(noise_str)

    columns = schema.get("columns", [])
    target = schema.get("target", "")

    data = {}
    for col in columns:
        col_name = col["name"]
        col_type = col["type"]
        semantic_type = col.get("semantic_type")

        values = [
           _generate_value(
               col_name,
               col_type,
               semantic_type,
               noise
           )
             for _ in range(size)
        ]
        series = pd.Series(values, name=col_name)

        # Apply missing values (skip target column and ID columns)
        if missing_pct > 0 and col_name != target and not col_name.endswith("_id"):
            series = _apply_missing(series, missing_pct)

        data[col_name] = series

    df = pd.DataFrame(data)
    df = _style_adjust(df, style, target)

    return df
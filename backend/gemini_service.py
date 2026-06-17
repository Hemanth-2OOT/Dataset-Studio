import os
import json
import re
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1/models/"
    "gemini-2.5-flash:generateContent"
)

SYSTEM_PROMPT = """
You are a machine learning dataset schema designer.

Return ONLY valid JSON.

Format:

{
  "dataset_name": "Dataset Name",
  "target": "target_column",
  "columns": [
    {
      "name": "column_name",
      "type": "integer|float|string|boolean|date",
      "semantic_type": "semantic category"
    }
  ]
}

Allowed semantic types (ONLY these values):

person_name
company_name
city
state
country
email
phone
address
industry
job_title
department
education
gender
income
salary
score
percentage
date
boolean
id
category
text

Examples:

employee_name -> person_name
startup_name -> company_name
customer_email -> email
phone_number -> phone
industry -> industry
job_title -> job_title
salary -> salary
annual_income -> income
exam_score -> score
attendance_percentage -> percentage
gender -> gender
country -> country
employee_id -> id
review_text -> text

Rules:
- Include semantic_type for EVERY column
- Use ONLY the semantic types listed above
- Do NOT invent new semantic types
- Include 8–15 columns
- Target column must appear in columns
- Use snake_case
- Return ONLY valid JSON
- No markdown
- No explanation
"""

def extract_json(text: str):
    """
    Try to recover JSON even if Gemini adds extra text.
    """

    text = text.strip()

    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError("No JSON object found")

    return text[start:end + 1]


async def generate_schema_from_gemini(prompt: str) -> dict:
    """
    Generate dataset schema using Gemini.
    """

    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not found")

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": f"{SYSTEM_PROMPT}\n\nDataset idea: {prompt}"
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 2048,
            "topP": 0.8,
            "topK": 20,
            "responseMimeType": "application/json"
        }
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=payload,
            headers={
                "Content-Type": "application/json"
            }
        )

    if response.status_code != 200:
        raise RuntimeError(
            f"Gemini API error {response.status_code}: {response.text}"
        )

    data = response.json()

    try:
        raw_text = (
            data["candidates"][0]
            ["content"]["parts"][0]
            ["text"]
        )
    except Exception as e:
        raise RuntimeError(
            f"Unexpected Gemini response structure: {e}"
        )

    print("\n=== GEMINI RAW RESPONSE ===")
    print(raw_text)
    print("===========================\n")

    try:
        cleaned = extract_json(raw_text)
        schema = json.loads(cleaned)

    except Exception as e:
        raise RuntimeError(
            f"Gemini returned invalid JSON.\n"
            f"Error: {e}\n"
            f"Raw:\n{raw_text}"
        )

    required_keys = {
        "dataset_name",
        "target",
        "columns"
    }

    if not required_keys.issubset(schema.keys()):
        raise RuntimeError(
            f"Missing required keys. "
            f"Expected {required_keys}, "
            f"got {schema.keys()}"
        )

    if not isinstance(schema["columns"], list):
        raise RuntimeError(
            "'columns' must be a list"
        )

    return schema
import json
import os
from rapidfuzz import fuzz, process

TEMPLATES_PATH = os.path.join(os.path.dirname(__file__), "templates.json")

# Matching thresholds
MATCH_THRESHOLD = 85
HIGH_CONFIDENCE = 95


def load_templates():
    """Load all templates from templates.json"""
    with open(TEMPLATES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["templates"]


def _build_search_corpus(templates):
    """
    Build searchable strings from:
    - template name
    - keywords
    - description (if present)

    Returns:
        [
            (search_string, template_id),
            ...
        ]
    """
    corpus = []

    for template in templates:
        template_id = template["id"]

        # Template name
        corpus.append(
            (template["name"].lower(), template_id)
        )

        # Keywords
        for keyword in template.get("keywords", []):
            corpus.append(
                (keyword.lower(), template_id)
            )

        # Description
        description = template.get("description", "")
        if description:
            corpus.append(
                (description.lower(), template_id)
            )

    return corpus


def find_template(prompt: str):
    """
    Find best matching template.

    Returns:
        (template, score, confidence)

    confidence:
        high
        medium
        low
    """

    templates = load_templates()

    corpus = _build_search_corpus(templates)

    prompt_lower = prompt.lower().strip()

    search_strings = [item[0] for item in corpus]

    result = process.extractOne(
        prompt_lower,
        search_strings,
        scorer=fuzz.token_set_ratio,
        score_cutoff=MATCH_THRESHOLD,
    )

    if result is None:
        return None, 0, "low"

    matched_string, score, index = result

    matched_template_id = corpus[index][1]

    template = next(
        (t for t in templates if t["id"] == matched_template_id),
        None
    )

    if score >= HIGH_CONFIDENCE:
        confidence = "high"
    elif score >= MATCH_THRESHOLD:
        confidence = "medium"
    else:
        confidence = "low"

    return template, score, confidence


def get_all_templates():
    """
    Return templates grouped by category.
    """

    templates = load_templates()

    grouped = {}

    for template in templates:
        category = template.get("category", "Other")

        if category not in grouped:
            grouped[category] = []

        grouped[category].append(template)

    return grouped


def get_template_by_id(template_id: str):
    """
    Get template by ID.
    """

    templates = load_templates()

    return next(
        (t for t in templates if t["id"] == template_id),
        None
    )


def template_exists(prompt: str):
    """
    Convenience helper.

    Returns:
        True if template confidence is high enough.
    """

    template, score, confidence = find_template(prompt)

    if template and confidence in ["high", "medium"]:
        return True

    return False
def ingest_linkedin_text(linkedin_text: dict) -> dict:
    return {
        "headline": linkedin_text.get("headline", ""),
        "about": linkedin_text.get("about", ""),
        "experience": linkedin_text.get("experience", [])
    }

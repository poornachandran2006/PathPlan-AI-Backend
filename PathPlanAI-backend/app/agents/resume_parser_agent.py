import pdfplumber
from docx import Document


def extract_text_from_resume(file_path: str) -> str:
    """
    Extract text from selectable PDF or DOCX resume.
    """

    # ---------- PDF ----------
    if file_path.lower().endswith(".pdf"):
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()

    # ---------- DOCX ----------
    if file_path.lower().endswith(".docx"):
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs]).strip()

    raise ValueError("Unsupported resume format")

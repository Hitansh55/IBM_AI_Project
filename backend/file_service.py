import pypdf
from io import BytesIO
import docx
from PIL import Image
import google.generativeai as genai

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = pypdf.PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = docx.Document(BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def extract_text_from_image(file_bytes: bytes) -> str:
    img = Image.open(BytesIO(file_bytes))
    model = genai.GenerativeModel("gemini-flash-latest")
    response = model.generate_content([
        "Extract all readable text from this image exactly as written. If it's a diagram or chart, describe it comprehensively so a student can study it. If it's handwritten notes, transcribe them accurately.", 
        img
    ])
    return response.text

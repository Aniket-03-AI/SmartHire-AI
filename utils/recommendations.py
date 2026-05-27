import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-1.5-flash")


def get_ai_recommendations(resume_text, job_description):

    prompt = f"""
    Analyze this resume.

    Resume:
    {resume_text}

    Job Description:
    {job_description}

    Give:
    1. Missing skills
    2. Improvement suggestions
    3. ATS optimization tips
    4. Best matching role
    """

    response = model.generate_content(prompt)

    return response.text
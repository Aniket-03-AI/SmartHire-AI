from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    send_file
)

from flask_cors import CORS

import os

from utils.parser import extract_text_from_pdf
from utils.matcher import calculate_similarity
from utils.pdf_report import create_pdf_report
from utils.skills import extract_skills

app = Flask(__name__)

CORS(app)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# Store latest analysis data
latest_score = 0
latest_suggestions = []
latest_resume_name = ""


@app.route("/")
def home():

    return render_template("index.html")


@app.route("/analyze_resume", methods=["POST"])
def analyze_resume():

    global latest_score
    global latest_suggestions
    global latest_resume_name

    try:

        # =========================
        # Get Form Data
        # =========================

        file = request.files["resume"]

        job_description = request.form[
            "job_description"
        ]


        # =========================
        # Save Uploaded Resume
        # =========================

        filepath = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        file.save(filepath)


        # =========================
        # Extract Resume Text
        # =========================

        resume_text = extract_text_from_pdf(
            filepath
        )


        # =========================
        # Calculate ATS Score
        # =========================

        score = calculate_similarity(
            resume_text,
            job_description
        )

        score = round(float(score), 2)


        # =========================
        # Skill Extraction
        # =========================

        resume_skills = extract_skills(
            resume_text
        )

        job_skills = extract_skills(
            job_description
        )

        matched_skills = list(
            set(resume_skills)
            &
            set(job_skills)
        )

        missing_skills = list(
            set(job_skills)
            -
            set(resume_skills)
        )


        # =========================
        # Suggestions
        # =========================

        suggestions = []

        if score < 50:

            suggestions.append(
                "Add more matching skills from job description"
            )

        if "machine learning" not in resume_text.lower():

            suggestions.append(
                "Add Machine Learning experience"
            )

        if "project" not in resume_text.lower():

            suggestions.append(
                "Add more projects section"
            )

        if "python" not in resume_text.lower():

            suggestions.append(
                "Add Python skills"
            )

        if len(suggestions) == 0:

            suggestions.append(
                "Excellent Resume for this Job Description"
            )


        # =========================
        # AI Recommendation
        # =========================

        ai_recommendation = ""

        if score >= 75:

            ai_recommendation = (
                "Your resume is highly ATS optimized."
            )

        elif score >= 50:

            ai_recommendation = (
                "Your resume is good but can be improved."
            )

        else:

            ai_recommendation = (
                "Your resume needs more optimization."
            )


        # =========================
        # Save Latest Data
        # =========================

        latest_score = score

        latest_suggestions = suggestions

        latest_resume_name = file.filename


        # =========================
        # Return Response
        # =========================

        return jsonify({
            "score": score,
            "resume_text": resume_text[:1200],
            "suggestions": suggestions,
            "ai_recommendation": ai_recommendation,

            "matched_skills": [
                "Python",
                "NLP",
                "Flask",
                "Transformers",
                "Machine Learning",
                "OpenCV"
          ]
       })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/download_report")
def download_report():

    pdf_path = create_pdf_report(
        latest_score,
        latest_suggestions,
        latest_resume_name
    )

    return send_file(
        pdf_path,
        as_attachment=True
    )


if __name__ == "__main__":

    app.run(debug=True)
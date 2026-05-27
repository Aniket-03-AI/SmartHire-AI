import spacy

nlp = spacy.load("en_core_web_sm")

SKILLS = [
    "python",
    "machine learning",
    "deep learning",
    "nlp",
    "computer vision",
    "flask",
    "django",
    "react",
    "mongodb",
    "sql",
    "javascript",
    "html",
    "css",
    "opencv",
    "tensorflow",
    "pytorch"
]


def extract_skills(text):
    text = text.lower()

    found = []

    for skill in SKILLS:
        if skill in text:
            found.append(skill)

    return found

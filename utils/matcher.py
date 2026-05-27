from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(resume, job_description):

    text = [resume, job_description]

    cv = CountVectorizer()
    matrix = cv.fit_transform(text)

    similarity = cosine_similarity(matrix)[0][1]

    return similarity * 100
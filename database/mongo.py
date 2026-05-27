from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["smarthire_ai"]

users_collection = db["users"]
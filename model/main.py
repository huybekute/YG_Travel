from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from Preprocess import preprocessText, loadAndProcess
from Recommendation import recommenPlaces
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()
dataPath = "dataset/dataset.xlsx"
df = loadAndProcess(dataPath)

#create tfidf
tfidf = TfidfVectorizer()
tfidf.fit(df['Mô tả sau xử lý'])

#data from user request
class UserRequest(BaseModel):
    query: str
    numPlaces: int = 3

#create api
@app.post("/recommendation")
def recommendAPI(data: UserRequest):
    #goi y dia diem
    kqDF = recommenPlaces(
        userInput=data.query,
        df=df,
        tfidf=tfidf,
        preprocessText=preprocessText,
        numRecommendation=data.numPlaces
    )

    return kqDF.to_dict(orient="records")


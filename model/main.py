from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import faiss
import pickle
from middleware import middleWare
from Preprocess import encode_sentences
from Recommendation import recommendation
from GoogleAI import gemini_reponse

app = FastAPI()
middleWare(app)

storage_path = 'storage'
index_file = os.path.join(storage_path, "travel.index")
medata_file = os.path.join(storage_path, "travel_medata.pkl")

index = faiss.read_index(index_file)
with open(medata_file, 'rb') as f:
    all_chunks = pickle.load(f)

#data from user request
class UserRequest(BaseModel):
    query: str
    numPlaces: int = 5

#create api
@app.post("/recommendation")
def get_recommendation(request: UserRequest):
    try:
        df_recommen = recommendation(request.query, index, all_chunks, encode_sentences, num_chunk=50)
        final_ans = gemini_reponse(request.query, df_recommen)
        return {
            "answer": df_recommen.to_dict(orient='records'),
            # "answer" : final_ans, 
            "place": df_recommen.iloc[0]['Địa điểm'] if not df_recommen.empty else "N/A",
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
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

#get data theo tinh
def get_data(province_name):
    # neu ko chon hoac " " thi mac dinh la global
    if not province_name or province_name.strip() == "":
        province_name = "glb"
    # duong dan toi folder
    target_dir = os.path.join(storage_path, province_name)
    index_file = os.path.join(target_dir, "travel.index")
    medata_file = os.path.join(target_dir, "travel_medata.pkl")

    if os.path.exists(index_file) and os.path.exists(medata_file):
        index = faiss.read_index(index_file)
        with open(medata_file, 'rb') as f:
            all_chunks = pickle.load(f)
        return index, all_chunks
    return None, None

# data from user request
class UserRequest(BaseModel):
    query: str
    province: str  
    numPlaces: int = 5

# create api
@app.post("/recommendation")
def get_recommendation(request: UserRequest):
    try:
        # xac dinh tinh
        index, all_chunks = get_data(request.province)
        
        if index is None:
            return {
                "answer": "Dora chưa biết bạn muốn hỏi về tỉnh nào. Hãy chọn một tỉnh trên bản đồ nhé!",
                "province": "None",
                "place": "N/A"
            }
        df_recommen = recommendation(request.query, index, all_chunks, encode_sentences, num_chunk=30)
        final_ans = gemini_reponse(request.query, df_recommen)
        
        return {
            "answer" : final_ans, 
            "province": request.province,
            "place": df_recommen.iloc[0]['Địa điểm'] if not df_recommen.empty else "N/A",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
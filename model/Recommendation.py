from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def recommenPlaces(userInput, df, tfidf, preprocessText, numRecommendation=3):
    inputText = preprocessText(userInput)
    if not inputText:
        return pd.DataFrame()

    # chuyen text thanh vector va tinh toan do tuong dong van ban
    inputVector = tfidf.transform([inputText])

    tfidfMatrix = tfidf.transform(df['Mô tả sau xử lý'])
    cosineSim = cosine_similarity(inputVector, tfidfMatrix,).flatten()

    # goi y dia diem co do tuong dong lon nhat
    ids = cosineSim.argsort()[-numRecommendation:][::-1]
    rcmdt = df.iloc[ids].copy()
    rcmdt['Độ tương đồng'] = (cosineSim[ids] * 100).round(2)
    return rcmdt[['Địa điểm', 'Mô tả', 'Tỉnh', 'Độ tương đồng']]
    

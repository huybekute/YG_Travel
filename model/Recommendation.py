from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def recommenPlaces(userInput, df, tfidf, tfidfMatrix, preprocessText, numRecommendation=3):
    inputText = preprocessText(userInput)
    if not inputText:
        return pd.DataFrame()

    # chuyen text thanh vector va tinh toan do tuong dong van ban
    inputVector = tfidf.transform([inputText])

    # tfidfMatrix = tfidf.transform(df['Mô tả sau xử lý'])
    cosineSim = cosine_similarity(inputVector, tfidfMatrix).flatten()

    # goi y dia diem co do tuong dong lon hon 20%
    threshold = 0.2
    validIds = [i for i, score in enumerate(cosineSim) if score >= threshold]
    if not validIds:
        return pd.DataFrame() # tra ve list rong neu ko co dia diem nao giong tren 50%
    sortIds = sorted(validIds, key=lambda x: cosineSim[x], reverse=True)
    topIds = sortIds[:numRecommendation]

    # trich xuat kq
    rcmdt = df.iloc[topIds].copy()
    rcmdt['Độ tương đồng'] = (cosineSim[topIds] * 100).round(2)
    return rcmdt[['Địa điểm', 'Mô tả', 'Tỉnh', 'Độ tương đồng']]
    

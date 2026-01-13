import pandas as pd
from underthesea import word_tokenize
import re

# stopword 
stopWord = [
    'và', 'là', 'khi', 'theo', 'của', 'nên', 'ra', 'đã', 'được', 'nhất', 'ở', 'thì', 'lại',
    'như', 'có', 'một', 'để', 'rằng', 'trong', 'này', 'với', 'cho', 'rất', 'nhiều', 'các'
]

# tien xuly van ban
def preprocessText(text):
    if not isinstance(text, str) or not text.strip():
        return ""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\d+', '', text)

    word = word_tokenize(text, format="text").split()
    word = [w for w in word if w not in stopWord]
    return ' '.join(word) if word else ""


# doc data tu excel va xu ly
def loadAndProcess(path):
    df = pd.read_excel(path)
    df['Mô tả'] = df['Mô tả'].fillna("").astype(str)
    df['Mô tả sau xử lý'] = df['Mô tả'].apply(preprocessText)
    df = df[df['Mô tả sau xử lý'].str.strip() != ''].reset_index(drop=True)
    return df




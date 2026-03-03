from transformers import AutoModel, AutoTokenizer
import torch
import os
import fitz
import faiss
import pickle
import numpy as np

#khoi tao phoBERT
modelName = 'vinai/phobert-base'
dataset_path = 'dataset'
index_file = "storage/travel.index" # luu vector
medata_file = "storage/travel_medata.pkl" # luu van ban goc

tokenizer = AutoTokenizer.from_pretrained(modelName)
model = AutoModel.from_pretrained(modelName)

def encode_sentences(sentences):
    inputs = tokenizer(sentences, return_tensors='pt', truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    
    #lay output lop cuoi
    last_hidden_state = outputs.last_hidden_state
    attention_mask = inputs['attention_mask']
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float() #mo rong mask
    sum_embeddings = torch.sum(last_hidden_state * input_mask_expanded, 1) #tinh tong vector
    sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9) #tinh tong tu
    mean_embeddings = sum_embeddings / sum_mask #tinh tb
    return mean_embeddings.detach().numpy()

def preprocessing():
    all_chunks = []

    # doc tat ca file pdf
    for filename in os.listdir(dataset_path):
        if(filename).endswith(".pdf"):
            print(f"{filename}")
            doc = fitz.open(os.path.join(dataset_path, filename))
            full_text = ""
            for page in doc:
                full_text += page.get_text() + " "

            # chia nho van ban
            sentences = [s.strip() for s in full_text.split('. ') if len(s.strip()) > 20]
            for s in sentences:
                all_chunks.append({"text": s, "source": filename})


    # chuyen van ban thanh vector
    print(f"chuyen doi {len(all_chunks)} doan van")
    text = [item['text'] for item in all_chunks]
    vectors = encode_sentences(text).astype('float32')

    # tao va luu faiss
    dimension = vectors.shape[1] # 768 chieu
    index = faiss.IndexFlatL2(dimension)
    index.add(vectors)
    faiss.write_index(index, index_file)
    
    # luu medata
    with open(medata_file, 'wb') as f:
        pickle.dump(all_chunks, f)
    
    print(f"da luu thanh cong indexfile va medatafile")


if __name__ == "__main__":
    preprocessing()



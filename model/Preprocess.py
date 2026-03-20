from transformers import AutoModel, AutoTokenizer
import torch
import os
import fitz
import faiss
import pickle
import numpy as np

#khoi tao phoBERT
modelName = 'vinai/phobert-base'
dataset_path = 'dataset' # folder chua 34 folder tinh
#travel.index : luuvector
#medata : luu van ban goc
storage_path = 'storage' # folder se chua 34 folder ket qua

tokenizer = AutoTokenizer.from_pretrained(modelName)
model = AutoModel.from_pretrained(modelName)

def encode_sentences(sentences):

    # phobert co gioi han la 256
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
    # all_chunks = []

    # lay ds 34 tinh
    provinces = [d for d in os.listdir(dataset_path) if os.path.isdir(os.path.join(dataset_path, d))]

    for province in provinces:
        provinces_chunks = []
        province_folder = os.path.join(dataset_path, province)
        print(f"{province}")
        # doc tat ca file pdf 

        for filename in os.listdir(province_folder):
            if(filename).endswith(".pdf"):
                print(f"{filename}")
                doc = fitz.open(os.path.join(province_folder, filename))
                full_text = ""
                for page in doc:
                    full_text += page.get_text() + " "

                # chia nho van ban
                sentences = [s.strip() for s in full_text.split('. ') if len(s.strip()) > 20]
                for s in sentences:
                    provinces_chunks.append({"text": s, "source": filename, "province": province})
                    # all_chunks.append({"text": s, "source": filename, "province": province})

        # neu tinh co du lieu thi moi bat dau vector hoa
        if (len(provinces_chunks) > 0):
            # chuyen van ban thanh vector
            print(f"chuyen doi {len(provinces_chunks)} doan van")
            text = [item['text'] for item in provinces_chunks]
            vectors = encode_sentences(text).astype('float32')

            province_storage = os.path.join(storage_path, province)
            if not os.path.exists(province_storage):
                os.makedirs(province_storage)

            # tao va luu faiss 
            dimension = vectors.shape[1] # 768 chieu
            index = faiss.IndexFlatL2(dimension)
            index.add(vectors)
            faiss.write_index(index, os.path.join(province_storage, "travel.index"))
            
            # luu medata 
            with open(os.path.join(province_storage, "travel_medata.pkl"), 'wb') as f:
                pickle.dump(provinces_chunks, f)
            print(f"luu medata thanh cong: {province}")

    #luu glb cho toan bo
    # if(len(all_chunks) > 0):
    #     # chuyen tat ca van ban thanh vector
    #     print(f"chuyen doi {len(all_chunks)} doan van")
    #     text_all = [item['text'] for item in all_chunks]
    #     vectors_all = encode_sentences(text_all).astype('float32')

    #     glb_storage = os.path.join(storage_path, "glb")
    #     if not os.path.exists(glb_storage):
    #         os.makedirs(glb_storage)

    #     # tao va luu faiss 
    #     index_all = faiss.IndexFlatL2(vectors_all.shape[1])
    #     index_all.add(vectors_all)
    #     faiss.write_index(index_all, os.path.join(glb_storage, "travel.index"))
        
    #     # luu medata 
    #     with open(os.path.join(glb_storage, "travel_medata.pkl"), 'wb') as f:
    #         pickle.dump(all_chunks, f)
    #     print(f"Luu thanh cong medata cho glb")

#tao file global
def create_glb():
    print("tao file tong")
    glb_idx = None
    all_chunk = []
    
    # Lay ds file da xu ly
    provinces = [d for d in os.listdir(storage_path) if os.path.isdir(os.path.join(storage_path, d)) and d != 'glb']

    for province in provinces:
        province_dir = os.path.join(storage_path, province)
        index_file = os.path.join(province_dir, "travel.index")
        meta_file = os.path.join(province_dir, "travel_medata.pkl")

        # kiem tra ton tai ca 2 file
        if os.path.exists(index_file) and os.path.exists(meta_file):
            print(f"{province} ")
            try:
                # gop file vector
                sub_index = faiss.read_index(index_file)
                if glb_idx is None:
                    glb_idx = sub_index
                else:
                    glb_idx.merge_from(sub_index)
                
                # gop file van ban
                with open(meta_file, 'rb') as f:
                    sub_chunks = pickle.load(f)
                    all_chunk.extend(sub_chunks)
                
                print("thanh cong")
            except Exception as e:
                print(f"Error in {province}: {e}")

    # check co data moi luu
    if glb_idx is not None and len(all_chunk) > 0:
        glb_storage = os.path.join(storage_path, "glb")
        if not os.path.exists(glb_storage):
            os.makedirs(glb_storage)

        # luu index va medata tong
        faiss.write_index(glb_idx, os.path.join(glb_storage, "travel.index"))
        with open(os.path.join(glb_storage, "travel_medata.pkl"), 'wb') as f:
            pickle.dump(all_chunk, f)
            
        print(f"tao thanh cong glb voi {glb_idx.ntotal} doan")


if __name__ == "__main__":
    # preprocessing()
    create_glb()
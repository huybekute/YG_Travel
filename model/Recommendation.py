import pandas as pd

def recommendation(user_input, index, all_chunks, encode_fn, num_chunk):
    #chuyen cau hoi ng dung thanh vector
    query_vector = encode_fn([user_input]).astype('float32')

    # tim kiem vector gan nhat
    # d : khoang cach, i: chi so
    D, I = index.search(query_vector, num_chunk)

    #xac dinh file co doan van giong nhat
    if I[0][0] == -1:
        return pd.DataFrame()
    
    best_idx = I[0][0]
    best_source = all_chunks[best_idx]['source'] # dia diem se lay

    # lay ket qua loc ra 5 chunks tot nhat ve dia diem nay
    recommendations = []
    count = 0
    for i in range(len(I[0])):
        idx = I[0][i]
        if idx == -1: continue

        chunk = all_chunks[idx]
        
        # chi lay neu doan van thuoc ve file da chon
        if chunk['source'] == best_source:
            distance = D[0][i]
            score = round(max(0, 100 - distance), 2)
            
            recommendations.append({
                "Địa điểm": best_source.replace(".pdf", ""),
                "Thông tin liên quan": chunk['text'],
                "Độ tương đồng": f"{score}%"
            })
            count += 1
            
        if count == 30:
            break

    return pd.DataFrame(recommendations)
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("AI_STUDIO_KEY")

client = genai.Client(api_key=api_key, http_options={'api_version': 'v1'})

try:
    print("--- CÁC MODEL BẠN CÓ THỂ DÙNG ---")
    # Liệt kê tất cả models khả dụng
    for model in client.models.list():
        print(f"Tên model: {model.name}")
        print(f"Khả năng: {model.supported_generation_methods}")
        print("-" * 30)
except Exception as e:
    print(f"Lỗi khi kiểm tra: {e}")
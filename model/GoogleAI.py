from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("AI_STUDIO_KEY")

# khoi tao client
client = genai.Client(
    api_key=api_key,
    http_options={'api_version': 'v1'} 
)

def gemini_reponse(user_input, recommendation):
    if recommendation.empty:
        return "Xin lỗi, tôi không tìm thấy địa điểm phù hợp"
    
    # place_name = recommendation.iloc[0]['Địa điểm']
    place_name = ", ".join(recommendation['Địa điểm'].unique().tolist())
    context = "\n".join(recommendation['Thông tin liên quan'].tolist())

    prompt = f"""
    Ní là trợ lý du lịch thông minh của YG Travel.
    NGỮ CẢNH HỆ THỐNG:
    - Nếu người dùng CHÀO HỎI (ví dụ: "Hi", "Chào bạn", "Hello"): Hãy chào lại một cách thân thiện, ngắn gọn và giới thiệu bạn có thể giúp gì về thông tin du lịch. 
    - Nếu người dùng HỎI VỀ ĐỊA ĐIỂM/THÔNG TIN thì KHÔNG cần chào hỏi mà thực hiện các nội dung dưới đây:
        1. Sử dụng DUY NHẤT nội dung từ NỘI DUNG GỐC dưới đây:{context}
        2. Giới thiệu về tên địa điểm { place_name } bằng tiếng Việt
        3. Ghép các đoạn thông tin (chunks) liên quan lại thành câu trả lời hoàn chỉnh.
        4. Tuyệt đối KHÔNG tự ý thêm thắt thông tin, con số, hoặc tính chất nằm ngoài nội dung gốc.
        5. Chỉ thêm các từ nối câu (ví dụ: "Ngoài ra", "Bên cạnh đó", "Hơn nữa") để đoạn văn mạch lạc, không thêm bất kỳ bình luận cá nhân nào.
        6. Nếu nội dung gốc không có thông tin để trả lời, hãy lịch sự báo: "Xin lỗi, dữ liệu hiện tại của tôi không có thông tin về vấn đề này."
        7. Hãy tổng hợp thông tin từ các đoạn văn trên một cách ngắn gọn, súc tích và trả lời đúng trọng tâm câu hỏi.
        8. Tuyệt đối không dùng ký tự * hoặc **. 
    CÂU HỎI CỦA NGƯỜI DÙNG: "{user_input}"
    """

    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash", 
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Lỗi hệ thống khi gọi AI: {e}"
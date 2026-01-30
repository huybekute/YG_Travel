from fastapi.middleware.cors import CORSMiddleware

def middleWare(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  #cho phep moi domain
        allow_credentials=True, # cho phep gui cookie
        allow_methods=["*"], # cho phep tat ca cac phuongthuc
        allow_headers=["*"], # cho phep moi header
    )
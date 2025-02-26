from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.focus import router as focus_router  # ✅ 절대 경로 사용

app = FastAPI()

# ✅ CORS 설정 (필요 시 수정)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ WebSocket 엔드포인트 추가
app.include_router(focus_router)

# ✅ 서버 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

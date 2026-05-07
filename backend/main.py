from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.companion import router as companion_router

load_dotenv()

app = FastAPI(title="Nemi API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(companion_router, prefix="/api")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}

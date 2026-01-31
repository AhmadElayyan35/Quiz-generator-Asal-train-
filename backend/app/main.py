from app.logger import quiz_logger
from app.routers import (
    categories_router,
    documents_router,
    quiz_attempts_router,
    quizzes_router,
    users_router,
)
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


@app.middleware("http")
async def log_requests(request: Request, call_next):
    quiz_logger.info(f"📥 Request: {request.method} {request.url}")
    response = await call_next(request)
    quiz_logger.info(f"📤 Response: {response.status_code} for {request.url}")
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://quiz-generator-frontend-webapp-g3fdawbwbqfjgqbj.eastus-01.azurewebsites.net"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include the routers
app.include_router(users_router.router)
app.include_router(documents_router.router)
app.include_router(categories_router.router)
app.include_router(quizzes_router.router)
app.include_router(quiz_attempts_router.router)

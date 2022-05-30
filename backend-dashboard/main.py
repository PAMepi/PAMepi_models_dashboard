from logging.config import dictConfig
import logging
from config import LogConfig

dictConfig(LogConfig().dict())
logger = logging.getLogger("mycoolapp")
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from typing import Optional
from utils import calculate_SIR_model, calculate_SEIR_model, calculate_SEIIR_model

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api")
async def root():
    return {"message": "Hello World"}

@app.get("/api/sir")
async def model_sir(N: Optional[int] = 1000, I0: Optional[int] = 1, 
        R0: Optional[int] = 0, beta: Optional[float] = 0.2, gamma: Optional[float] = 1/10,
        t_max: Optional[int] = 1000):
    data = calculate_SIR_model(
        N = N, I0 = I0, R0 = R0, beta = beta,
        gamma = gamma, t_max = t_max
    )

    return data

@app.get("/api/seir")
async def model_seir(N: Optional[int] = 1000, I0: Optional[int] = 1, E0: Optional[int] = 0, 
        R0: Optional[int] = 0, alpha: Optional[float] = 1/2 , beta: Optional[float] = 0.2, gamma: Optional[float] = 1/2,
        t_max: Optional[int] = 1000):
    data = calculate_SEIR_model(
        N = N, I0 = I0, R0 = R0, E0 = E0, alpha = alpha, beta = beta,
        gamma = gamma, t_max = t_max
    )

    return data

@app.get("/api/seiir")
async def model_seiir(N: Optional[int] = 1000, I0: Optional[int] = 1, E0: Optional[int] = 0, 
        R0: Optional[int] = 0, alpha: Optional[float] = 1/4 , beta: Optional[float] = 0.5, gamma: Optional[float] = 1/4,
        t_max: Optional[int] = 1000):
    data = calculate_SEIIR_model(
        N = N, I0 = I0, R0 = R0, E0 = E0, alpha = alpha, beta = beta,
        gamma = gamma, t_max = t_max
    )

    return data
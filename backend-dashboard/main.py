from logging.config import dictConfig
import logging
from config import LogConfig

dictConfig(LogConfig().dict())
logger = logging.getLogger("mycoolapp")

from fastapi import FastAPI
from typing import Optional
from utils import calculate_SIR_model

app = FastAPI()

@app.get("/api")
async def root():
    return {"message": "Hello World"}

@app.get("/api/sir")
async def model_sir(N: Optional[int] = 1000, I0: Optional[int] = 1, 
        R0: Optional[int] = 0, beta: Optional[float] = 0.2, gamma: Optional[float] = 1/10,
        t_max: Optional[int] = 100):
    S, I, R = calculate_SIR_model(
        N = N, I0 = I0, R0 = R0, beta = beta,
        gamma = gamma, t_max = t_max
    )

    return [{'label': 'Suscetíveis', 'data': S},
            {'label': 'Infectados', 'data': I},
            {'label': 'Recuperados', 'data': R}]
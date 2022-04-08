import numpy as np
from scipy.integrate import odeint
from datetime import date, timedelta

def calculate_SIR_model(N = 1000, I0 = 1, R0 = 0, beta = 0.02, gamma = 1/10, t_max = 365):
    # Everyone else, S0, is susceptible to infection initially.
    S0 = N - I0 - R0

    # A grid of time points (in days)
    t = np.linspace(0, t_max, t_max)

    # The SIR model differential equations.
    def deriv(y, t, N, beta, gamma):
        S, I, R = y
        dSdt = -beta * S * I / N
        dIdt = beta * S * I / N - gamma * I
        dRdt = gamma * I
        return dSdt, dIdt, dRdt

    # Initial conditions vector
    y0 = S0, I0, R0
    # Integrate the SIR equations over the time grid, t.
    ret = odeint(deriv, y0, t, args=(N, beta, gamma))

    S, I, R = ret.T     

    if R0 == 0:
        R0 = beta/gamma

    Rt = (R0*S)/N
    C = N - S
    Cd = np.diff(I)

    final = np.where(np.diff(R) < 00000.1)[0][0]

    data = [
            {'label': 'Suscetíveis', 'data': add_date(S[:final].tolist())},
            {'label': 'Infectados', 'data': add_date(I[:final].tolist())},
            {'label': 'Recuperados', 'data': add_date(R[:final].tolist())}
        ]

    return {
        'data': data, 
        'rt': [{'label': 'Rt', 'data': add_date(Rt[:final].tolist())}],
        'casos': [
            {'label': 'Casos Acumulados', 'data': add_date(C[:final].tolist())},
            {'label': 'Casos Diários', 'data': add_date(Cd[:final].tolist())}
        ]}

def add_date(lista):
    today = date.today()
    return [{'x': today + timedelta(days=index), 'y': lista[index]} for index, y in enumerate(lista)]
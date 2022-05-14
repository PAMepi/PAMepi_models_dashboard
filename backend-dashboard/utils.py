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
    S = np.array(S.astype(int))
    I = np.array(I.astype(int))
    R = np.array(R.astype(int))

    if R0 == 0:
        R0 = beta/gamma

    Rt = (R0*S)/N
    C = N - S
    Cd = np.diff(C)

    final = np.where(np.diff(R)[50:] < 1)[0][0]

    data = [
            {'label': 'Suscetíveis', 'data': (S[:final].tolist())},
            {'label': 'Infectados', 'data': (I[:final].tolist())},
            {'label': 'Recuperados', 'data': (R[:final].tolist())}
        ]

    return {
        'data': data, 
        'rt': [{'label': 'Rt', 'data': (Rt[:final].tolist())}],
        'casos': [
            {'label': 'Casos Acumulados', 'data': (C[:final].tolist())},
            {'label': 'Casos Diários', 'data': (Cd[:final].tolist())}
        ]}


def calculate_SEIR_model(N = 1000, I0 = 1, R0 = 0, E0=10, alpha = 1/5, beta = 0.02, gamma = 1/10, t_max = 365):
    # initial number of infected and recovered individuals
    S0 = N - I0 - R0

    t = np.linspace(0, t_max, t_max)
    
    # SEIR model differential equations.
    def deriv(x, t, alpha, beta, gamma):
        s, e, i, r = x
        dsdt = -beta * s * i
        dedt =  beta * s * i - alpha * e
        didt = alpha * e - gamma * i
        drdt =  gamma * i
        return [dsdt, dedt, didt, drdt]


    x_initial = S0, E0, I0, R0
    soln = odeint(deriv, x_initial, t, args=(alpha, beta, gamma))
    S, E, I, R = soln.T

    if R0 == 0:
        R0 = beta/gamma

    Rt = (R0*S)/N
    C = N - S
    Cd = np.diff(I)

    final = np.where(np.diff(R) < 00000.1)[0][0]

    data = [
            {'label': 'Suscetíveis', 'data': (S[:final].tolist())},
            {'label': 'Infectados', 'data': (I[:final].tolist())},
            {'label': 'Expostos', 'data': (E[:final].tolist())},
            {'label': 'Recuperados', 'data': (R[:final].tolist())}
        ]

    return {
        'data': data, 
        'rt': [{'label': 'Rt', 'data': (Rt[:final].tolist())}],
        'casos': [
            {'label': 'Casos Acumulados', 'data': (C[:final].tolist())},
            {'label': 'Casos Diários', 'data': (Cd[:final].tolist())}
        ]}


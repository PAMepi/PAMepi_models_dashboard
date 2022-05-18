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
    R = np.array(R)

    if R0 == 0:
        R0 = beta/gamma

    Rt = (R0*S)/N
    C = N - S
    Cd = np.diff(C)

    try:
        final = np.where(np.diff(R) < 0.1)[0][0]
    except IndexError as e:
        final = t_max

    data = [
            {'label': 'Suscetíveis', 'data': (S[:final].tolist())},
            {'label': 'Infectados', 'data': (I[:final].tolist())},
            {'label': 'Recuperados', 'data': (R[:final].astype(int).tolist())}
        ]

    return {
        'data': data, 
        'rt': [{'label': 'Rt', 'data': (Rt[:final].tolist())}],
        'casos': [
            {'label': 'Casos Acumulados', 'data': (C[:final].tolist())},
            {'label': 'Casos Diários', 'data': (Cd[:final].tolist())}
        ]}


def calculate_SEIR_model(N = 1000, I0 = 1, R0 = 0, E0=10, alpha = 1/5, beta = 0.02, gamma = 1/2, t_max = 100):
    # initial number of infected and recovered individuals
    e_initial = 1/N
    i_initial = I0/N
    r_initial = E0/N
    s_initial = 1 - e_initial - i_initial - r_initial
    
    # SEIR model differential equations.
    def deriv(x, t, alpha, beta, gamma):
        s, e, i, r = x
        dsdt = -beta * s * i
        dedt =  beta * s * i - alpha * e
        didt = alpha * e - gamma * i
        drdt =  gamma * i
        return [dsdt, dedt, didt, drdt]

    t = np.linspace(0, t_max, t_max)
    x_initial = s_initial, e_initial, i_initial, r_initial
    soln = odeint(deriv, x_initial, t, args=(alpha, beta, gamma))
    S, E, I, R = soln.T*N

    S = np.array(S.astype(int))
    E = np.array(E.astype(int))
    I = np.array(I.astype(int))
    R = np.array(R)

    if R0 == 0:
        R0 = beta/gamma

    Rt = (R0*S)/N
    C = N - S
    Cd = np.diff(C)

    try:
        final = np.where(np.diff(R) < 0.1)[0][0]
    except IndexError as e:
        final = t_max

    data = [
            {'label': 'Suscetíveis', 'data': (S[:final].tolist())},
            {'label': 'Infectados', 'data': (I[:final].tolist())},
            {'label': 'Expostos', 'data': (E[:final].tolist())},
            {'label': 'Recuperados', 'data': (R[:final].astype(int).tolist())}
        ]

    return {
        'data': data, 
        'rt': [{'label': 'Rt', 'data': (Rt[:final].tolist())}],
        'casos': [
            {'label': 'Casos Acumulados', 'data': (C[:final].tolist())},
            {'label': 'Casos Diários', 'data': (Cd[:final].tolist())}
        ]}


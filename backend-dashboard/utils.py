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
    return format_output(S, I, R, N, R0, beta, gamma, t_max)


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

    return format_output(S, I, R, N, R0, beta, gamma, t_max, E=E)


def calculate_SEIIR_model():

    #variables
    S, E, Ia, Is, R, Tt = f
    
    #define parameters for one beta
    beta, delta, rho, kappa, gammaA, gammaS = parametros
    
    #define derivatives for single beta
    dS_dt = - beta * S * (Is + delta * Ia)
    dE_dt = beta * S * (Is + delta * Ia) - kappa * E
    dTt_dt = rho * kappa * E
    dIa_dt = (1 - rho) * kappa * E - (gammaA * Ia)
    dIs_dt = rho * kappa * E - (gammaS * Is)
    dR_dt = gammaA * Ia + gammaS * Is 
    
    return dS_dt, dE_dt, dIa_dt, dIs_dt, dR_dt, dTt_dt

def predict(self, time, beta, delta, rho, kappa, gammaA, gammaS):
    #q0 = [1 - (self.is0 + self.ia0), self.e0, self.ia0, self.is0, 0, self.is0]
    q0 = [1 - 0, 0, 0, 0, 0, 0]
    parode = beta, delta, rho, kappa, gammaA, gammaS
    predicted = odeint(self.__seiir, q0, np.arange(1, len(time) + 1), args = (parode,), mxstep = 1000000)
    self.S = predicted[:,0]
    self.E = predicted[:,1]
    self.Ia = predicted[:,2]
    self.Is = predicted[:,3]
    self.R = predicted[:,4]
    self.Tt = predicted[:,5]

    return {"S": self.S, "E":self.E, "Ia": self.Ia, "Is": self.Is, "R": self.R, "Tt": self.Tt * self.pop}


def format_output(S, I, R, N, R0, beta, gamma, t_max, **kwargs):
    S = np.array(S.astype(int))
    I = np.array(I.astype(int))
    R = np.array(R)

    if "gammaa" in kwargs:
        gammaa = kwargs["gammaa"]

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
            {'label': 'Suscetíveis', 'data': add_date(S[:final].tolist())},
            {'label': 'Infectados', 'data': add_date(I[:final].tolist())},
            {'label': 'Recuperados', 'data': add_date(R[:final].astype(int).tolist())}
        ]

    if "E" in kwargs:
        E = np.array(kwargs["E"].astype(int))
        data.append({'label': 'Expostos', 'data': add_date(E[:final].tolist())})
    
    if "Ia" in kwargs:
        Ia = np.array(kwargs["Ia"].astype(int))
        data.append({'label': 'Infectados Assintomáticos', 'data': add_date(Ia[:final].tolist())})

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
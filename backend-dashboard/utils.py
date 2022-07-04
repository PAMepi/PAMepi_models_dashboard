import scipy.integrate as spi
import numpy as np
import copy


def addterminal(fn):
    fn.terminal = True
    fn.direction = -1
    return fn

class SIR:
    list_states = ['S', 'I', 'R', 'Nw']
    states_names = ['Suscetíveis', 'Infectados', 'Recuperados', 'Casos Acumulados']
    def __init__(self):
        pass
    
    def _gen_x0(self, p0):
        x0 = np.zeros(len(self.list_states))
        x0[0] = 1
        useful_names = self.list_states[1:-1]
        for i, name in enumerate(useful_names):
            nam = f'{name}0'
            x0[i+1] = p0[nam]/p0['N']
            x0[0] = x0[0] - x0[i+1]
            if name == 'I':
                x0[-1] = x0[i+1]
        return x0.reshape((1,-1))

    def _eq_dif(self, t, X, pars):
        S, I, R, Nw = X
        StE = S * pars['beta'] * I
        dS = - StE
        dI = StE - pars['gamma'] * I
        dR = pars['gamma'] * I
        dNw = StE
        return np.r_[dS, dI, dR, dNw]
    
    @addterminal
    def _test_reasonable(self, t, x, args):
        return np.min(x) + 1e-26
    
    def _integrator(self, f, tspan, y0, t_eval=None, args=None, tol=1e-6):
        sol = spi.solve_ivp(f, tspan, y0, t_eval=t_eval, args=args, atol=tol,\
                            events=(self._test_reasonable), method='BDF')
        if sol.status == 0:
            return sol
        else:
            def S():
                pass
            S.y = sol.y.copy()
            while sol.status != 0:
                y0 = sol.y[:,-1]
                y0[y0<0] = 1e-25
                t_eval = t_eval[t_eval>sol.t[-1]]
                tspan = (sol.t_events[0][0], tspan[1])
                sol = spi.solve_ivp(f, tspan, y0, t_eval=t_eval, args=args, atol=tol,\
                            events=(self._test_reasonable), method='BDF')
                S.y = np.c_[S.y, sol.y]
            return S
    
    def _call_ODE(self, ts, ppars):
        tol= 1e-6
        if type(ppars['beta']) not in [int, float]:
            betas = ppars['beta'].copy()
        else:
            betas = ppars['beta']
        pars = copy.deepcopy(ppars)
        if 'tcut' not in pars.keys():
            tcorte = None
        else:
            tcorte = pars['tcut']
        if type(ts) in [int, float]:
            ts = np.arange(ts)
        if type(tcorte) == type(None) or len(tcorte) == 0:
            tcorte = [ts[-1]]
            if type(betas) != list:
                betas = [betas]
        if tcorte[-1] < ts[-1]:
            tcorte.append(ts[-1])
        tcorte = [ts[0]] + tcorte
        tcorte.sort()
        saida = self._gen_x0(pars)
        Y = saida.copy()
        for i in range(1, len(tcorte)):
            cut_last = False
            pars['beta'] = betas[i-1]
            t = ts[(ts >= tcorte[i-1]) * (ts<= tcorte[i])]
            if len(t) > 0:
                if t[0] > tcorte[i-1]:
                    t = np.r_[tcorte[i-1], t]
                if t[-1] < tcorte[i]:
                    t = np.r_[t, tcorte[i]]
                    cut_last = True
                sol = self._integrator(self._eq_dif, (t[0], t[-1]), Y[-1], t_eval=t, args=(pars,), tol=tol)
                Y = sol.y.T
                if cut_last:
                    saida = np.r_[saida, Y[1:-1]]
                else:
                    saida = np.r_[saida, Y[1:]]
            elif not np.isclose(tcorte[i], tcorte[i-1], rtol=1e-9):
                sol = self._integrator(self._eq_dif, tcorte[i-1:i+1], Y[-1] , args=(pars,), tol=tol)
                Y = sol.y.T
        return ts, saida
    
    #TODO: arrumar um melhor calculo de Rt
    def _calculate_Rt(self, mY, pars):
        R0 = pars['beta'] / pars['gamma']
        return R0 * mY[:,0]
    
    #TODO: usar o list_states para definir o indice dos casos e mortes ao invés de deixar hardcoded
    def calculate_model(self, Parameters):
        N = Parameters['N']
        t, mY = self._call_ODE(Parameters['tmax'], Parameters)
        data = list()
        for name, serie in zip(self.states_names, mY.T):
            data.append({'label':name, 'data': (N * serie).astype(int).tolist()})
        cases = [{'label': 'Casos Acumulados', 'data': (N * mY[:,-1]).astype(int).tolist()},
                 {'label': 'Casos Diários', 'data': (np.r_[0,np.diff((N * mY[:,-1]).astype(int))]).tolist()}]
        
        output = {
            'data': data,\
            'rt':[{'label': 'Rt', 'data': (self._calculate_Rt(mY, Parameters)).tolist()}],\
            'casos': cases
                }
        if 'D' in self.list_states:
            output['mortes'] = [{'label': 'Mortes Acumuladas', 'data': (N * mY[:,-2]).astype(int).tolist()},
                     {'label': 'Mortes Diárias', 'data': (np.r_[0,np.diff((N * mY[:,-2]).astype(int))]).tolist()}]
        return output

class SIRD(SIR):
    '''
    list_states = ['S', 'I', 'R', 'D', 'Nw']
    states_names = ['Suscetíveis', 'Infectados', 'Recuperados', 'Mortes Acumuladas', 'Casos Acumulados']
    parametros: 
        beta, gamma -> igual SIR
        mu -> taxa de mortalidade
    '''
    list_states = ['S', 'I', 'R', 'D', 'Nw']
    states_names = ['Suscetíveis', 'Infectados', 'Recuperados', 'Mortes Acumuladas', 'Casos Acumulados']
    def _eq_dif(self, t, X, pars):
        S, I, R, D, Nw = X
        StE = S * pars['beta'] * I
        dS = - StE
        dI = StE - pars['gamma'] * I
        dR = (1-pars['mu']) * pars['gamma'] * I
        dD = pars['mu'] * pars['gamma'] * I
        dNw = StE
        return np.r_[dS, dI, dR, dD, dNw]

class SEIR(SIR):
    '''
    list_states = ['S', 'E', 'I', 'R', 'Nw']
    states_names = ['Suscetíveis', 'Expostos', 'Infectados', 'Recuperados', 'Casos Acumulados']
    parametros: 
        beta, gamma -> igual SIR
        kappa -> 1/periodo de incubação
    '''
    list_states = ['S', 'E', 'I', 'R', 'Nw']
    states_names = ['Suscetíveis', 'Expostos', 'Infectados', 'Recuperados', 'Casos Acumulados']
    def _eq_dif(self, t, X, pars):
        S, E, I, R, Nw = X
        StE = S * pars['beta'] * I
        dS = - StE
        dE = StE - pars['kappa'] * E
        dI = pars['kappa'] * E - pars['gamma'] * I
        dR = pars['gamma'] * I
        dNw = pars['kappa'] * E
        return np.r_[dS, dE, dI, dR, dNw]

class SEIRD(SIR):
    '''
    list_states = ['S', 'E', 'I', 'R', 'D', 'Nw']
    states_names = ['Suscetíveis', 'Expostos', 'Infectados', 'Recuperados', 'Mortes Acumuladas', 'Casos Acumulados']
    parametros: 
        beta, gamma -> igual SIR
        kappa -> 1/periodo de incubação
        mu -> taxa de mortalidade
    '''
    list_states = ['S', 'E', 'I', 'R', 'D', 'Nw']
    states_names = ['Suscetíveis', 'Expostos', 'Infectados', 'Recuperados', 'Mortes Acumuladas', 'Casos Acumulados']
    def _eq_dif(self, t, X, pars):
        S, E, I, R, D, Nw = X
        StE = S * pars['beta'] * I
        dS = - StE
        dE = StE - pars['kappa'] * E
        dI = pars['kappa'] * E - pars['gamma'] * I
        dR = (1-pars['mu']) * pars['gamma'] * I
        dD = pars['mu'] * pars['gamma'] * I
        dNw = pars['kappa'] * E
        return np.r_[dS, dE, dI, dR, dD, dNw]

class SEIIR(SIR):
    '''
    list_states = ['S', 'E', 'Ia', 'Is', 'R', 'Nw']
    states_names = ['Suscetíveis', 'Expostos', 'Infectados Assintomáticos', \
                    'Infectados', 'Recuperados', 'Casos Acumulados']
    parametros: 
        beta, gamma -> igual SIR
        gammaA -> 1/duracao da fase infecciosa de assintomaticos
        p -> fração de sintomáticos
        kappa -> 1/periodo de incubação
        delta -> fator de infectividade de assintomaticos
    '''
    list_states = ['S', 'E', 'Ia', 'Is', 'R', 'Nw']
    states_names = ['Suscetíveis', 'Expostos', 'Infectados Assintomáticos', \
                    'Infectados', 'Recuperados', 'Casos Acumulados']
    def _eq_dif(self, t, X, pars):
        S, E, Ia, Is, R, Nw = X
        StE = S * pars['beta'] * (Is + pars['delta'] * Ia)
        dS = - StE
        dE = StE - pars['kappa'] * E
        dIa = (1-pars['p']) * pars['kappa'] * E - pars['gammaA'] * Ia
        dIs = pars['p'] * pars['kappa'] * E - pars['gamma'] * Is
        dR = pars['gammaA'] * Ia + pars['gamma'] * Is
        dNw = pars['p'] * pars['kappa'] * E
        return np.r_[dS, dE, dIa, dIs, dR, dNw]
    
class SEIIRD(SIR):
    '''
list_states = ['S', 'E', 'Ia', 'Is', 'R', 'D', 'Nw']
states_names = ['Suscetíveis', 'Expostos', 'Infectados Assintomáticos', \
                'Infectados', 'Recuperados', 'Mortes Acumuladas', \
                'Casos Acumulados']
    parametros: 
        beta, gamma -> igual SIR
        gammaA -> 1/duracao da fase infecciosa de assintomaticos
        p -> fração de sintomáticos
        kappa -> 1/periodo de incubação
        delta -> fator de infectividade de assintomaticos
        mu -> taxa de mortalidade de sintomáticos
    '''
    list_states = ['S', 'E', 'Ia', 'Is', 'R', 'D', 'Nw']
    states_names = ['Suscetíveis', 'Expostos', 'Infectados Assintomáticos', \
                    'Infectados', 'Recuperados', 'Mortes Acumuladas', \
                    'Casos Acumulados']
    def _eq_dif(self, t, X, pars):
        S, E, Ia, Is, R, dD, Nw = X
        StE = S * pars['beta'] * (Is + pars['delta'] * Ia)
        dS = - StE
        dE = StE - pars['kappa'] * E
        dIa = (1-pars['p']) * pars['kappa'] * E - pars['gammaA'] * Ia
        dIs = pars['p'] * pars['kappa'] * E - pars['gamma'] * Is
        dR = pars['gammaA'] * Ia + (1-pars['mu']) * pars['gamma'] * Is
        dD = pars['mu'] * pars['gamma'] * Is
        dNw = pars['p'] * pars['kappa'] * E
        return np.r_[dS, dE, dIa, dIs, dR, dD, dNw]


def calculate_SIR_model(N = 1000, I0 = 1, R0 = 0, beta = 0.02, gamma = 1/10, tmax = 365, mu = 0):
    print(type(mu))
    if (mu is None) or (mu == 0):
        output = SIR().calculate_model(locals())
    else:
        D0 = 0
        output = SIRD().calculate_model(locals())

    return output


def calculate_SEIR_model(N = 1000, I0 = 1, R0 = 0, E0=10, kappa = 1/5, beta = 0.02, gamma = 1/2, tmax = 365, mu=0):
    if (mu is None) or (mu == 0):
        output = SEIR().calculate_model(locals())
    else:
        D0 = 0
        output = SEIRD().calculate_model(locals())

    return output

def calculate_SEIIR_model(N = 1000, I0 = 1, R0 = 0, E0=10, kappa = 1/5, beta = 0.02, gamma = 1/10, gammaA= 1/2, delta=1, tmax = 365, p = 0.6, mu=0):
    Ia0 = 0
    Is0 = I0

    if (mu is None) or (mu == 0):
        output = SEIIR().calculate_model(locals())
    else:
        D0 = 0
        output = SEIIRD().calculate_model(locals())

    return output

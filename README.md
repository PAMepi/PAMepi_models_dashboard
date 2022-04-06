
# PAMepi Dashboard

This directory was created in order to predict the evolution of an epidemic through the SIR, SIHR and SIM epidemiological models.


## Current frontend

Insira um gif ou um link de alguma demonstração


## Running Locally

Clone the project

```bash
  git clone https://github.com/PAMepi/PAMepi_models_dashboard.git
```

Enter the project directory

```bash
  cd PAMepi_models_dashboard
```
### Running Frontend
Enter the frontend directory

```bash
  cd frontend
```

Install the frontend dependencies

```bash
  npm install
```

Start the server

```bash
  ng serve
```
### Running Backend 

Enter the backend directory

```bash
  cd backend
```

Create Environment

```bash
  conda env create -f environment.yml
```

Active Fastapi

```bash
  conda activate fastapi
```

Start the server

```bash
  uvicorn main:app --reload
```


## Deploy Links

#### Site: https://pamepi.github.io/PAMepi_models_dashboard/

#### Api: https://polar-cliffs-29261.herokuapp.com/api


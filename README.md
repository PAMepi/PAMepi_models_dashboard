
# PAMepi Dashboard

This directory was created in order to predict the evolution of an epidemic through the SIR, SIHR and SIM epidemiological models.


## Current Frontend

![S_442022_174907](https://user-images.githubusercontent.com/73593492/161871097-eca9f82d-7a5a-4b8f-9542-eda9a7341598.png)


![S_442022_175013](https://user-images.githubusercontent.com/73593492/161871139-73f733dc-423e-40ce-a708-cca2bef50022.png)




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


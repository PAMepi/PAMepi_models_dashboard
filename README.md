
# PAMepi Dashboard

This directory contains code of a dashboard used to explore and compare epidemiological models aiming to predict the evolution of an epidemic.


## Current Frontend

![image](https://user-images.githubusercontent.com/73593492/162827456-5d4e146f-3bd3-4a05-88bb-1bebca66ede1.png)


![image](https://user-images.githubusercontent.com/73593492/162827566-030d1886-5ac2-4d70-a1d3-5358cd464dce.png)




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

#### Api: https://app-dashboard-covid.herokuapp.com/


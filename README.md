# relnod
Node relation project

## Setup

Run Docker containers

```bash
cd docker/relnod
docker-compose up -d
```

## Data Init

Dummy data in: backend/relnod/core/management/command

## Config

There are engines and config files inside "backend/relnod/core/".
You can define database further engines and views to make connection. 

### config.py

* ACTION_MAP: Defines the methods that will be show on frontend
* VIEW_MAP: Defines DB connection engines, DSNs, and table names that are mapped to
            "methods" in ACTION_MAP


## Usage

Go to page: https://localhost:3000

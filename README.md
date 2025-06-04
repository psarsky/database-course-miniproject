# Ski rental database project
## Authors
- Dariusz Rozmus
- Jakub Psarski

## First start

### 1st Powershell .../server:
docker-compose up --build

### 2nd Powershell .../server:
- docker exec -it mongodb mongosh
- rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "127.0.0.1:27017" }] });
- exit

### 3rd Powershell .../server:
npm start

### 4th Powershell .../client:
npm start
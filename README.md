# Student Management REST API

Express.js CRUD API using an in-memory array (no database).

## Run
```
npm install
npm start      # http://localhost:3000
```

## Endpoints
| Method | URL | Success | Errors |
|---|---|---|---|
| GET | /students | 200 | |
| GET | /students/:id | 200 | 400 bad id, 404 |
| POST | /students | 201 | 400 |
| PUT | /students/:id | 200 | 400, 404 |
| DELETE | /students/:id | 200 | 400, 404 |

Body (POST/PUT): `{ "name": "Neha", "age": 22, "course": "CS", "email": "neha@example.com" }` (email optional)

## Structure
app.js · routes/studentRoutes.js · middleware/logger.js · data/students.js

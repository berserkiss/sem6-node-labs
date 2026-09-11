# Node.js Coursework

Labs covering Node.js, protocols (WebSocket, gRPC-style TCP/UDP, mTLS), databases
(MongoDB, SQL Server via Sequelize), APIs (GraphQL, REST, Swagger), auth (Basic/Digest,
JWT), NestJS, WebAssembly, and two full-stack (React + Express) projects.

## Structure

| Folder | Topic |
| --- | --- |
| `l11/` | WebSocket exercises |
| `L12_C++/` | TCP/UDP client-server sockets (C++) |
| `l14/` | HTTP server basics |
| `l15/` | MongoDB-backed travel agency API |
| `l16/` | GraphQL API |
| `l17/` | Exercises 17-01 to 17-05 |
| `l18/` | Sequelize ORM |
| `l19/` | SQL Server-backed users REST API (controllers/models/routes) |
| `l21/` | Basic auth demo |
| `l22/` | mTLS — self-signed CA and client certificates |
| `lab21/` | Basic and Digest HTTP authentication (a second pass at l21's topic) |
| `lab24/` | File upload exercise |
| `lab26/` | WebAssembly (C compiled to wasm) |
| `lab27/` | Chat bot |
| `lab28/` | REST API with Swagger/OpenAPI docs |
| `nest-ex/` | NestJS auth module (JWT + local strategy) |
| `try/` | Full-stack app (React client + Express server) |
| `try2/` | Full-stack app, second iteration (React client + Express server) |

Each folder is an independent Node (or, for `L12_C++`, CMake) project with its own
`package.json`/dependencies.

## Setup

Every lab installs independently:

```bash
cd <lab-folder>
npm install
```

`try/` and `try2/` are split into `client/` and `server/` — install and run each
separately.

## Not tracked in this repo

- `node_modules/` — run `npm install` in the lab you want
- `.env` files — some labs read DB/JWT config from a local `.env`; create your own
  next to the script (`nest-ex/.env.sample` shows the expected shape)
- Build output (`dist/`, `build/`, `cmake-build-debug/`)
- Lecture/assignment handouts (`.docx`) — coursework material, not code

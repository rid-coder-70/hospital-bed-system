# HealthBed AI - Backend API (Node.js)

This module handles the core centralized logic, database execution, JWT authentication, and instantaneous WebSocket broadcasting for the HealthBed AI infrastructure. 

## Features
- **Pessimistic Locking**: Prevents overbooking of critical beds using PostgreSQL `FOR UPDATE` transaction safety.
- **Scale-Ready WebSockets**: Dispatches emergency notifications and bed capacity updates securely via `socket.io`.
- **RBAC**: Multi-tiered Role-Based Access Control enforcing strict separation between Patients, Hospital Administrators, and System Dispatchers.
- **Proxy Communication**: Acts as the central traffic broker between the public clients and the external Python AI microservice.

## Tech Stack
- **Framework**: Node.js & Express.js
- **Database**: PostgreSQL (pg)
- **Live Sync**: Socket.io
- **Security**: JWT & bcrypt

## Local Development Setup
1. `npm install`
2. Setup your `.env` following `.env.example`
3. Initialize the PostgreSQL database.
4. Run `npm run dev` (Starts on `http://localhost:5000`)

## Deployment
Designed for stateful deployment targets like Railway, Render, or AWS. 
*(Do not deploy this module to Serverless platforms like Vercel, as Serverless functions terminate instantly and cannot maintain active WebSocket tunnels).*

#  PeerAid – Peer-to-Peer Tutoring Platform

PeerAid is a full-stack web platform that connects students and tutors to create, join, and manage study sessions.  
Built as a **Senior Capstone Project** at UNC Greensboro, the app promotes collaborative learning through scheduling, chat, feedback, and AI-based tutor matching.

---

##  Demo Video  
[Watch the PeerAid Demo on YouTube](https://youtu.be/VkaP2FdABv0)

---

##  Overview
- Secure signup/login with **JWT authentication**
- Role-based access: **Student, Tutor, Admin**
- Real-time chat using **Socket.IO**
- Session scheduling with **FullCalendar**
- AI-powered tutor matching via **OpenAI API**
- Cloud-based profile image upload (Supabase)
- Admin dashboard for analytics, reports, and feedback

---

##  Tech Stack
**Frontend:** HTML, CSS, Bootstrap, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** PostgreSQL (via Sequelize ORM)  
**Tools:** JWT, Bcrypt, Multer, Helmet, OpenAI, Supabase

---

##  My Role — Shaka Ombongi
**Full Stack Developer | Database Architect | System Integrator**

- Designed and managed the **PostgreSQL database** (users, sessions, feedback, reports).  
- Built and connected **backend APIs** for sessions, reporting, reviews, dashboards, and admin tools.  
- Developed **secure authentication** and **role-based access control**.  
- Integrated **frontend logic** using Fetch API for dynamic session management and dashboards.  
- Implemented **cloud uploads** and optimized database performance.  
- Led full-stack integration and system reliability testing.  

---

##  Team Members
**Allison Weavil:** UI design, responsiveness, FullCalendar integration  
**Carissa Boddie:** Chat system (Socket.IO), Admin dashboard styling  
**Nick Brandsma:** AI quiz + tutor matching using OpenAI API  

---
How to run code:

Make sure the following is installed:
```bash
npm install
npm install --save-dev nodemon
npm install cookie-parser express dotenv bcrypt jsonwebtoken pg
npm install sequelize pg pg-hstore
npm list sequelize
npm install -g nodemon
npm install dotenv
npm install sequelize pg pg-hstore
npm install helmet
npm install multer
npm install node-fetch
npm install openai

Run “node app.js”


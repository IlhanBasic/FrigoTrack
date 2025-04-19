# FrigoTrack - Warehouse Management System 🍓❄️

A full-stack warehouse management system for cold storage facilities in Serbia.  
Used for tracking fruit inventory, transactions, and document generation (PDF/Excel).

![FrigoTrack Logo](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Flogo.png?alt=media&token=79f3c8d8-ddad-4903-a518-4c6e3e8fce90)
  
  [![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)

</div>

## 🚀 Key Features
- **Cold room monitoring** (temperature, capacity)
- **Product management** (fruits, batches, quantities,selling,buying,...)
- **Payments management** (paying documents)
- **Document management & export** (PDF,Excel)
- **Real-time analytics** (sales, stock levels)
- **Multi-user access control**
- **AI chat** (assistant for help)
- **Real-time chat** (between users)
## 💻 Tech Stack
**Frontend:**  
- React.js
- HTML & CSS  
- Redux  
- React Router  
- Recharts  
- React Toastify  
- OpenAI API  


**Backend:**  
- Node.js  
- Express  
- MongoDB  
- Socket.IO  

**DevOps:**  
- Render


## 🔧 Installation
1. Clone the repository:
```bash
git clone https://github.com/IlhanBasic/FrigoTrack.git
cd FrigoTrack
```
2. Set up backend:
```bash
cd backend
npm install
cp .env.example .env
npm start
```
3. Run frontend:
```bash
cd ../frontend
npm install
npm run dev
```
### 📡 Backend API Endpoints

**Users:**  
- `POST /api/users/register`  
- `POST /api/users/login`  

**Products:**  
- `GET /api/products`, `POST`, `PUT`, `DELETE`

**Documents:**  
- `GET /api/documents`, `POST`, `PUT`

**Partners, ColdRooms, Payments:**  
- Standard CRUD (`GET`, `POST`, `PUT`, `DELETE`)

## 🌐 Frontend Routes (Main Pages)

- 🏠 `/` – Home / Dashboard  
- 🍓 `/products` – Manage Products  
- 📄 `/documents` – Sales / Purchases / Transfers  
- 💸 `/payments` – Payment Records  
- 🧑‍🌾 `/partners` – Suppliers / Customers  
- 🧊 `/rooms` – Cold Room Overview  
- 📊 `/stats` – Reports & Visual Analytics  
- 🔐 `/auth` – Login  
- 📝 `/register` – Register New User  

## 📷 Screenshots

| Dashboard | Products | Rooms |
|-----------|----------|-------|
| ![Dashboard](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Fhome.png?alt=media&token=c949cdec-b602-46e3-80bb-b670a6c750a2) | ![Products](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Fproducts.png?alt=media&token=b382b869-e08d-4198-82f4-01e270a5b432) | ![Rooms](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Frooms.png?alt=media&token=5a78bb08-5b1e-4dab-a3e7-d5e8291373be) |
| *Dashboard* | *Products* | *Rooms* |

| Documents | Payments | Stats |
|-----------|----------|-------|
| ![Documents](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Fdocuments.png?alt=media&token=83687c5c-820e-443b-ae02-0bccf971c0ca) | ![Payments](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Fpayments.png?alt=media&token=c3f2957b-fcb9-4cc5-bbdc-85921d69d6a9) | ![Stats](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Fstats.png?alt=media&token=f78c7f7c-1ac3-4f6f-b098-9c0f44f9d58e) |
| *Documents* | *Payments* | *Stats* |

| Assistant | Login | Register |
|-----------|--------|----------|
| ![Assistant](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Fassistent.png?alt=media&token=a9eced62-e7ce-4ee3-822f-683382848532) | ![Login](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Flogin.png?alt=media&token=97cae093-c766-4fc4-be6f-408bb03a5c8a) | ![Register](https://firebasestorage.googleapis.com/v0/b/rentorabackendimages.appspot.com/o/frigotrack%2Fregister.png?alt=media&token=df1d2724-3e8e-4ba5-8a3d-f1d5cccce5c3) |
| *Assistant* | *Login* | *Register* |
## 📄 Required Environment Variables
Feel free to use and modify this project! Below are the required .env files for each part of the application.
Frontend:
```env
VITE_API_URL=https://frigotrack-backend.onrender.com/api
VITE_GITHUB_TOKEN=your
VITE_API_ENDPOINT=your
```
Backend:
```env
MONGO_URI=your
JWT_SECRET=your
PORT=5000
NODE_ENV=production
```

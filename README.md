# Anvaya CRM App Backend
A scalable and secure CRM backend built with Node.js and Express.js, designed to manage leads, sales agents, and performance tracking with JWT-based authentication and a MongoDB database.

---

## DEMO Link
🔗 [Live Demo](https://anvaya-crm-app-frontend.vercel.app/)

---

## ⚙️ Quick Start
```bash
# Clone the repository
git clone https://github.com/Jaytun-Kankotiya/Anvaya-CRM-App-Backend.git

# Navigate to the project directory
cd Anvaya CRM App Backend

# Install dependencies
npm install or yarn install

# Start the server
npm start 
# or 
yarn start 

# Start the server (development with auto-reload)
npm run server
# or
yarn server

``` 

**Technologies Used:**
- **Backend Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **API Client:** Axios
- **Authentication:** JWT-based secure authentication
- **Environment Variables:** dotenv
- **Development Tool::** Nodemon for hot reloading

--- 

## Features

**🏠 Dashboard**
- Displays active leads and their key metrics.
- Filter leads by status, priority, or source.

**🔐 Authentication**
- Secure user registration and login.
- JWT-based protected routes for all lead and agent operations.
- Passwords hashed using bcrypt.

**⚡ Additional Highlights**
- RESTful API design following best practices.
- Centralized error handling and response structure.
- CORS-enabled for frontend integration.
- Modular route and controller architecture for scalability.

---

## 📚 API Reference

### **POST /register**</br>

Create a new user</br>
Sample Response:</br>

```
{
  "userId": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

### **Post /login**</br>
Authenticate an existing user</br>
Sample Response:</br>
```
{
  "userId": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

### **Post /leads**</br>
Add a new Lead</br>
Sample Response:</br>

```
{
  "_id": "lead123",
  "name": "Acme Corp",
  "source": "LinkedIn",
  "salesAgent": "Alice",
  "status": "Active",
  "tags": ["High Priority"],
  "timeToClose": "7 days",
  "priority": "High"
}
```

### **GET /leads**</br>
Retrieves all the active leads</br>
Sample Response:</br>

```
[
  {
    "_id": "lead123",
    "name": "Acme Corp",
    "source": "LinkedIn",
    "salesAgent": "Alice",
    "status": "Active",
    "tags": ["High Priority"],
    "priority": "High"
  },
  ...
]

```

### **Post /agents**</br>
Add a new sales agent</br>
Sample Response:</br>

```
{
  "_id": "agent123",
  "name": "Alice",
  "email": "alice@crm.com"
}
```
### **GET /agents**</br>
etrieves all the active sales agents</br>
Sample Response:</br>

```
[
  {
    "_id": "agent123",
    "name": "Alice",
    "email": "alice@crm.com"
  },
  ...
]
```
---

## 🧠 Future Enhancements
- 📈 Role-based access control (Admin, Manager, Agent)
- 🗓️ Lead activity timeline & follow-up reminders
- 📬 Email notifications for new assignments
- 🧾 Export leads to CSV or Excel
- 📊 Advanced analytics dashboard

## 📬 Contact

For any questions, suggestions, or feature requests, feel free to reach out:</br>
📧 jaytunkankotiya81@gmail.com</br>
💼 [GitHub Profile](https://github.com/Jaytun-Kankotiya)




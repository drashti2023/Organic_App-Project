# 🌿 Organic App - MEAN Stack Online Shopping Website

## 📌 Project Overview
The **Organic App** is an online shopping platform that provides users with a seamless e-commerce experience. Customers can browse, search, and purchase products across various categories, while administrators have tools to efficiently manage products, users, and orders. The project is built using the **MEAN stack** (MongoDB, Express.js, Angular, Node.js) for a scalable and feature-rich application.

## 🛠 Technology Stack
### **Backend**
- **Node.js** - Server-side runtime environment
- **Express.js** - Web framework for API development
- **MongoDB** - NoSQL database for storing users, products, and orders
- **JWT (JSON Web Token)** - Secure user authentication
- **Bcrypt** - Password hashing for security

### **Frontend**
- **Angular** - Frontend framework for a dynamic and responsive UI
- **Bootstrap/Tailwind CSS** - Ensuring a mobile-friendly design
- **Template Used:** [Organic Theme](https://themewagon.com/themes/organic/)

### **Payment Integration**
- **Cash on Delivery (COD)** - Primary payment method for now

### **Security Measures**
- **Data Encryption** - Ensuring sensitive data is secure
- **Authentication & Authorization** - Role-based access control (RBAC) using **JWT and Bcrypt for authentication and password hashing**
- **Input Validation** - Protecting against SQL injection and XSS attacks

## 🔑 Key Features
### **1. User Management**
- User Registration & Login (Email/Password Authentication using **JWT and Bcrypt** for secure hashed passwords)

### **2. Product Management**
- Product Listing
- Product Details with Images

### **3. Shopping Cart & Orders**
- Add to Cart, Update Quantity, Remove Items
- Save Products for Later
- Order Placement

## 📂 Project Structure
```
/Organic_App
│── /client      # Angular frontend
│── /server      # Node.js backend (Express.js & MongoDB)
│── README.md    # Project documentation
│── .gitignore   # Ignored files
│── package.json # Dependency management
```

## 🚀 Installation & Setup
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/drashti2023/Organic_App-Project.git
cd Organic_App
```

### **2️⃣ Install Dependencies**
```sh
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### **3️⃣ Setup Environment Variables**
Create a `.env` file in the `server/` folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### **4️⃣ Run the Project**
```sh
# Start the backend server
cd server
npm start

# Start the Angular frontend
cd ../client
ng serve
```

## 🎯 Conclusion
The **Organic App** provides a secure and feature-rich online shopping platform using modern technologies. With robust authentication, efficient product management, and a seamless shopping experience, this project aims to deliver an intuitive and scalable e-commerce solution.

---
🚀 **Happy Coding!** Feel free to contribute and improve the project! 😊


Here’s a complete `README.md` file for your **Splitara** project that you can directly add to your GitHub repository:

---

````markdown
# 💸 Splitara – Room & Trip Expense Splitter

**Splitara** is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to simplify and automate shared expense management among roommates, friends, or travel groups. With an intuitive UI and powerful backend, it ensures every participant knows their dues and settlements with complete transparency.

---

## 🚀 Features

- 🔐 **Authentication** – Register, Login, JWT-based secure access
- 🏠 **Room Management** – Create, view, and delete rooms
- 👥 **Participants** – Add/remove participants via email (even if they’re not registered)
- 💰 **Expense Tracker** – Add expenses, auto-split amounts, show owed balances
- 📧 **Email Notifications** – Real-time notifications when participants are added or expenses are recorded
- 📊 **Dashboard** – Visual overview of rooms, expenses, and settlements
- 🧾 **Settlement Summary** – Shows how much each participant owes to others
- 📦 **Fully Responsive UI** – Built using Vite + React, supports all devices

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Axios, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Compass & Atlas)
- **Authentication**: JWT
- **Email Service**: Nodemailer + Gmail SMTP
- **Deployment**: Netlify (Frontend) & Render (Backend)

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Nithin134/Splitara.git
cd Splitara
````

### 2. Setup backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/React
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Start the backend server:

```bash
npm start
```

### 3. Setup frontend

```bash
cd ../client
npm install
npm run dev
```

---

## 🌐 Deployment

* **Frontend**: Netlify
* **Backend**: Render

Make sure to:

* Add environment variables in Render for backend.
* Enable redirect rules on Netlify (`_redirects` file) to fix route refresh errors:

```
/*    /index.html   200
```

---

## 👤 Author

* **Nithin Tirukkovalluri**
  Email: [balajiraotirukkovalluri@gmail.com](mailto:balajiraotirukkovalluri@gmail.com)
  GitHub: [@Nithin134](https://github.com/Nithin134)

---

## 📜 License

This project is open-source and available under the MIT License.

```

Let me know if you'd like to add deployment URLs or screenshots!
```

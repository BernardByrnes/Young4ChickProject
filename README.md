Young4ChickS
Young4ChickS is a web application built with Node.js, Express, MongoDB, and Pug for managing poultry requests. It supports three user roles: Customer, Sales Representative (Rep), and Manager, allowing users to register with a specific role, submit requests for poultry (e.g., layers, broilers), approve requests, and manage stock. The app features a vibrant UI with green gradients and the Inter font.
Features

User Registration and Login: Users can register with a role (customer, rep, manager) and log in to access role-specific dashboards.
Customer: Submit poultry requests (/customer/request) and view requests (/customer/requests).
Rep: Record requests (/rep/request) and mark them as complete (/rep/complete).
Manager: Approve/reject requests (/manager/approve) and manage stock (/manager/stock).
Notifications: Users receive notifications for request submissions and updates.
Unauthenticated Routes: All routes are currently unprotected for debugging (authentication middleware removed).

Technologies

Backend: Node.js, Express
Frontend: Pug, CSS (Inter font, green gradients)
Database: MongoDB (MongoDB Atlas)
Dependencies: express, mongoose, jsonwebtoken, bcrypt (or bcryptjs), pug, nodemon, dotenv

Project Structure
young4chicks-project/
├── public/
│   ├── css/styles.css      # Vibrant CSS with green gradients
│   └── js/main.js          # Client-side form validation
├── views/
│   ├── auth/               # Login and register templates
│   ├── customer/           # Customer dashboard, request, requests
│   ├── rep/                # Rep dashboard, request, complete
│   ├── manager/            # Manager dashboard, approve, stock
│   └── layouts/main.pug    # Main layout
├── routes/
│   ├── auth.js             # Registration and login
│   ├── customer.js         # Customer routes
│   ├── rep.js              # Rep routes
│   ├── manager.js          # Manager routes
├── controllers/
│   ├── customerController.js
│   ├── repController.js
│   ├── managerController.js
├── models/
│   ├── User.js             # User schema with role
│   ├── Request.js          # Request schema
│   ├── Notification.js     # Notification schema
│   ├── Stock.js            # Stock schema
├── .env                    # Environment variables
├── app.js                  # Main app
└── package.json

Setup Instructions

Clone the Repository:
git clone <repository-url>
cd young4chicks-project


Install Dependencies:
npm install

Install bcrypt or bcryptjs:
npm install bcrypt
# OR
npm install bcryptjs


Set Up Environment Variables:Create a .env file in the root directory:
MONGODB_URI=mongodb+srv://bernardtambo40:<password>@cluster0.<id>.mongodb.net/young4chicks
JWT_SECRET=your_secret_key_here
PORT=3000


Start MongoDB:Ensure MongoDB Atlas is accessible or run a local MongoDB instance:
mongod


Start the Server:
npm start
# OR with nodemon
nodemon app.js

Access the app at http://localhost:3000.


Usage

Register:

Go to http://localhost:3000/auth/register.
Fill in details (name, email, password, age, gender, NIN, recommender, contact, role).
Select role: customer, rep, or manager.
Redirects to respective dashboard.


Login:

Go to http://localhost:3000/auth/login.
Use credentials (e.g., johndenis@gmail.com / Farm123!).
Redirects based on role.


Test Users:

Customer: johndenis@gmail.com / Farm123! (ID: 689f2332d1d614a142cda8e2)
Manager: marywanjiku@young4chicks.com / Manager123!
Rep: petermwangi@young4chicks.com / Rep123!
Register new users:
Customer: testcustomer@example.com / Test123!
Rep: testrep@example.com / Test123!
Manager: testmanager@example.com / Test123!




Customer Actions:

Submit request: http://localhost:3000/customer/request (e.g., layers, local, 100, experienced).
View requests: http://localhost:3000/customer/requests.


Rep Actions:

Record request: http://localhost:3000/rep/request.
Complete request: http://localhost:3000/rep/complete.


Manager Actions:

Approve/reject: http://localhost:3000/manager/approve.
Add stock: http://localhost:3000/manager/stock.
View stock: http://localhost:3000/manager/stocks.



Debugging

Form Submission Issue (/customer/request):

If alert: Failed to submit request. Please try again., check:
Browser console (F12): Response status, Submission error.
Network tab: POST /customer/request status.
Terminal: POST /customer/request received.


If CSRF enabled, add to app.js:const csrf = require('csurf');
app.use(csrf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

Add to views/customer/request.pug:input(type='hidden', name='_csrf', value=csrfToken)

Update public/js/main.js:body: new URLSearchParams({
  _csrf: form.querySelector('input[name="_csrf"]').value,
  type,
  breed,
  quantity,
  farmerType,
}),




Database Check:
mongosh "mongodb+srv://bernardtambo40:<password>@cluster0.<id>.mongodb.net/young4chicks"

use young4chicks
db.users.find().pretty()
db.requests.find().pretty()
db.notifications.find().pretty()



Notes

Routes are currently unauthenticated for debugging. Re-enable authMiddleware in routes/ files for production.
Ensure styles.css and main.js are loaded in views/layouts/main.pug:link(rel='stylesheet', href='/css/styles.css')
script(src='/js/main.js')


UI uses vibrant green gradients and Inter font (loaded from Google Fonts).

Author
Bernard Tambo

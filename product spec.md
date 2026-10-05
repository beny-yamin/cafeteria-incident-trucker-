# Directory structure
university-food-quality-system/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── firebase.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── DiningHall.js
│   │   │   └── IncidentReport.js
│   │   │
│   │   ├── repositories/
│   │   │   ├── UserRepository.js
│   │   │   ├── DiningHallRepository.js
│   │   │   └── IncidentReportRepository.js
│   │   │
│   │   ├── services/
│   │   │   ├── UserService.js
│   │   │   ├── DiningHallService.js
│   │   │   ├── IncidentReportService.js
│   │   │   └── AuthenticationService.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── UserController.js
│   │   │   ├── DiningHallController.js
│   │   │   ├── IncidentReportController.js
│   │   │   └── AuthenticationController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   ├── diningHallRoutes.js
│   │   │   ├── incidentReportRoutes.js
│   │   │   └── authenticationRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticationMiddleware.js
│   │   │   ├── authorizationMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── validators/
│   │   │   ├── userValidator.js
│   │   │   ├── diningHallValidator.js
│   │   │   └── incidentReportValidator.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   └── constants.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── context/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── config/
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
│
├── .gitignore
└── README.md
# tech stack
Frontend
├── React
└── JavaScript + Vite

Backend
├── Node.js
└── Express.js

Database
├── MongoDB
└── Mongoose

Authentication
└── Firebase Authentication

Backend Utilities
├── dotenv
└── cors

File Upload
└── Multer

Development
├── npm
└── Git
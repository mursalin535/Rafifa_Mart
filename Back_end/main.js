const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
// var rollbar = require('./rollbar');

require('dotenv').config();

const app = express();

const sessionMiddleware = require('./DataBase/Session');
const passport = require('./DataBase/Passport');   // ← নতুন

const Health=require('./router/Health');
const Add_product=require('./router/Add_product');
const Product_image=require('./router/Product_image');
const Rating=require('./router/Rating');
const Offer=require('./router/Offer');
const Order_item=require('./router/Order_item');
const Order=require('./router/Order');
const Bottle=require('./router/Bottle');
const Customer=require('./router/Customer');
const Address=require('./router/Address');
const Auth=require('./router/Auth');
const AdminAuth=require('./router/AdminAuth');

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: process.env.CORS_METHODS || 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400,
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());    // ← নতুন, sessionMiddleware-এর পরে বসবে
// app.use(rollbar.errorHandler());

app.use(Health);
app.use(Auth);
app.use(AdminAuth);
app.use(Add_product);
app.use(Product_image);
app.use(Rating);
app.use(Offer);
app.use(Order_item);
app.use(Order);
app.use(Bottle);
app.use(Customer);
app.use(Address);

app.use((err, req, res, next) => {
    console.error("Global Error:", err.message);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    res.status(err.status || 400).json({
        success: false,
        message: err.message || "An unexpected error occurred"
    });
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
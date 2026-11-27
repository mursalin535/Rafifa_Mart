const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cookieParser = require('cookie-parser');
// var rollbar = require('./rollbar');

require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

// দরকারি env না থাকলে সার্ভার চালুই হবে না (ভুল কনফিগে অর্ধেক ভাঙা অবস্থায় চলার চেয়ে ভালো)
(function assertEnv() {
    const missing = [];
    if (!process.env.SESSION_SECRET) missing.push('SESSION_SECRET');
    if (isProd) {
        for (const key of ['FRONTEND_URL', 'CORS_ORIGINS', 'GOOGLE_CALLBACK_URL', 'DATABASE_PASSWORD']) {
            if (!process.env[key]) missing.push(key);
        }
    }
    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
})();

const app = express();

// proxy-র পিছনে (প্রায় সব হোস্টিং) থাকলে এটা লাগেই: নইলে secure cookie সেট হয় না আর
// rate limit সবাইকে একই IP ভাবে। মান = proxy কয়টা (সাধারণত 1)।
if (process.env.TRUST_PROXY) {
    const v = process.env.TRUST_PROXY;
    app.set('trust proxy', /^\d+$/.test(v) ? Number(v) : v);
} else if (isProd) {
    console.warn('TRUST_PROXY is not set. If the server runs behind a proxy/load balancer, set TRUST_PROXY=1 (otherwise login cookies and rate limits will not work).');
}

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
    // login cookie-র জন্য এটা চালুই থাকতে হয়, তাই ডিফল্ট true (বন্ধ করতে চাইলে CORS_CREDENTIALS=false)
    credentials: process.env.CORS_CREDENTIALS !== 'false',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400,
};

// আপলোডের ফোল্ডার না থাকলে নিজে তৈরি করে (নতুন সার্ভারে git থেকে খালি ফোল্ডার আসে না)
for (const dir of ['products', 'offers']) {
    fs.mkdirSync(path.join(__dirname, 'uploads', dir), { recursive: true });
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger UI (API documentation) — শুধু development-এ, production-এ বন্ধ
if (!isProd) {
    const swaggerUi = require('swagger-ui-express');
    const openapiSpec = require('./openapi.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
}

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
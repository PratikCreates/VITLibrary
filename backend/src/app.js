const express = require("express");
const cors = require("cors");
const app = express();


const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const kycRoutes = require("./routes/kycRoutes");
const bookRoutes = require("./routes/bookRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(express.json());
app.use('/uploads', express.static('uploads'));

/* API ROUTES */

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', protectedRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;

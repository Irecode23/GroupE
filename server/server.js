const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/api/complaintRoutes');
const ratingRoutes = require('./routes/api/ratingRoutes');
const paymentRoutes = require('./routes/api/paymentRoutes');
const reportRoutes = require('./routes/api/reportRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Ridesharing API is running...' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
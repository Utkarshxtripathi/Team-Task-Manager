require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Basic Route (for testing)
app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

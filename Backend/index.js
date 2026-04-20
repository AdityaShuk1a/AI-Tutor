import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import interviewRoutes from './routes/interview.js';
import logger from './middlewares/logger.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(logger)
// Routes
app.use('/api/interview', interviewRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Cuemath Screener Server running on port ${PORT}`);
});
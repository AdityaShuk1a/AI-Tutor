import "dotenv/config";
import cors from "cors";
import express from "express";
import interviewRoutes from "./routes/interview.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", interviewRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Cuemath Screener Server running on port ${PORT}`);
});

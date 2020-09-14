import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/api';
import auth from './routes/auth';
import { PORT, DB_URI, MONGOOSE_OPTIONS } from './config';
import authenticateUser from './middlewares/authenticateUser';

const app = express();

// set up of routes to use
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());
app.use('/auth', auth);
app.use('/api', authenticateUser, apiRoutes);

mongoose.connect(DB_URI, MONGOOSE_OPTIONS);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});

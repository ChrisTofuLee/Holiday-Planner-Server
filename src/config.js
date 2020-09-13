export const PORT = process.env.PORT || 8000;

export const DB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/holidayPlanner';

export const MONGOOSE_OPTIONS = {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
};
export const AUTH_SECRET = process.env.AUTH_SECRET || 'test-secret';
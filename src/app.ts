import express, { Request, Response,Router } from 'express';
import setupSwagger from './swagger';
import userRoutes from './routes/userRoutes';
import errorHandler from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
// import profileRoutes from './routes/profileRoutes';


// Create a new express application instance
const app = express();

// Setup Swagger
setupSwagger(app);
// Middleware
app.use(express.json()); // Body parser middleware


// Routes
app.use('/service/user/api', userRoutes);
app.use('/service/auth/api', authRoutes);
// app.use('/api/v1/profile', profileRoutes);

// Define a route handler for the default home page
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!!!!!1212121!');
});

app.post('/', (req, res) => {
  // Handle registration logic
  console.log(req.body); // Check if body is being parsed correctly
  res.send('User Service endpoint');
});

// Error handling middleware
app.use(errorHandler);



export default app;

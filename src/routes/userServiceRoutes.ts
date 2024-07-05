// routes/userServiceRoutes.js
import express from 'express';
const router = express.Router();

// Import specific route modules
import authRoutes from './authRoutes';
//import profileRoutes from './profileRoutes';


// Routes for different modules
router.use('/', authRoutes);
//router.use('/profile', profileRoutes);

module.exports = router;

// routes/userServiceRoutes.js
import express from 'express';
const router = express.Router();

// Import specific route modules
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';


// Routes for different modules
router.use('/profile', profileRoutes);
router.use('/', authRoutes);


module.exports = router;

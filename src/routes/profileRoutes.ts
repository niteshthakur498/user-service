import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { updateProfileController } from '../controllers/profileController';

const   router = Router();


router.get('/', (req, res) => {
    // Handle registration logic
    console.log(req.body); // Check if body is being parsed correctly
    res.send('User Profile endpoint');
  });


router.put('/', authMiddleware , updateProfileController);



export default router;
import { Router } from 'express';
import { loginController, refreshTokenController } from '../controllers/authController';
import { registerUser } from '../controllers/userController';

const router = Router();


/**
 * @swagger
 * /service/user/api/register:
 *   post:
 *     summary: Register/Sign-Up a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: String
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: johndoe@example.com
 *               username: john_doe
 *               password: password123
 *     responses:
 *       201:
 *         description: User Registered Successfully
 *       401:
 *         description: Validation Error
 *       402:
 *         description: Conflict - User already exists with the provided Username/Email
 *       500:
 *         description: Error registering user 
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /service/user/api/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 accessTokenExpiresIn:
 *                   type: number
 *                 refreshTokenExpiresIn:
 *                   type: number
 *       400:
 *         description: Bad request - Invalid request payload or missing fields
 *       401:
 *         description: Unauthorized - Invalid email or password
 */
router.post('/login', loginController);

/**
 * @swagger
 * /service/user/api/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: <refresh_token_here>
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 accessTokenExpiresIn:
 *                   type: number
 *                 refreshTokenExpiresIn:
 *                   type: number
 *       400:
 *         description: Bad request - Invalid request payload or missing fields
 *       401:
 *         description: Unauthorized - Invalid refresh token
 */
router.post('/refresh-token', refreshTokenController);

export default router;
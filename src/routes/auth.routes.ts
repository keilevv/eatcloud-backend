import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/authenticate';
import { loginValidator, registerValidator, validate } from '../validators';

const authRouter: Router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account with a hashed password. Duplicate emails are rejected.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             successfulRegistration:
 *               summary: Successful registration
 *               value:
 *                 name: Jane Doe
 *                 email: jane@example.com
 *                 password: securePass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterSuccessResponse'
 *             examples:
 *               successfulRegistration:
 *                 summary: Successful registration
 *                 value:
 *                   success: true
 *                   message: User registered successfully
 *                   data:
 *                     id: 550e8400-e29b-41d4-a716-446655440000
 *                     name: Jane Doe
 *                     email: jane@example.com
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               invalidEmail:
 *                 summary: Invalid email format
 *                 value:
 *                   success: false
 *                   message: Validation failed
 *                   errors:
 *                     - field: email
 *                       message: Invalid email format
 *       409:
 *         description: Duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               duplicateEmail:
 *                 summary: Duplicate email
 *                 value:
 *                   success: false
 *                   message: Email already registered
 *                   errors: []
 */
authRouter.post(
  '/register',
  validate(registerValidator),
  authController.register,
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login with email and password
 *     description: Authenticates a user and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             successfulLogin:
 *               summary: Successful login
 *               value:
 *                 email: jane@example.com
 *                 password: securePass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponse'
 *             examples:
 *               successfulLogin:
 *                 summary: Successful login
 *                 value:
 *                   success: true
 *                   message: Login successful
 *                   data:
 *                     token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       id: 550e8400-e29b-41d4-a716-446655440000
 *                       name: Jane Doe
 *                       email: jane@example.com
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               wrongPassword:
 *                 summary: Wrong password
 *                 value:
 *                   success: false
 *                   message: Invalid email or password
 *                   errors: []
 */
authRouter.post('/login', validate(loginValidator), authController.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current authenticated user
 *     description: Returns the profile of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeSuccessResponse'
 *             examples:
 *               successfulMe:
 *                 summary: Successful /me response
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 550e8400-e29b-41d4-a716-446655440000
 *                     name: Jane Doe
 *                     email: jane@example.com
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: Missing token
 *                 value:
 *                   success: false
 *                   message: Authentication token is missing
 *                   errors: []
 *               expiredToken:
 *                 summary: Expired token
 *                 value:
 *                   success: false
 *                   message: Token has expired
 *                   errors: []
 *               invalidToken:
 *                 summary: Malformed token
 *                 value:
 *                   success: false
 *                   message: Invalid or malformed token
 *                   errors: []
 */
authRouter.get('/me', authenticate, authController.me);

export { authRouter };

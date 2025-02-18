import express from 'express';
import { signup,login } from '../controllers/authController.js'; 
import {disableTwoFactor, enableTwoFactor,verifyTwoFactor} from '../controllers/twoFactorController.js'
import {user} from '../controllers/userController.js'
import { authenticateToken } from '../middleware/middlewares.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login',login);
router.post('/2fa/enable',authenticateToken,enableTwoFactor);
router.post('/2fa/verify',authenticateToken,verifyTwoFactor);
router.post('/2fa/disable',authenticateToken,disableTwoFactor);
router.get('/user',authenticateToken,user)


export default router;

import express from 'express';
import { signup,login } from '../controllers/authController.js'; 
import {disableTwoFactor, enableTwoFactor,verifyTwoFactor} from '../controllers/twoFactorController.js'
import {user,updateUserProfile} from '../controllers/userController.js'
import { authenticateToken } from '../middleware/middlewares.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/profiles'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });
  
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/signup', signup);
router.post('/login',login);
router.post('/2fa/enable',authenticateToken,enableTwoFactor);
router.post('/2fa/verify',authenticateToken,verifyTwoFactor);
router.post('/2fa/disable',authenticateToken,disableTwoFactor);
router.get('/user',authenticateToken,user)
router.post('/user/profile', authenticateToken, upload.single('profileImage'), updateUserProfile);  // New route for profile update


export default router;

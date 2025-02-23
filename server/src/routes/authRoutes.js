import express from 'express';
import { signup,login, logout,logoutAll } from '../controllers/authController.js'; 
import {disableTwoFactor, enableTwoFactor,verifyTwoFactor} from '../controllers/twoFactorController.js'
import {user,updateUserProfile,getActiveSessions,changePassword} from '../controllers/userController.js'
import { authenticateToken ,checkSessionStatus} from '../middleware/middlewares.js';
import { getLastActivity } from '../controllers/userController.js';
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
router.post('/2fa/enable',checkSessionStatus,authenticateToken,enableTwoFactor);
router.post('/2fa/verify',checkSessionStatus,authenticateToken,verifyTwoFactor);
router.post('/2fa/disable',checkSessionStatus,authenticateToken,disableTwoFactor);
router.get('/user',authenticateToken,checkSessionStatus,user)
router.post('/user/profile',checkSessionStatus, authenticateToken, upload.single('profileImage'), updateUserProfile);  
router.get('/last-activity',checkSessionStatus, authenticateToken,getLastActivity); 
router.post('/logout',logout)
router.post('/activeSessions',authenticateToken,getActiveSessions)
router.post('/logoutAll',authenticateToken,logoutAll)
router.post('/updatePass',checkSessionStatus,authenticateToken,changePassword)

export default router;

import express from 'express' ; 
import { getMe, logout, signIn, signUp } from '../controllers/auth.controller.js';
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router() ; 

router.post('/signUp',signUp) ; 
router.get('/logout',logout) ; 
router.post('/signIn',signIn) ; 
router.get('/getMe',checkAuth,getMe) ; 
export default router ;
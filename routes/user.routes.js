import express from 'express' ; 
import { getPublicProfile, getSuggestedUsers, updateProfile } from '../controllers/user.controller.js';
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router() ; 

router.get('/suggestions',checkAuth,getSuggestedUsers) ; 
router.get('/:username',getPublicProfile) ;
router.put('/profile',checkAuth,updateProfile) ; 






export default router ;
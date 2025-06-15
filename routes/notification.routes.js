import express from 'express' ; 
import checkAuth from '../middleware/checkAuth.js';
import { deleteNotification, getAllNotifications } from '../controllers/notification.controller.js';

const router = express.Router() ;

router.get('/',checkAuth,getAllNotifications) ;
router.put('/read/:id',checkAuth,getAllNotifications) ; 
router.delete('/:id',checkAuth,deleteNotification) ; 



export default router ; 

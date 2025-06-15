import express from 'express';
import { acceptConnectionRequest, getConnectionsRequests, getConnectionStatus, getUserConnections, rejectConnectionRequest, removeConnection, sendConnectionRequest } from '../controllers/connections.controller.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router() ; 

router.post('/request/:userId',checkAuth,sendConnectionRequest) ; 
router.put('/accept/:requestId',checkAuth,acceptConnectionRequest) ; 
router.put('/reject/:requestId',checkAuth,rejectConnectionRequest) ;

router.get('/requests',checkAuth,getConnectionsRequests) ; 

router.get('/',checkAuth,getUserConnections) ; 
router.delete('/:userId',checkAuth,removeConnection) ; 
router.get("/status/:userId",checkAuth,getConnectionStatus)

export default router ; 
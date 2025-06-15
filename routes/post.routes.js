import express from 'express' ; 
import checkAuth from '../middleware/checkAuth.js';
import { createComment, createPost, deletePost, getFeedPosts, getPostById, likePost } from '../controllers/post.controller.js';

const router = express.Router() ; 

router.get('/',checkAuth,getFeedPosts) ;
router.post('/create',checkAuth,createPost) ;
router.delete('/delete/:id',checkAuth,deletePost) ; 
router.post('/comment/:id',checkAuth,createComment) ;
router.get('/:id',checkAuth,getPostById) ; 
router.post('/like/:id',checkAuth,likePost) ;

export default router ;
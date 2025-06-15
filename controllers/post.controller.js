import { Post } from "../models/post.model.js";
import cloudinary from '../lib/cloudinaryConfig.js' ; 
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";

export const getFeedPosts = async (req,res) => {
    try {
        const posts = (await Post.find({author : { $in : req.user.connections}})
        .populate('author',"name username profilePicture headline"))
        .populate("comments.user","name profilePicture")
        .sort({createdAt : -1}) ;

        res.status(200).json(posts) ;  
    }catch(err) {
        console.error(err.message) ;
        res.status(500).json({message : "Server error"}) ; 
    }
}

export const createPost = async (req,res) => {
    try {
        const {content , image} = req.body ;

        let newPost ; 

        if(image) {
            const imageResult = await cloudinary.uploader.upload(image, { folder : 'linkedin'}) ;
            newPost = new Post({
                content,
                author : req.user._id,
                image : imageResult.secure_url 
            }) ;

        }else {
            newPost = new Post({
                content,
                author : req.user._id
            }) ;

        }
        await newPost.save() ;
        res.json(newPost) ; 
    }catch(err) {
        console.error(err.message) ;
        res.status(500).json({message : "Server error"}) ;
    }
}

export const deletePost = async (req,res) => {
    try {
        const postId = req.params.id ; 
        const userId = req.params.user._id ;
    
        if(!post) return res.status(404).json({message : "Post not found"}) ;

        if(postId.toString() !== userId) return res.status(403).json({message : "Unauthorized"}) ;

        
        const post = await Post.findByIdAndDelete(postId) ;
        if(post.image) {
            await cloudinary.uploader.destroy(post.image.split('/').pop().split('.')[0]) ;  
        }
        res.json({message : "Post deleted"}) ;
    
    } catch (error) {
        console.log('error in delete post method') ; 
        res.status(500).json({message : "Server error"}) ;
    }
}


export const getPostById = async (req,res) => {
    try {
        const postId = req.params.id ; 
        const post = await Post.findById(postId)
       .populate('author',"name username profilePicture headline").populate('comments.user','name profilePicture username headline') ;
        if(!post) {
            return res.status(404).json({message : "Post not found"}) ;
        }
        res.json(post) ;
    }catch(error) {
        console.error(err.message) ;
        res.status(500).json({message : "Server error"}) ;
    }
}


export const likePost = async (req,res) => {
    try {
        const postId = req.params.id ; 
        const userId = req.user._id ; 
        const post = await Post.findOne({
          _id : postId
        });
        if(!post) return res.status(404).json({message : "Post not found"}) ;
        //unlike post
        if(post.likes.includes(userId)) {
            post.likes.filter((id) => id.toString !== userId.toString()) ; 
            const notification = new Notification({
                recipient : post.author,
                type : "unlike",
                relatedUser : req.user._id,
                relatedPost : postId
            });
            await notification.save() ;  
        }else {
            post.likes.push(userId) ;    
            const notification = new Notification({
                recipient : post.author,
                type : "like",
                relatedUser : req.user._id,
                relatedPost : postId
            })        
        }

    }catch(err) {
        console.error(err.message+"like post") ;
        res.status(500).json({message : "Server error"}) ;
    }
}

export const createComment = async (req,res) => {
    try {
        const postId = req.params.id ; 
        const userId = req.user._id ; 
        const {content} = req.body ; 

        const post = Post.findByIdAndUpdate(postId,{
            $push : {
                comments : {
                    user : userId ,
                    content 
                }
            },
            

        },{new : true}).populate("author","name email username headline profilePicture") ; 

        if(post.author._id.toString() !== req.user._id.toString()) {
            var newNotification = new Notification({
                recipient : post.author._id,
                type : "comment",
                relatedUser : req.user._id,
                relatedPost : postId 
            });
            await newNotification.save() ; 
        
        }

        try {
            const postUrl = process.env.CLIENT_URL + "/post/" + postId ; 
            await sendCommentNotificationEmail(post.author.email,post.author.name,req.user.name,postUrl,content) ; 
        }catch(e) {
            console.error(e.message) ;
            res.status(500).json({message  : "Internal server error"}) ;
        }

        res.status(200).json({post}) ;

    } catch (error) {
        console.log("error in create post") ; 
        res.status(500).json({message  : "Internal server error"})
    }
}
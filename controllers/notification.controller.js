import { Notification } from "../models/notification.model.js";

export const getAllNotifications = async (req,res) => {
    try {
        const notifications = await Notification.find({
            recipient : req.user._id
        }).populate("relatedUser","username profilePicture ").populate("relatedPost","content image").sort({createdAt : -1 }) ;
        res.status(200).json(notifications) ; 
        }catch(err) {
        console.error(err.message + "getAllNotifications controller") ;
        res.status(500).json({message : "Error getting all notifications"}) ; 
    }
}


export const markNotificationAsRead = async (req,res) => {
    try {
        const notificationId = req.params.id  ; 
        const currentUserId  = req.user._id ; 
        const notification = await Notification.findByIdAndUpdate(
            notificationId,{
            read : true 
        },{ new : true}) ; 
        if(!notification) {
            return res.status(404).json({message : "Notification not found"}) ;  //if notification not found
        }

        res.status(200).json(notification) ; 

     }catch (error) {
      console.log(error.message + "error in markNotificationAsRead function")  ;
      res.status(500).json({message : "Error marking notification as read" }) ; 

    }
}

export const deleteNotification = async (req,res) => {
    try {
        const notificationId = req.params.id  ; 
        
        await Notification.findByIdAndDelete(notificationId) ; 
        
        res.status(200).json({message : "Notification deleted"}) ;
        
    } catch (error) {
        console.log(error.message + "error in deleteNotification function") ;
        return res.status(500).json({message : "Error deleting notification" }) ;

    }
}



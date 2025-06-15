import { sendConnectionAcceptedEmail } from "../emails/emailHandlers";
import { ConnectionRequest } from "../models/connectionRequest.model.js";
import { User } from "../models/user.model.js";

export const sendConnectionRequest = async (req,res) => {
    try {
        const { userId } = req.params ;
        const senderId = req.user._id ; 

        if(senderId.toString() === userId) {
            return res.status(400).json({message : "Cannot send connection request to yourself"}) ;
        }

        if(req.user.connections.includes(userId)) {
            return res.status(400).json({message : "You've already sent a connection request to this user"}) ;
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or : [
                { sender : senderId, receiver : userId },
                { sender : userId, receiver : senderId }
            ],
            status : "pending"
        });
        
        if(existingRequest) {
            return res.status(400).json({message : "You've already have a connection request to this user"}) ;
        }

        const newRequest = new ConnectionRequest({
            sender : senderId , 
            receiver : userId 
        });

        await newRequest.save() ;
        
        return res.status(201).json({message : "Connection request sent"}) ;

    } catch (error) {
        console.log(error.message + "send connection controller") ; 
        return res.status(500).json({message : "Internal Server Error"}) ;
    }
}


export const acceptConnectionRequest = async (req,res) => {
    try {
        const userId = req.user._id ; 
        const { id } = req.params ; 
        
        const request = await ConnectionRequest.findById(id).populate("sender","name email username").populate("recipient","name username") ;
        
        if(!request) return res.status(404).json({message : "Connection request not found"}) ;
        
        if(request.recipent.toString()!== userId) {
            return res.status(403).json({message : "Unauthorized"}) ;
        }

        request.status = "accepted" ;
        await request.save() ;
    
         Promise.all([
            await User.findByIdAndUpdate(userId, { $push : { connections : request.sender._id } }, { new : true }) ,
            await User.findByIdAndUpdate(request.sender._id,{
                $push : { connections : userId }
            })
            
        ]);

        const notification = new Notification({
            recipent : request.sender._id ,
            type : 'connectionAccepted',
            relatedUser : userId,

        });
        await notification.save() ;
        res.json({
            message : 'Connection accepted successfully'
        });

        const senderEmail = request.sender.email ; 
        const senderName = request.sender.name ;
        const recipientName = request.recipient.name ; 
        const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username ; 

        try {
            await sendConnectionAcceptedEmail(senderEmail,senderName,recipientName,profileUrl) ; 

        }catch(e) {
            console.error("Error in acceptedConnectionRequest Controller",e.message) ; 
            res.status(500).json({message : "Failed to send connection accepted email"}) ;
        }
        // todo : send email
    }catch(err) {
        console.log(error.message + "accept connection controller") ; 
        return res.status(500).json({message : "Internal Server Error"}) ;
    }
}

export const rejectConnectionRequest = async (req,res) => {
    try {
        const { requestId} = req.params  ; 
        const userId = req.user._id ; 

        const request = await ConnectionRequest.findById(requestId).populate('sender','name email username').populate('recipient','name username') ;
        
        if(!request) return res.status(404).json({message : "Connection request not found"}) ;

        if(request.recipient._id.toString() !== userId.toString()) {
            return res.status(403).json({message : "Unauthorized"}) ;
        }


        if(request.status !== 'pending') {
            return res.status(400).json({message : "This request has already been processed"}) ;
        }

        request.status = 'rejected' ; 
        await request.save() ; 

        const newNotification = new Notification({
            recipent : request.sender._id,
            type : "connectionRequestRejected",
            relatedUser : userId,
        });

      await newNotification.save() ; 
    }catch(err) {
        console.log(error.message + "reject connection request controller") ; 
        return res.status(500).json({message : "Internal Server Error"}) ;
    }
}


export const getConnectionsRequests = async (req, res) => {
    try {
        const userId = req.user._id ;
        const requests = await ConnectionRequest.find({
            recipient : userId , status : 'pending'
        }).populate("sender","name username profilePicture headline connections");

        res.json(requests) ; 


    }catch(err) {
        console.log(err.message+ "reject connection requests controller") ;
        res.status(500).json({message : "Server error"}) ;  
    }
}


export const getUserConnections = async (req,res) => {
    try {
        const userId = req.user._id ; 

        const user = await User.findById(userId).populate("connections","name username headline profilePicture connections") ;
        if(!user) {
            return res.status(404).json({message : "User not found"}) ;
        }

        res.json(user.connections) ;

    }catch(err) {
        console.log(err.message + "reject connection requests controller") ; 
        res.status(500).json({message : "Server error"})
    }
}

export const removeConnection = async (req,res) => {
    try {
        const myId = req.user._id ; 
        const {userId} = req.params ;


        Promise.all([
            await User.findByIdAndUpdate(myId, { $pull : { connections : userId } }, { new : true }),
            await User.findByIdAndUpdate(userId, { $pull : { connections : myId } }, { new : true })
        ]) ; 

        res.json({message : "Connection removed successfully"}) ;


    }catch(err) {
        console.log(err.message + "reject connection requests controller") ; 
        res.status(500).json({message : "Server error"})
    }
}


export const getConnectionStatus = async (req,res) => {
    try {
        const myId = req.user._id ; 
        const {userId} = req.params ;

        const currentUser  = req.user ; 
         const pendingRequest = await ConnectionRequest.findOne({
            $or : [
                { sender : myId, receiver : userId },
                { sender : userId, receiver : myId }
            ],
            status : "pending"
        });

        if(pendingRequest) {
            if(pendingRequest.sender.toString() === currentUser._id.toString()) {
                return res.json({status : "pending"}) ;
            } else {
                return res.json({status : 'received' , requestId : pendingRequest._id}) ; 
            }
        }

        res.json({status : 'not_connected'}) ; 

    }catch(err) {
        console.log(err.message + "error in getConnectionStatus") ;
        res.status(500).json({message : "internal server error"}) ; 
    }
}

import { mailtrapClient , sender } from "../lib/mailTrapConfig.js";
import { createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplate.js";
export const sendWelcomeEmail = async (email , name , profileUrl) => {
    const recipient = [{email}] ; 
    try {
        const aresponse = await mailtrapClient.send({
            from : sender ,
            to : recipient ,
            subject : "Welcome to UnLinkdin",
            html : createWelcomeEmailTemplate(name,profileUrl) ,
            category : "welcome"
        });

    }catch(error) {
        console.error(`Failed to send welcome email to ${email}: ${error.message}`) ;
    }
}


export const sendCommentNotificationEmail =  async (
    recipientEmail,
    recipientName,
    CommenterName,
    postUrl,
    commentContent
) => {
    const recipient = [{recipientEmail}] ;
     try {
        const response = await mailtrapClient.send({
            from : sender,
            to : recipient,
            subject : `${CommenterName} commented on your post`,
            html : createCommentNotificationEmailTemplate(
                recipientName,
                CommenterName,
                postUrl,
                commentContent
            ),
            category : "comment_notification"
        });
        console.log("comment notification email created") ; 
    }catch(e) {
        console.error(`Failed to send comment notification email to ${recipientEmail}: ${e.message}`) ;
    }
}


export const sendConnectionAcceptedEmail = async (senderEmail,senderName,recipientName,profileUrl) => {
    const recipient = [{email : recipientEmail}] ;
    try {
        const response = await mailtrapClient.send({
            from : senderEmail,
            to : recipient,
            subject : `${recipientName} has accepted your connection`,
            html : createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
            category : "connection_accepted"
        });
        console.log("connection accepted email created") ;
    }catch(e) {
        console.error(`Failed to send connection accepted email to ${recipientEmail}: ${e.message}`) ;
    }
}

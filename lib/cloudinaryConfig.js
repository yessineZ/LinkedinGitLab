import {v2 as cloudinary, v2} from 'cloudinary';
import env from 'dotenv' ; 
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_NAME
});

export default v2 ; 


 
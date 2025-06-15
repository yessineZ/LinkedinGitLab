import express from 'express' ; 
import env from 'dotenv' ; 
import authRoute from './routes/auth.routes.js' ;
import postRoutes from './routes/post.routes.js' ;  
import { connectToDb } from './lib/connectToDB.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.routes.js' ;
import { ConnectionRequest } from './models/connectionRequest.model.js';
import NotificationRoute from './routes/notification.routes.js' ; 
import  cors  from 'cors' ; 
const app = express() ; 


env.config({
    path: './.env'
});

const PORT = process.env.PORT || 3000 ;

app.use(express.json({limit : '10mb'})) ; 
app.use(cookieParser()) ; 

app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
    })) ;


app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`) ;
    connectToDb() ;
});


app.get('/',(req,res) => {
    res.send('3asba lik ya flamingo from second version') ;
})


app.use('/api/v1/auth',authRoute)  ; 
app.use('/api/v1/user',userRoute)  ;
app.use('/api/v1/post',postRoutes) ;
app.use('/api/v1/connections',ConnectionRequest) ;
app.use('/api/v1/notifications',NotificationRoute) ;

import bcrypt from "bcryptjs";  //used to hash password for security purpose
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import nodemailer from "../config/nodemailer.js";
import { validationResult } from "express-validator";

// async and is promise which is type of asyncronous function;
// asyncronous means task we will execute after complete of brfore task only
// syncronous means next task will executed even though before task is running

export const register= async(req, res)=>{ 
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    
    const {name,username,email,password}=req.body;

    try {
        // Check for existing email
        const existingEmail = await userModel.findOne({email: email.toLowerCase()});
        if(existingEmail){
            return res.json({success:false, message:'Email already registered'});
        }

        // Check for existing username
        const existingUsername = await userModel.findOne({username: username.toLowerCase()});
        if(existingUsername){
            return res.json({success:false, message:'Username already taken'});
        }
        
        const hashedPassword=await bcrypt.hash(password,10);

        const user=new userModel({
            name: name || username, 
            username: username.toLowerCase(), 
            email: email.toLowerCase(), 
            password:hashedPassword
        });

        await user.save();

        const token= jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: (process.env.NODE_ENV==='production')? 'none':'lax',
            maxAge: 7*24*60*60*1000,
        })

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome to Our Platform',
            text:`Hello ${name}\n${email},\n\nThank you for registering on our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`
        };
        try {
            if (process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SENDER_EMAIL) {
                await nodemailer.sendMail(mailOptions);
            }
        } catch (e) {
            console.error('Email send failed (register):', e.message);
            // do not block registration on email failure
        }

         return res.json({success:true,message:'user registered successfully'});
        
    } catch (error) {
       return res.json({success:false, message:error.message});
    }
}

export const login=async(req,res)=>{
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
      
    const{email,password}=req.body;

try {
    const user= await userModel.findOne({email});

    if(!user){
        return res.json({success:false,message:'email or password is wrong'});
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.json({success:false,message:'email or passowrd is wrong'});
    }

    // Update last login timestamp
    await userModel.updateOne({_id: user._id}, {lastLoginAt: new Date()});

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

     res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite: (process.env.NODE_ENV==='production')? 'none':'lax',  
        maxAge: 7*24*60*60*1000,
    })
    
    return res.json({success:true});
} catch (error) {
    return res.json({success:false, message:error.message});
    }
}

export const logout=async(req,res)=>{

    try {
        res.clearCookie('token',{
             httpOnly:true,
             secure:process.env.NODE_ENV==='production',
             sameSite: (process.env.NODE_ENV==='production')? 'none':'lax',
        })

        return res.json({success:true, message:'user logged Out'})
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
    
    
}

export const sendVerifyOtp=async(req,res)=>{
    try{
      // prefer authenticated user id from middleware, fallback to body
      const userId = req.userId || req.body.userId;

      const user=await userModel.findById(userId);

      if(user.isAccountVerified){
        return res.json({success:false,message:"account already exists"});
      }
        const otp=Math.floor(100000 + Math.random()*900000).toString();

        const otpExpireAt=Date.now()+10*60*1000;
        user.verifiyOtp=otp;
        user.verifiyOtpExpireAt=otpExpireAt;

        await user.save();

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Your Account Verification OTP',
            text:`Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe Team`
        };
        try {
            if (process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SENDER_EMAIL) {
                await nodemailer.sendMail(mailOptions);
            }
        } catch (e) {
            console.error('Email send failed (verify otp):', e.message);
            // do not block OTP generation on email failure
        }

        return res.json({success:true, message:'otp sent to your email'});
    

        }catch(error){
        return res.json({success:false, message:error.message});
    }
}

export const verifyAccount=async(req,res)=>{
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
       
    const{userId,otp}=req.body;

    try {
        const user=await userModel.findById(userId);
        
        if(user.isAccountVerified){
            return res.json({success:false,message:'account already verified'});
        }

        if(Date.now()>user.verifiyOtpExpireAt || user.verifiyOtp!==otp || user.verifiyOtp===''){
            return res.json({success:false,message:'invalid or expired otp'});
        }
         
        user.isAccountVerified=true;
        user.verifiyOtp='';
        user.verifiyOtpExpireAt=0;

        await user.save();
        return res.json({success:true,message:'account verified successfully'});

        

} catch (error) {
    return res.json({success:false,message:error.message});
}
}

export const me = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('name email isAccountVerified');
        if (!user) return res.json({ success: false, message: 'User not found' });
        return res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


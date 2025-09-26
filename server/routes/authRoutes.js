import express from 'express'
import { login, logout, register, sendVerifyOtp, verifyAccount, me } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
import { validateRegistration, validateLogin, validateOTP, validateInput } from '../middleware/validation.js';


const authRouter=express.Router(); // router contains group of routes where routes is used to connect fronted and backend

authRouter.post('/register', validateRegistration, validateInput, register);
authRouter.post('/login', validateLogin, validateInput, login);
authRouter.post('/logout', logout);
// optional: alias verify-otp to send a new OTP if needed
authRouter.post('/verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, validateOTP, validateInput, verifyAccount);
authRouter.get('/me', userAuth, me);
export default authRouter;
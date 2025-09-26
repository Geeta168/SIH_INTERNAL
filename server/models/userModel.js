import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{type:String, trim:true},
    username:{type:String, required:true, unique:true, index:true, lowercase:true, trim:true},
    email:{type:String,required:true,unique:true, lowercase:true, trim:true},
    password:{type:String,required:true},
    verifiyOtp:{type:String,default:''},
    verifiyOtpExpireAt:{type:Number, default:0, index:true}, // Index for cleanup queries
    isAccountVerified:{type:Boolean,default:false, index:true},
    resetOtpExpireAt:{type:Number,default:0, index:true},
    lastLoginAt:{type:Date},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now}
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.verifiyOtp;
            delete ret.resetOtpExpireAt;
            delete ret.verifiyOtpExpireAt;
            return ret;
        }
    }
})

const  userModel= mongoose.models.user || mongoose.model('users',userSchema);

export default userModel;
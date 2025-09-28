const {Schema,model} = require('mongoose');
const {createHmac, randomBytes} = require('node:crypto');
const {createToken} = require("../services/authentication")

const userSchema = new Schema({
    fullName : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true,
        unique : true
    },
    salt : {
        type : String,
    },
    password : {
        type: String,
        required : true
    },
    profileImageUrl : {
        type : String,
        default : '/images/default.jpg'
    },
    role : {
        type : String,
        enum : ['USER','ADMIN'],
        default : 'USER'
    }
},{ timestamps: true });

userSchema.pre("save",function(next) {
    const user = this
    if(!user.isModified('password')) return

    const salt = randomBytes(16).toString();

    const hash1 = createHmac('sha256',salt)
                    .update(user.password)
                    
    const hash = hash1.digest('hex');
    
    this.salt = salt;
    this.password = hash;

    next();

})

userSchema.static('matchPasswordAndGetToken',async function(email,_password) {
    const userGet = await this.findOne({email : email});
    if (!userGet) {throw new Error("user not found")}

    const hash = createHmac('sha256',userGet.salt)
                    .update(_password)
                    .digest('hex');

    if (hash === userGet.password) {
        console.log("userGet : ", userGet)
        const token = createToken(userGet);
        return token;
    } else {
        throw new Error('Incorrect password ')
    }
})

const User = model('user',userSchema);

module.exports = User;

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Expense = require('./Expense');
const Income = require('./Income');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age cannot be a negative number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password mustn\'t contain the word password');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'owner'
});


userSchema.virtual('income', {
    ref: 'Income',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'saltbae');
    user.tokens = user.tokens.concat({token: token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
}

userSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await User.findOne({email: email});
        //console.log(user);
        if(!user)
            throw new Error('Unable to login');
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
            throw new Error('Unable to login');
        
        return user;
    } catch (error) {
        res.status(400).send(error);
    }
    
}

userSchema.pre('save', async function(next){ 
    const user = this;
    //console.log('here');
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
    //console.log(user.password);
});

userSchema.pre('remove', async function (next){
    const user = this;
    await Expense.deleteMany({owner: user._id});
    await Income.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UsersSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        avatarURL:{
            type: String,
            required: false,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },
        //! Sytax to remove version key
        // {versionKey: false},
    }
);

UsersSchema.methods.comparePassword = async function (loginPW) {
    return bcrypt.compare(loginPW, this.password)
};

const User = model('user', UsersSchema);

module.exports = User;



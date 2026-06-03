import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

// Hash the password before saving to the database
userSchema.pre('save', async function () {
    // If the password hasn't been modified, just return and let Mongoose continue
    if (!this.isModified('password')) return;
    
    // Otherwise, hash the password
    this.password = await bcrypt.hash(this.password, 10);
});
// Compare entered password with hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate the JWT Token
userSchema.methods.generateToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.JWT_SECRET || 'datastraw_super_secret_key_2026', 
        { expiresIn: '7d' }
    );
};

export default mongoose.model('User', userSchema);
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    if (!this.password) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// NextJS edge case: Cannot redefine model if it already exists
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

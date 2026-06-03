import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import User from '../models/User.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request. Please log in.");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken._id).select("-password");

        if (!user) throw new ApiError(401, "Invalid Access Token");

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired Access Token");
    }
});

// Admin bouncer for tickets
export const verifyAdmin = asyncHandler(async (req, res, next) => {
    if (req.user?.role !== 'admin') {
        throw new ApiError(403, "Access Denied: Only Admins can perform this action.");
    }
    next();
});
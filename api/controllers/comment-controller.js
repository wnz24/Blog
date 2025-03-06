
import Comment from "../models/comment-model.js";
import {errorHandler} from "../utils/error.js"
import mongoose from "mongoose";


export const createComment = async (req,res,next)=>{

    try {
        const {content,postId,userId} = req.body;
    
        if(userId !== req.user.id){
            return next(errorHandler(403,"You are not allowed to creaate this comment"));
        }
    
        const newComment = new Comment({
            content,postId,userId
        })
        await newComment.save()
        res.status(200).json(newComment);
    } catch (error) {
     next(error)
    }

}
export const getPostComments = async (req,res,next)=>{
    try {
        const comments = await Comment.find({postId: req.params.postId}).sort({createdAt: -1})
        res.status(200).json(comments)

    } catch (error) {
        next(error)
    }
}
export const likeComment = async (req,res,next) =>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404, "comment not found"));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        }else{
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1)
        }
        await comment.save();
        res.status(200).json(comment)
    } catch (error) {
        
    }
}

export const editComment = async (req, res, next) => {
    try {
        const {commentId } = req.params; // Extract ID from URL
        console.log("CommentId:", commentId);

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return next(errorHandler(400, "Invalid comment ID"));
        }

        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(errorHandler(404, "Comment not found"));
        }

        // Check user permission
        if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, "You are not allowed to edit this comment"));
        }

        // Update only the content
        const editedComment = await Comment.findByIdAndUpdate(
            commentId, // Find by ID
            { content: req.body.content }, // Update only the content
            { new: true } // Return updated document
        );

        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req,res,next)=>{
try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
        return next(errorHandler(4040,"COmment not found"));
    }
    if(!comment.userId !== req.user.id && !req.user.isAdmin){

    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json("Comment has been deleted")
} catch (error) {
    next(error)
}
}
export const getComments = async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,"You are not allowed to get all comments"))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const comments = await Comment.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const OneMonthAgo = new Date(now.getFullYear(),now.getMonth() - 1,now.getDate());
        const lastMonthComments = await Comment.countDocuments({createdAt:{$gte: OneMonthAgo}})
        res.status(200).json({totalComments,lastMonthComments,comments})
    } catch (error) {
        next(error)
    }
}
import express from "express";
import { addCommentToLead, getCommentsForLead } from "../controllers/commentController.js";


const commentRouter = express.Router({mergeParams: true})

commentRouter.post('/:id/comments', addCommentToLead)
commentRouter.get('/:id/comments', getCommentsForLead)

export default commentRouter
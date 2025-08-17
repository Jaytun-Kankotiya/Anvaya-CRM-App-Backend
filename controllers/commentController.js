import commentModel from "../models/commentModel.js";
import leadModel from "../models/leadModel.js";
import mongoose, { mongo } from "mongoose";
import salesAgentModel from "../models/salesAgentModel.js";


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)


const addCommentToLead = async (req, res) => {
    try {
        const leadId = req.params.id
        const {commentText, authorId} = req.body


        if(!isValidObjectId(leadId)) {
            return res.status(400).json({error: "Invalid Lead ID format."})
        }
        if(!authorId || !isValidObjectId(authorId)) {
            return res.status(400).json({error: "Invalid Author ID"})
        }
        if(!commentText || typeof commentText !== "string") {
            return res.status(404).json({error: "Invalid input: comment text is required and must be a string."})
        }


        const leadExist = await leadModel.findById(leadId)
        if(!leadExist) {
            return res.status(400).json({error: `Lead with ID '${leadId}' not found.`})
        }

        const salesAgentExists = await salesAgentModel.findById(authorId)
        if(!salesAgentExists) {
            return res.status(404).json({error: `Sales agent with ID ${authorId} not found.`})
        }

        const newComment = new commentModel({
            lead: leadId,
            author: authorId,
            commentText,
        })
        const savedComment = await newComment.save()
        const populate = await savedComment.populate("author", "name")

        res.status(201).json({
            id: populate._id,
            commentText: populate.commentText,
            author: populate.author.name,
            createdAt: populate.createdAt
        })
    } catch (error) {
        res.status(500).json({error: "Internal Server Error", details: error.message})
    }
}

const getCommentsForLead = async (req, res) => {
    try {
        const leadId = req.params.id

        if(!isValidObjectId(leadId)) {
            return res.status(400).json({error: "Invalid Lead ID format."})
        }
        const allComments = await commentModel.find({lead: leadId}).populate("author", "name").sort({createdAt: -1})

        const formatedComents = allComments.map((comment) => ({
            id: comment._id,
            commentText: comment.commentText,
            author: comment.author.name,
            createdAt: comment.createdAt
        }))
        res.status(200).json(formatedComents)
    } catch (error) {
        res.status(500).json({error: "Comments List not found.", details: error.message})
    }
}


export {addCommentToLead, getCommentsForLead}
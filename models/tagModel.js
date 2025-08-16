import mongoose from "mongoose"

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tag name is required'],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const tagModel = mongoose.model("Tag", tagSchema)

export default tagModel
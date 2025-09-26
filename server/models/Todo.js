import mongoose from 'mongoose';


const TodoSchema = new mongoose.Schema(
{
title: { type: String, required: true, trim: true },
status: { type: Boolean, default: false },
dueAt: { type: Date },
},
{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);


export default mongoose.model('Todo', TodoSchema);
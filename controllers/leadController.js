import { error, time } from "console";
import leadModel from "../models/leadModel.js";
import fs from "fs";
import mongoose from "mongoose";
import salesAgentModel from "../models/salesAgentModel.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addLead = async (req, res) => {
  //   let image_filename = req.file ? req.file.filename : null

  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    if (!name)
      return res.status(400).json({
        error: "Invalid input: 'name' is required.",
      });

    if (!source)
      return res.status(400).json({
        error: "Invalid input: 'source' is required.",
      });

    if (!salesAgent || !isValidObjectId(salesAgent))
      return res.status(400).json({
        error: "Invalid input: 'salesAgent' ID is Invalid.",
      });

    if (!timeToClose)
      return res.status(400).json({
        error: "Invalid input: 'timeToClose' is required.",
      });

    const agentExist = await salesAgentModel.findById(salesAgent);
    if (!agentExist)
      return res
        .status(404)
        .json({ error: `Sales agent with ID ${salesAgent} not found.` });

    const newLead = new leadModel({
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
      //   image: image_filename
    });

    const saveLead = await newLead.save();
    await saveLead.populate("salesAgent", "name _id");

    res.status(201).json({
      id: salesAgent,
      name: saveLead.name,
      source: saveLead.source,
      salesAgent: {
        id: saveLead.salesAgent._id,
        name: saveLead.salesAgent.name
      },
      status: saveLead.status,
      tags: saveLead.tags,
      timeToClose: saveLead.timeToClose,
      priority: saveLead.priority,
      createdAt: saveLead.createdAt,
      updatedAt: saveLead.updatedAt
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { addLead };

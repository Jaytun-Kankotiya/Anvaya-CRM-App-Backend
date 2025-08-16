import { error, time } from "console";
import leadModel from "../models/leadModel.js";
import fs, { stat } from "fs";
import mongoose from "mongoose";
import salesAgentModel from "../models/salesAgentModel.js";
import { type } from "os";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const validSource = [
  "Website",
  "Referral",
  "Cold Call",
  "Advertisement",
  "Email",
  "Other",
];
const validPriorities = ["High", "Medium", "Low"];
const validStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"]

const addLead = async (req, res) => {
  //   let image_filename = req.file ? req.file.filename : null

  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    const leadExists = await leadModel.findOne({salesAgent})
    if(leadExists){
        return res.status(400).json({error: `Sales Agent with ID '${salesAgent}' is already assigned to another lead.`})
    }

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "Invalid input: 'name' is required and must be a string.",
      });
    }

    if (!source || !validSource.includes(source)) {
      return res.status(400).json({
        error: `Invalid input: 'source' is required and must be one of: ${validSource.join(
          ", "
        )}.`,
      });
    }

    if(!status || !validStatuses.includes(status)){
        return res.status(400).json({error: `Status must be one of: ${validStatuses.join(", ")}`})
    }

    if (!salesAgent || !isValidObjectId(salesAgent)) {
      return res.status(400).json({
        error: "Invalid input: 'salesAgent' ID is Invalid.",
      });
    }

    const parsedTime = Number(timeToClose);
    if (
      timeToClose === undefined ||
      isNaN(parsedTime) ||
      parsedTime <= 0
    ) {
      return res.status(400).json({
        error:
          "Invalid input: 'timeToClose' is required and must be a positive number.",
      });
    }

    if (!priority || !validPriorities.includes(priority)) {
      return res
        .status(400)
        .json({
          error: `'priority' must be one of: ${validPriorities.join(", ")}.`,
        });
    }

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

    res.status(201).json({message: "New Lead Data added Successfully",
      id: salesAgent,
      name: saveLead.name,
      source: saveLead.source,
      salesAgent: {
        id: saveLead.salesAgent._id,
        name: saveLead.salesAgent.name,
      },
      status: saveLead.status,
      tags: saveLead.tags,
      timeToClose: saveLead.timeToClose,
      priority: saveLead.priority,
      createdAt: saveLead.createdAt,
      updatedAt: saveLead.updatedAt,
    });
  } catch (error) {
    res.status(400).json({ error: error.message});
  }
};

const getAllLeads = async (req, res) => {
  try {
    const {salesAgent, status, tags, source} = req.query
    const filter = {}

    if(salesAgent) {
        if(!mongoose.Types.ObjectId.isValid(salesAgent)){
            return res.status(400).json({error: "Invalid input: 'salesAgent' must be a valid ObjectId."})
        }
        filter.salesAgent = salesAgent
    }

    if(status) {
        if(!validStatuses.includes(status)) {
            return res.status(400).json({error: `Invalid input: 'status' must be one of: ${validStatuses.join(", ")}.`})
        }
        filter.status = status
    }

    if(source) {
        if(!validSource.includes(source)){
            return res.status(400).json({error: `Invalid input: 'source' must be one of: ${validSource.join(", ")}.`})
        }
        filter.source = source
    }

    if(tags) {
        filter.tags = {$in: Array.isArray(tags) ? tags : [tags]}
    }

    const leads = await leadModel.find(filter).populate("salesAgent", "name _id").sort({createdAt: -1})

    const response = leads.map((lead) => ({
        id: lead._id,
        name: lead.name,
        source: lead.source,
        salesAgent: lead.salesAgent ? {id: lead.salesAgent._id, name: lead.salesAgent.name} : null,
        status: lead.status,
        tags: lead.tags,
        timeToClose: lead.timeToClose,
        priority: lead.priority,
        createdAt: lead.createdAt
    }))

    // const leadList = await leadModel.find().populate("salesAgent", "name _id");
    if(response.length === 0){
        return res.status(404).json({message: "No leads found matching the criteria."})
    }
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({error: error.message});
  }
};

const updateLead = async (req, res) => {
  try {
    // const findLead = await leadModel.findById(req.params.id)
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "Invalid input: 'name' is required and must be a string.",
      });
    }

    if (!source || !validSource.includes(source)) {
      return res.status(400).json({
        error: `Invalid input: 'source' is required and must be one of: ${validSource.join(
          ", "
        )}.`,
      });
    }

    if (!salesAgent || !isValidObjectId(salesAgent)) {
      return res.status(400).json({
        error: "Invalid input: 'salesAgent' ID is Invalid.",
      });
    }

    if(!status || !validStatuses.includes(status)){
      return res.status(400).json({error: `Status must be one of: ${validStatuses.join(", ")}`})
    }

    if (
      timeToClose === undefined ||
      typeof timeToClose !== "number" ||
      timeToClose <= 0
    ) {
      return res.status(400).json({
        error:
          "Invalid input: 'timeToClose' is required and must be a positive number.",
      });
    }

    if (!priority || !validPriorities.includes(priority)) {
      return res
        .status(400)
        .json({
          error: `'priority' must be one of: ${validPriorities.join(", ")}.`,
        });
    }

    const updateLeadData = await leadModel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).populate("salesAgent", "name _id")
    if(!updateLeadData) {
        return res.status(404).json({error: `Lead with ID '${req.params.id}' not found.`})
    }
    // updateLead.populate("salesAgent", "name _id")
    res.status(200).json({message: "Lead Data Updated Successfully:", 
      id: salesAgent,
      name: updateLeadData.name,
      source: updateLeadData.source,
      salesAgent: {
        id: updateLeadData.salesAgent._id,
        name: updateLeadData.salesAgent.name,
      },
      status: updateLeadData.status,
      tags: updateLeadData.tags,
      timeToClose: updateLeadData.timeToClose,
      priority: updateLeadData.priority,
      updatedAt: updateLeadData.updatedAt,
    })
  } catch (error) {
    res.status(500).json({error: "Failed to update lead data."})
  }
};

const deleteLead = async (req, res) => {
    try {
        const findLead = await leadModel.findByIdAndDelete(req.params.id)
        if(!findLead){
            return res.status(404).json({error: "Error deleting lead data."})
        }
        res.status(200).json({message: "Lead data deleted successfully.", findLead})
    } catch (error) {
        res.status(500).json({error: "Lead data not found."})
    }
}

export { addLead, getAllLeads, updateLead, deleteLead };

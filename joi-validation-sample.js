const Joi = require('joi')
Joi.ObjectId = require('joi-objectid')(Joi)

const schema = {
    projectRequestId: Joi.ObjectId().required(),
    projectName: Joi.string().min(3).max(30).required(),
    problemStatement: Joi.string().required(),
    serviceRequested: Joi.string().required(),
    projectSponsorId: Joi.string().required(),
    projectSponsorName: Joi.string().required(),
    projectSponsorEmail: Joi.string().required(),
    requestorId: Joi.objectId().required(),
    departmentId: Joi.string().min(3).max(30).required(),
    projectManagerName: Joi.string().required(),
    projectStartDate: Joi.string(),
    projectEndDate: Joi.string(),
    projectManagerId: Joi.ObjectId().required(),
    estBudget: Joi.string(),
    projectStatus: Joi.string().required(),
    assignedTeam: Joi.object().required(),
}

module.exports = Joi.object().keys(schema)

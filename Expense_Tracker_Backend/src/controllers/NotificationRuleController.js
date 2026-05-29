const notificationRuleModel = require("../models/NotificaionRulesModel")

const createNotificationRule = async(req,res)=>{

    try{
        const savedRule = await notificationRuleModel.create(req.body)
        const populatedRule = await notificationRuleModel.findById(savedRule._id).populate("notification")
        res.status(201).json({
            message:"notification rule created..",
            data:populatedRule
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating notification rule..",
            err:err.message
        })
    }

}

const getAllNotificationRules = async(req,res)=>{

    try{
        const rules = await notificationRuleModel.find().populate("notification")
        res.status(200).json({
            message:"notification rules fetched..",
            data:rules
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching notification rules..",
            err:err.message
        })
    }

}

const getNotificationRuleById = async(req,res)=>{

    try{
        const rule = await notificationRuleModel.findById(req.params.id).populate("notification")
        if(!rule){
            return res.status(404).json({
                message:"notification rule not found"
            })
        }
        res.status(200).json({
            message:"notification rule fetched..",
            data:rule
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching notification rule..",
            err:err.message
        })
    }

}

const updateNotificationRule = async(req,res)=>{

    try{
        const updatedRule = await notificationRuleModel.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate("notification")
        if(!updatedRule){
            return res.status(404).json({
                message:"notification rule not found"
            })
        }
        res.status(200).json({
            message:"notification rule updated..",
            data:updatedRule
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating notification rule..",
            err:err.message
        })
    }

}

const deleteNotificationRule = async(req,res)=>{

    try{
        const deletedRule = await notificationRuleModel.findByIdAndDelete(req.params.id)
        if(!deletedRule){
            return res.status(404).json({
                message:"notification rule not found"
            })
        }
        res.status(200).json({
            message:"notification rule deleted..",
            data:deletedRule
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting notification rule..",
            err:err.message
        })
    }

}

module.exports = {
    createNotificationRule,
    getAllNotificationRules,
    getNotificationRuleById,
    updateNotificationRule,
    deleteNotificationRule
}

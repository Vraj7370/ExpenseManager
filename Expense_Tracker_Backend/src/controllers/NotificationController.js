const notificationModel = require("../models/NotificationModel")

const createNotification = async(req,res)=>{

    try{
        const savedNotification = await notificationModel.create(req.body)
        res.status(201).json({
            message:"notification created..",
            data:savedNotification
        })
    }catch(err){
        res.status(500).json({
            message:"error while creating notification..",
            err:err.message
        })
    }

}

const getAllNotifications = async(req,res)=>{

    try{
        const notifications = await notificationModel.find()
        res.status(200).json({
            message:"notifications fetched..",
            data:notifications
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching notifications..",
            err:err.message
        })
    }

}

const getNotificationById = async(req,res)=>{

    try{
        const notification = await notificationModel.findById(req.params.id)
        if(!notification){
            return res.status(404).json({
                message:"notification not found"
            })
        }
        res.status(200).json({
            message:"notification fetched..",
            data:notification
        })
    }catch(err){
        res.status(500).json({
            message:"error while fetching notification..",
            err:err.message
        })
    }

}

const updateNotification = async(req,res)=>{

    try{
        const updatedNotification = await notificationModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!updatedNotification){
            return res.status(404).json({
                message:"notification not found"
            })
        }
        res.status(200).json({
            message:"notification updated..",
            data:updatedNotification
        })
    }catch(err){
        res.status(500).json({
            message:"error while updating notification..",
            err:err.message
        })
    }

}

const deleteNotification = async(req,res)=>{

    try{
        const deletedNotification = await notificationModel.findByIdAndDelete(req.params.id)
        if(!deletedNotification){
            return res.status(404).json({
                message:"notification not found"
            })
        }
        res.status(200).json({
            message:"notification deleted..",
            data:deletedNotification
        })
    }catch(err){
        res.status(500).json({
            message:"error while deleting notification..",
            err:err.message
        })
    }

}

module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification
}

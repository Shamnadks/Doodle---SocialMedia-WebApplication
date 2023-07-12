import NotificationModel from "../models/notificationModel.js";


export const getNotification = async (req, res) => {
    try {
        NotificationModel.find({ userId: req.params.id })
            .then((response) => {
                res.status(200).json(response)
            })
    } catch (error) {
        res.status(500).json(error)
    }
}


export const setNotification = async(req,res)=>{
    try{
        NotificationModel.updateMany({userId:req.params.id, isVisited:false},
            {
                $set:{
                    isVisited:true
                }
            })
            .then((response)=>{
                res.status(200).json(response)
            })
    }catch(error){
        res.status(500).json(error)
    }
}
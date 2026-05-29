const sendNotification =(audiance,message,time,type,channel)=>{

    switch(type){
        case "new_admission":
            console.log("new admision don notification sent..")
            console.log("audiance : ",audiance)
            console.log("message : ",message)
            console.log("time : ",time)
            console.log("type : ",type)
            console.log("channel : ",channel)
            break;
    }
}

module.exports = {sendNotification}
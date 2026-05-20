const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const incomeCategorySchema = new Schema({

    catName:{
        type:String
    },
    description:{
        type:String
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"
    }

})

incomeCategorySchema.pre("findOneAndDelete", async function() {
    const category = await this.model.findOne(this.getFilter());

    if (category) {
        await mongoose.model("expense").deleteMany({
            incomeCategory: category._id
        });
    }
});
module.exports = mongoose.model("incomeCategory",incomeCategorySchema)

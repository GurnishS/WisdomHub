import mongoose,{Schema} from mongoose;

const likeSchema = new Schema({
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    likedTo:{
        type:Schema.Types.ObjectId,
        ref:"StudyMaterial",
        required:true
    },
},{
    timestamps:true
});

export const StudyMaterialLike = mongoose.model("StudyMaterialLike",likeSchema);
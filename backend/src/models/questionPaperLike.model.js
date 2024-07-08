import mongoose,{Schema} from mongoose;

const likeSchema = new Schema({
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    likedTo:{
        type:Schema.Types.ObjectId,
        ref:"QuestionPaper",
        required:true
    },
},{
    timestamps:true
});

export const QuestionPaperLike = mongoose.model("QuestionPaperLike",likeSchema);
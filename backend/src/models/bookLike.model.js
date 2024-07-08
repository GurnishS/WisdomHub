import mongoose,{Schema} from mongoose;

const likeSchema = new Schema({
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    likedTo:{
        type:Schema.Types.ObjectId,
        ref:"Book",
        required:true
    },
},{
    timestamps:true
});

export const BookLike = mongoose.model("BookLike",likeSchema);
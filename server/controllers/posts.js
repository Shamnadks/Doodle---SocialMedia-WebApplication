import Post from "../models/Post.js";
import User from "../models/User.js";
import ReportModel from "../models/reportPost.js";

 
export const createPost = async(req,res)=>{
    try{
        const { userId , description } = req.body;
        if(req.file){ 
            var picturePath = req.file.path;
        }
       
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{},
            comments:[]
        })
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    }catch(err){
        res.status(409).json({message: err.message})
    }
}



export const getFeedPosts = async (req, res) => {
    try {
      const page = req.query.page || 1; 
      const limit = 5;
      const skip = (page - 1) * limit; 
      const posts = await Post.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  export const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const page = req.query.page || 1; 
      const limit = 5; 
  
      const skip = (page - 1) * limit; 
  
      const posts = await Post.find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

export const createComment = async (req, res) => {
  try {
    const { postId, _Id } = req.params;
    console.log(postId,_Id);
    const { comment } = req.body;

    const user = await User.findById(_Id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newComment = {
      userId: _Id,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      text: comment,
    };
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}



export const reportPost = async (req, res) => {
  try {
    const { postId, _Id } = req.params;
    const post = await Post.findById(postId);
    const user = await User.findById(_Id);
 
    req.body.userId = _Id;
    req.body.name = user.email;
    req.body.postId = post._id;

    req.body.post = post?.picturePath;
    req.body.desc = post.description;
    req.body.type = "post";

    if (post?.reports.filter((e) => e === _Id).length <= 0) {
      await User.updateOne({ $push: { reportedPost: req.body.postId.toString() } });
      await Post.updateOne({ $push: { reports: _Id } });
      const newReport = new ReportModel(req.body);
      const savedReport = await newReport.save();
      res.status(200).json(savedReport);
  } else {
      res.status(403).json("You already reported this post");
  }
} catch (err) {
  res.status(500).json(err);
  console.log(err);
}
}




export const likePost = async(req,res)=>{
    try{
        const { id }= req.params;
        const { userId } = req.body;
        const user = await User.findById(userId);
        const post = await Post.findById(id);
        if(!post.likes.find((like)=>like.userId==userId)){
            await post.updateOne({$push:{likes:{userId:userId,firstName:user.firstName,lastName:user.lastName,userPicturePath:user.picturePath}}});
        }else{
            await post.updateOne({$pull:{likes:{userId:userId}}});
        }
        const updatedPost = await Post.findById(id);
        res.status(200).json(updatedPost);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}


    

const deletePost=async(req,res)=>{
    try{
        const { id }= req.params;
        const post = await Post.findByIdAndDelete(id);
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

const deleteComment=async(req,res)=>{
    try{
        const { postId, _Id } = req.params;
        const post = await Post.findById(postId);
        const comment = post.comments.find((comment) => comment._id == _Id);
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
        post.comments = post.comments.filter((comment) => comment._id != _Id);
        await post.save();
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const allReports = async (req, res) => {
  try {
      const reports = await ReportModel.find();
      res.status(200).json(reports);
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
}



export const rejectReport = async (req, res) => {
  try {
      console.log(req.query.name, "userid")
      console.log(req.params.id, "postid")
      var isPostFound = true;
      const post = await Post.findById(req.params.id)
      if (!post) {
          res.status(403).json("Post not found");
          isPostFound = false;
      }
      await post.updateOne({ $pull: { reports: req.query.name } }).then((res) => {
      })
      await ReportModel.deleteMany({ _id: req.query.id })
      res.status(200).json("Report Removed")
  } catch (error) {
      if (isPostFound) {
          res.status(500).json(error)
      }
      console.log(error)
  }
}


export const resolveReport = async (req, res) => {
  try {
      var isPostFound = true
      const post = await Post.findById(req.params.id)
      if (!post) {
          res.status(403).json("Post not found !")
          isPostFound = false;
      }
      await post.deleteOne()
      await ReportModel.deleteMany({ _id: req.query.id })
      res.status(200).json('Post deleted!')

  } catch (error) {
      if (isPostFound) {
          res.status(500).json(error)
      }
      console.log(error);
  }
}


export default { createPost,getFeedPosts,getUserPosts,likePost,deletePost ,createComment,deleteComment,reportPost,allReports,rejectReport,resolveReport};
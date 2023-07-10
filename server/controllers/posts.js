import Post from "../models/Post.js";
import User from "../models/User.js";

 
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




export const likePost = async(req,res)=>{
    try{
        const { id }= req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId,true);
        }
        const updatedPost = await Post.findByIdAndUpdate(id,{likes:post.likes},{new:true});
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





export default { createPost,getFeedPosts,getUserPosts,likePost,deletePost ,createComment,deleteComment};
import User from "../models/User.js"

// read
export const getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };



  export const getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
     
      const friends = await Promise.all(
        user.following.map((friendId)=> User.findById(friendId))
    );

    const formattedFriends = friends.map(({ _id,firstName,lastName,occupation,location,picturePath })=> {
        return { _id,firstName,lastName,occupation,location,picturePath }
    });


      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };


    export const getUserFollowers = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            const followers = await Promise.all(
                user.followers.map((followerId)=> User.findById(followerId))
            );

            const formattedFollowers = followers.map(({ _id,firstName,lastName,occupation,location,picturePath })=> {
                return { _id,firstName,lastName,occupation,location,picturePath }
            });

            res.status(200).json(formattedFollowers);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    };



// update

export const addRemoveFriend = async(req,res)=>{
    try{
        const {id,friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.following.includes(friendId)){
            user.following = user.following.filter((id)=> id !== friendId);
            friend.followers = friend.followers.filter((id)=> id !== id);
        }else{
            user.following.push(friendId);
            friend.followers.push(id);
        }
        await user.save();
        await friend.save();
        const friends = await Promise.all(
            user.following.map((friendId)=> User.findById(friendId))
        );

        const formattedFriends = friends.map(({ _id,firstName,lastName,occupation,location,picturePath })=> {
            return { _id,firstName,lastName,occupation,location,picturePath }
        });

        res.status(200).json(formattedFriends);

    }catch(err){
        res.status(404).json({message:err.message});
    }
}








export const getSearchUsers = async(req,res)=>{
    try{
        const {search}= req.params;
        const users = await User.find({
            $or:[
                {firstName:{$regex:search,$options:"i"}},
                {lastName:{$regex:search,$options:"i"}},
            ],
        });
        const formattedUsers = users.map(({ _id,firstName,lastName,occupation,location,picturePath })=> {
            return { _id,firstName,lastName,occupation,location,picturePath }
        });
        console.log(formattedUsers);
        res.status(200).json(formattedUsers);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const editUser = async(req,res)=>{
    try{
        const {userId,firstName,lastName,occupation} = req.body;
        const user = await User.findById(userId);
        user.firstName = firstName;
        user.lastName = lastName;
        user.occupation = occupation;
        await user.save();
        res.status(200).json(user);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}


export const editUserWithImage = async(req,res)=>{
    try{
        const {userId,firstName,lastName,occupation} = req.body;
        const picturePath = req.file.path;

        const user = await User.findById(userId);
        user.firstName = firstName;
        user.lastName = lastName;
        user.occupation = occupation;
        user.picturePath = picturePath;
        await user.save();
        res.status(200).json(picturePath);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}




export default { getUser,getUserFriends,addRemoveFriend,getSearchUsers,getUserFollowers,editUser,editUserWithImage};
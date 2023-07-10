import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    mode:"light",
    user:null,
    token:null,
    admin:null,
    adminToken:null,
    posts:[],
};


export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers :{
        setMode:(state)=>{
            state.mode = state.mode ==="light"? "dark" : "light";
        },
        setLogin:(state,action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout:(state)=>{
            localStorage.removeItem("token");
            state.user = null;
            state.token = null;
        },
        setAdminLogin:(state,action)=>{
            state.admin = action.payload.admin;
            state.adminToken = action.payload.adminToken;
        },
        setAdminLogout:(state)=>{
            state.admin = null;
            state.adminToken = null;
        },
        setFriends:(state,action)=>{
            if(state.user){
                state.user.friends = action.payload.friends;
            }else{
                console.error("user friends non-existent :( ");
            }
        },
        setPosts:(state,action)=>{
            state.posts = action.payload.posts;
        },
        setPost:(state,action)=>{
            const updatedPosts = state.posts.map((post)=>{
                if(post._id === action.payload.post._id){
                    return action.payload.post;
                }
                return post;
            });
            state.posts = updatedPosts;
        }
    }
})

export const {setMode,setLogin,setLogout,setFriends,setPosts,setPost,setAdminLogin,setAdminLogout} = authSlice.actions;
export default authSlice.reducer;
import axios from "../utils/axios";


export const addComment = async (postId, userId, comment) => {
    try {
        const response = await axios.post(`/posts/${postId}/comments/${userId}`, { comment });
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }

export const patchFriends = async (userId, friendId) => {
    try {
        const response = await axios.patch(`users/${userId}/${friendId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }

export const getFriendsList = async (userId) => {
    try {
        const response = await axios.get(`/users/${userId}/friends`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }




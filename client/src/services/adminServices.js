import axios from "../utils/axios";

export const blockUnblockUser = async (id) => {
    try {
        const response = await axios.patch(`/admin/users/blockUnblock/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
    }


export const getUsersLists = async () => {
    try {
        const response = await axios.get('/admin/users');
        return response;
    } catch (error) {
        console.error(error);
    }
    }


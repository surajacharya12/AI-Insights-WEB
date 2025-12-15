import axios from "axios";
import API_URL from "./api_url";

const URL = `${API_URL}/bot/chat`;

export const getThinkBotResponse = async (message: string) => {
    try {
        const response = await axios.post(URL, { message });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching ThinkBot response:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw error;
    }
};

import axios from "axios";
import API_URL from "./api_url";

const BASE_URL = `${API_URL}/api/ai-tools`;

export const generateImage = async (prompt: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/generate-image`, { prompt });
        return response.data;
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

export const checkGrammar = async (text: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/grammar-check`, { text });
        return response.data;
    } catch (error) {
        console.error("Error checking grammar:", error);
        throw error;
    }
};

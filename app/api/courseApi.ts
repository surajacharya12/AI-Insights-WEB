import axios from "axios";
import API_URL from "./api_url";

const BASE_URL = `${API_URL}/api/courses`;

export interface GenerateCourseParams {
    email: string;
    courseId: string;
    name: string;
    description: string;
    category: string;
    level: string;
    includeVideo: boolean;
    noOfChapters: number;
}

export const generateCourseLayout = async (data: { email: string; courseId: string; name: string; description: string; category: string; level: string; includeVideo: boolean; noOfChapters: number; }) => {
    try {
        const response = await axios.post(`${BASE_URL}/generate`, data);
        return response.data;
    } catch (err: any) {
        if (err.response?.status === 429) {
            throw new Error("AI quota exceeded. Try again later.");
        }
        throw err;
    }
};

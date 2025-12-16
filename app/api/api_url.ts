const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ai-insights-backend.vercel.app"
        : "http://localhost:3001";

export default API_URL;

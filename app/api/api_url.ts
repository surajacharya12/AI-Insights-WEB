const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ai-insights-backend-k84d.vercel.app"
        : "http://localhost:3001";

export default API_URL;

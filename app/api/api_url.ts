// Use localhost for development, production URL for production
const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_URL = isLocalhost
    ? "http://localhost:3001"
    : process.env.NEXT_PUBLIC_API_URL || "https://ai-insights-backend.vercel.app";

// Log the API URL for debugging
if (typeof window !== 'undefined') {
    console.log('Environment Debug:', {
        hostname: window.location.hostname,
        isLocalhost,
        API_URL
    });
}

export default API_URL;

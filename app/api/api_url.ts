const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '0.0.0.0' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('10.') ||
        window.location.hostname.endsWith('.local'));

// Dynamically determine the API URL 
// If local, we use the current hostname to avoid 127.0.0.1 vs localhost mismatches
const API_URL = isLocalhost
    ? `http://${window.location.hostname}:3001`
    : process.env.NEXT_PUBLIC_API_URL || "https://ai-insights-backend.vercel.app";

// Log the API URL for debugging
if (typeof window !== 'undefined') {
    const isMixedContent = window.location.protocol === 'https:' && API_URL.startsWith('http:');

    console.log('📡 API Connectivity Debug:', {
        origin: window.location.origin,
        target: API_URL,
        isLocalhost,
        isMixedContent,
        envSet: !!process.env.NEXT_PUBLIC_API_URL
    });

    if (isMixedContent) {
        console.warn('⚠️ MIXED CONTENT DETECTED: Your browser will likely block requests from an HTTPS site to an HTTP backend. Please update NEXT_PUBLIC_API_URL to an HTTPS URL.');
    }
}

export default API_URL;

import axios from "axios";
import axiosRetry from "axios-retry";

// Create axios instance
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    timeout: 10000,
});

// Setup axios retry
axiosRetry(apiClient, {
    retries: 5,
    retryDelay: axiosRetry.linearDelay(),
});

// Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Make it available globally for legacy code if needed
if (typeof window !== "undefined") {
    (window as any).axios = apiClient;
}

export default apiClient;

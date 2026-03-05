import axios, { AxiosInstance } from "axios";

// Konfigurasi
const CLAUDE_CONFIG = {
  baseURL: process.env.AI_API_BASE_URL || "",
  apiKey: process.env.AI_API_KEY || "",
  defaultModel: process.env.AI_DEFAULT_MODEL || "claude-sonnet-4-5-20250929",
  maxTokens: parseInt(process.env.AI_API_MAX_TOKEN || "8192", 10),
};

console.log(CLAUDE_CONFIG);

// Create Axios instance
const claudeApi: AxiosInstance = axios.create({
  baseURL: CLAUDE_CONFIG.baseURL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": CLAUDE_CONFIG.apiKey,
    "anthropic-version": "2023-06-01",
    "anthropic-beta": "prompt-caching-2024-07-31", // ✅ Enable caching
  },
  timeout: 120000, // 2 minutes
});

// Response interceptor untuk logging
claudeApi.interceptors.response.use(
  (response) => {
    // Log cache stats
    const usage = response.data?.usage;
    if (usage) {
      console.log("📊 Token Usage:", {
        input: usage.input_tokens || 0,
        cacheCreated: usage.cache_creation_input_tokens || 0,
        cacheRead: usage.cache_read_input_tokens || 0,
        output: usage.output_tokens || 0,
      });

      if (usage.cache_read_input_tokens > 0) {
        console.log("🎯 Cache HIT! Saved tokens:", usage.cache_read_input_tokens);
      }
    }
    return response;
  },
  (error) => {
    console.error("❌ Axios Error:", {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
    });
    return Promise.reject(error);
  }
);

export { claudeApi, CLAUDE_CONFIG };

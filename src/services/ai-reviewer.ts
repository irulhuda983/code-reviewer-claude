import { claudeApi, CLAUDE_CONFIG } from "../client/claude-api";
import axios from "axios";
import { buildReviewPrompt, buildCommitPrompt } from "../utils/prompt-builder";

// interface AiApiParams {
//   model: string | null | undefined;
//   message: Array<{
//     role: "system" | "user" | "assistant";
//     content: string;
//     cache?: boolean;
//   }>;
// }

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
  usage: {
    input_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
    output_tokens: number;
  };
}

const aiApiClient = async ({ model, message }: any): Promise<string> => {
  try {
    const aiModel = model || CLAUDE_CONFIG.defaultModel;
    // Pisahkan system dan user messages
    const systemMessages = message.filter((msg: any) => msg.role === "system");
    const userMessages = message.filter((msg: any) => msg.role !== "system");

    // Build system content dengan cache control
    const systemContent = systemMessages.map((msg: any) => {
      const block: any = {
        type: "text",
        text: msg.content,
      };

      // ✅ Tambahkan cache_control untuk messages yang di-flag
      if (msg.cache) {
        block.cache_control = { type: "ephemeral" };
      }

      return block;
    });

    // Build payload
    const payload = {
      model: aiModel,
      max_tokens: CLAUDE_CONFIG.maxTokens,
      system: systemContent,
      messages: userMessages.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    };

    console.log("📤 Sending request:", {
      model: payload.model,
      systemBlocks: systemContent.length,
      cachedBlocks: systemContent.filter((s: any) => s.cache_control).length,
      messagesCount: payload.messages.length,
    });

    // ✅ Call API dengan Axios
    const response = await claudeApi.post<ClaudeResponse>("/v1/messages", payload);

    // Extract text dari response
    const text = response.data.content[0]?.text || "No review generated.";

    return text;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      console.error("❌ Claude API Error:", errorMessage);
      throw new Error(`Claude API Error: ${errorMessage}`);
    }
    throw error;
  }
};

const getDiffReviewClaude = async ({
  model = CLAUDE_CONFIG.defaultModel,
  diff,
}: any): Promise<any> => {
  // const message = buildCommitPrompt({ diff, tag, context });
  const message = buildReviewPrompt({ diff });

  const res = await aiApiClient({
    model,
    message,
  });

  return res;
};

const getCommitReviewClaude = async ({
  model = CLAUDE_CONFIG.defaultModel,
  diff,
}: any): Promise<any> => {
  const message = buildCommitPrompt({ diff });

  const res = await aiApiClient({
    model,
    message,
  });

  return res;
};

export { aiApiClient, getDiffReviewClaude, getCommitReviewClaude };

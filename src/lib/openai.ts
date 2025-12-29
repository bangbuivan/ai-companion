import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("[GEMINI] Warning: GEMINI_API_KEY is not set!");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function generateChatResponse(
    companionName: string,
    companionDescription: string,
    companionInstructions: string,
    conversationHistory: { role: string; content: string }[],
    userMessage: string
): Promise<string> {
    // Check if API key is available
    if (!apiKey) {
        console.error("[GEMINI] No API key configured!");
        return `Xin lỗi, tôi chưa được cấu hình đúng. Vui lòng kiểm tra GEMINI_API_KEY.`;
    }

    try {
        console.log("[GEMINI] Generating response for:", userMessage);

        const systemPrompt = `Bạn là ${companionName}. ${companionDescription}

Hướng dẫn: ${companionInstructions}

Quy tắc quan trọng:
- Luôn giữ vai trò của nhân vật này
- Trả lời bằng tiếng Việt nếu người dùng hỏi bằng tiếng Việt
- Trả lời tự nhiên và hữu ích
- KHÔNG BAO GIỜ chỉ nói "xin chào" - hãy trả lời câu hỏi thực sự
- Nếu không biết thông tin thời gian thực (như giá vàng), hãy nói rõ là bạn không có thông tin thời gian thực nhưng có thể giải thích chung về chủ đề đó`;

        // Build conversation history string
        let historyText = "";
        for (const msg of conversationHistory.slice(-5)) { // Last 5 messages only
            const role = msg.role === "user" ? "Người dùng" : companionName;
            historyText += `${role}: ${msg.content}\n`;
        }

        const fullPrompt = `${systemPrompt}

Lịch sử hội thoại gần đây:
${historyText}

Người dùng: ${userMessage}

Hãy trả lời câu hỏi trên một cách chi tiết và hữu ích. ${companionName}:`;

        console.log("[GEMINI] Sending request to API with new SDK...");

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: fullPrompt,
        });

        const text = response.text;

        console.log("[GEMINI] Response received:", text?.substring(0, 100) + "...");

        if (!text || text.trim().length === 0) {
            console.error("[GEMINI] Empty response received");
            return `Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Hãy thử lại nhé!`;
        }

        return text;
    } catch (error: unknown) {
        console.error("[GEMINI_ERROR] Full error:", error);

        // More helpful error messages
        if (error instanceof Error) {
            if (error.message.includes("API_KEY") || error.message.includes("API key")) {
                return `Lỗi: API key không hợp lệ. Vui lòng kiểm tra GEMINI_API_KEY.`;
            }
            if (error.message.includes("quota") || error.message.includes("429") || error.message.includes("Too Many")) {
                return `Xin lỗi, đã hết quota API. Vui lòng thử lại sau 1-2 phút.`;
            }
            if (error.message.includes("safety")) {
                return `Xin lỗi, câu hỏi không được xử lý do bộ lọc an toàn.`;
            }
            if (error.message.includes("404") || error.message.includes("not found")) {
                return `Lỗi: Model không tồn tại. Đang thử model khác...`;
            }
        }

        return `Xin lỗi, đã có lỗi xảy ra: ${error instanceof Error ? error.message : 'Unknown error'}. Vui lòng thử lại!`;
    }
}

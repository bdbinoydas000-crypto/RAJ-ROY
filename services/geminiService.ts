
import { GoogleGenAI, Modality } from "@google/genai";

// Ensure API key is available from environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const restorePhotoWithAI = async (base64ImageData: string, mimeType: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: 'Restore this old photograph. Improve clarity, fix scratches, correct colors, and enhance overall quality without adding or removing elements from the original image.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data; // Return the base64 string of the restored image
            }
        }
        throw new Error("AI did not return an image. It might have returned text: " + response.text);

    } catch (error) {
        console.error("Error calling Gemini API for photo restoration:", error);
        throw new Error("Failed to restore photo with AI. " + (error instanceof Error ? error.message : String(error)));
    }
};

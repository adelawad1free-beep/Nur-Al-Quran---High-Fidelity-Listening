
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyReflection = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "أعطني آية قصيرة ملهمة من القرآن الكريم مع ترجمتها بالإنجليزية وتفسير بسيط باللغة العربية بأسلوب راقي جداً.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verse: { type: Type.STRING },
            translation: { type: Type.STRING },
            reflection: { type: Type.STRING },
            surahName: { type: Type.STRING }
          },
          required: ["verse", "translation", "reflection", "surahName"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};

export const fetchReciterMushaf = async (reciterName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ابحث عن المصحف الكامل المرتل للقارئ "${reciterName}". 
      هام جداً وحرج: يجب أن تكون الروابط روابط مباشرة وحصرية لملفات صوتية (Direct MP3 Links).
      يجب أن ينتهي الرابط بـ .mp3.
      لا ترسل روابط لصفحات ويب (مثل mp3quran.net/ar/...) بل أرسل رابط الملف الصوتي نفسه (مثل server8.mp3quran.net/.../001.mp3).
      ابحث في قواعد بيانات mp3quran.net و islamway.net و tvquran.com.
      أعد النتيجة بصيغة JSON تحتوي على مصفوفة من السور.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "اسم السورة" },
              url: { type: Type.STRING, description: "رابط مباشر وحصري للملف الصوتي MP3 ينتهي بـ .mp3" },
              type: { type: Type.STRING, enum: ["audio"] }
            },
            required: ["title", "url", "type"]
          }
        }
      }
    });

    const results = JSON.parse(response.text);
    return { results, sources: [] };
  } catch (error) {
    console.error("Fetch Mushaf Error:", error);
    return { results: [], sources: [] };
  }
};

export const searchRecitations = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ابحث عن تلاوات قرآنية مميزة لـ "${query}". 
      يجب العثور على روابط مباشرة وحقيقية لملفات صوتية (MP3) تعمل فوراً داخل مشغل HTML5. 
      تأكد أن الروابط تبدأ بـ http وتنتهي بـ .mp3.
      تجنب تماماً روابط يوتيوب أو روابط صفحات الويب التي تتطلب تفاعل مستخدم.
      المصادر المفضلة: mp3quran.net, tvquran.com, islamway.net.
      يجب أن تكون النتائج بصيغة JSON.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "اسم السورة" },
              reciter: { type: Type.STRING, description: "اسم القارئ" },
              url: { type: Type.STRING, description: "رابط مباشر وحصري لملف MP3 ينتهي بـ .mp3" },
              source: { type: Type.STRING, description: "اسم الموقع المصدر" }
            },
            required: ["title", "reciter", "url", "source"]
          }
        }
      }
    });

    const results = JSON.parse(response.text);
    return { results, sources: [] };
  } catch (error) {
    console.error("Search Error:", error);
    return { results: [], sources: [] };
  }
};

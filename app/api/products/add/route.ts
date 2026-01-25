import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Google Gemini istemcisini başlatma (Environment variable'dan key alır)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { name_tr, categoryId } = await req.json();

    // Basit bir kontrol
    if (!name_tr) throw new Error("Ürün adı eksik");

    // API key kontrolü
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY tanımlanmamış. Lütfen .env dosyasına ekleyin."
      }, { status: 500 });
    }

    // 1. Adım: Yapay Zeka ile Çeviri (Gemini AI Auto-Translation)
    // Sistemden Almanca ve Punjabi isimlerini istiyoruz
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `You are a professional translator. Translate the following Turkish food product name to German and Punjabi (Gurmukhi script).

Turkish product name: "${name_tr}"

Return ONLY a JSON object with this exact structure:
{
  "name_de": "German translation",
  "name_pa": "Punjabi translation in Gurmukhi script"
}

Do not include any explanations, just the JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Gemini bazen markdown code block içinde JSON döndürür, temizle
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // JSON parse et
    const translationData = JSON.parse(text);

    // Çeviri kontrolü
    if (!translationData.name_de || !translationData.name_pa) {
      throw new Error("Çeviri eksik");
    }

    return NextResponse.json({
      success: true,
      translation: translationData,
      original: name_tr
    });

  } catch (error) {
    console.error("Gemini Çeviri Hatası:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Çeviri Hatası"
    }, { status: 500 });
  }
}

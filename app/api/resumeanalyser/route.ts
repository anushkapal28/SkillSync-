import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    // Convert PDF to a format Gemini accepts
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert resume and career consultant. 
Analyze this resume and provide a clear structured report including:
1. Summary of strengths
2. Skills and proficiency
3. Weak or missing areas
4. Suggested job roles
5. Resume improvement advice
6. Overall ATS score (out of 100) 
Note: dont give Headings as it prints unnessecary #s and *s.
`;

    // Send both text prompt + PDF file
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "application/pdf", data: Buffer.from(uint8Array).toString("base64") } },
    ]);

    const text = result.response.text();
    return new Response(JSON.stringify({ analysis: text }), { status: 200 });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to analyze resume" }),
      { status: 500 }
    );
  }
}

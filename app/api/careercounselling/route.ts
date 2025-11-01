import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { career } = body;

    if (!career) {
      return new Response(
        JSON.stringify({ error: "Missing required field: career" }),
        { status: 400 }
      );
    }

    const prompt = `
You are a professional career coach. Provide a detailed guide for someone aspiring to become a ${career}.
Include:
- Key skills to master
- Recommended tools or technologies
- Step-by-step roadmap from beginner to expert
- Common challenges and how to overcome them
- Potential growth and future scope

Respond in plain text (no bold, no headings), in a clear and readable format.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ advice: text }), { status: 200 });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate career guide" }),
      { status: 500 }
    );
  }
}

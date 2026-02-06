import { NextRequest, NextResponse } from "next/server";
import { analyzeText, analyzeImage } from "@/lib/gemini";
import { AnalysisResponse } from "@/types/analysis";

export async function POST(request: NextRequest): Promise<NextResponse<AnalysisResponse>> {
  try {
    const body = await request.json();
    const { content, type, mimeType } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: "No content provided" },
        { status: 400 }
      );
    }

    let analysis;

    if (type === "image") {
      if (!mimeType) {
        return NextResponse.json(
          { success: false, error: "No mime type provided for image" },
          { status: 400 }
        );
      }
      analysis = await analyzeImage(content, mimeType);
    } else {
      analysis = await analyzeText(content);
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed"
      },
      { status: 500 }
    );
  }
}

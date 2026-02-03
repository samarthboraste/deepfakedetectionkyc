import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { frames } = await req.json();
    
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return new Response(
        JSON.stringify({ error: "No video frames provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the message with multiple frames for comprehensive analysis
    const imageContents = frames.slice(0, 8).map((frame: string) => ({
      type: "image_url",
      image_url: {
        url: frame,
      },
    }));

    const systemPrompt = `You are an expert deepfake detection AI specialized in analyzing video frames for signs of manipulation.

Analyze the provided video frames carefully for these deepfake indicators:
1. **Facial inconsistencies**: Unnatural skin textures, blurring around face edges, asymmetry issues
2. **Temporal artifacts**: Flickering, inconsistent lighting between frames, unnatural motion blur
3. **Eye anomalies**: Irregular blinking patterns, unnatural eye movements, reflection inconsistencies
4. **Mouth/lip sync issues**: Unnatural lip movements, teeth rendering problems
5. **Compression artifacts**: Unusual compression patterns around manipulated areas
6. **Background inconsistencies**: Warping or distortion near face boundaries
7. **Hair/ear boundaries**: Blending artifacts where hair meets face
8. **Lighting inconsistencies**: Shadow direction mismatches, unnatural lighting on face

Provide your analysis as JSON with this exact structure:
{
  "isAuthentic": boolean,
  "confidence": number (0-100),
  "analysis": {
    "facialConsistency": { "score": number (0-100), "issues": string[] },
    "temporalCoherence": { "score": number (0-100), "issues": string[] },
    "eyeAnalysis": { "score": number (0-100), "issues": string[] },
    "mouthAnalysis": { "score": number (0-100), "issues": string[] },
    "artifactDetection": { "score": number (0-100), "issues": string[] }
  },
  "summary": string (brief explanation of the verdict)
}

Be thorough but accurate. If unsure, lean toward caution but reflect that in the confidence score.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze these video frames for signs of deepfake manipulation. Look for any inconsistencies, artifacts, or signs of AI-generated or manipulated content. Provide a detailed analysis.",
              },
              ...imageContents,
            ],
          },
        ],
        temperature: 0.1, // Low temperature for more consistent analysis
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response from the AI
    let analysisResult;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback: try to extract key information
      const isAuthentic = content.toLowerCase().includes("authentic") && !content.toLowerCase().includes("not authentic");
      const confidenceMatch = content.match(/(\d{1,3})%/);
      analysisResult = {
        isAuthentic,
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 50,
        summary: "Analysis completed with parsing limitations.",
        analysis: null,
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-video error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

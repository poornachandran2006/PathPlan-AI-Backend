// lib/api.ts

/**
 * ✅ API Base URL
 * Now using '/api' to leverage the Next.js rewrite configured in next.config.ts.
 * This resolves "Failed to fetch" by proxying requests through the Next.js server.
 */
export const API_BASE_URL = "/api";

// ----------------------------
// 1. Resume Upload & Extraction (Orchestrator)
// ----------------------------
export async function uploadResume(file: File, targetRole: string) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("target_role", targetRole || "General Professional");
  formData.append("timeframe_months", "3");

  try {
    const response = await fetch(`${API_BASE_URL}/upload-resume`, {
      method: "POST",
      // mode: "cors" is no longer strictly needed with a same-origin proxy, 
      // but 'fetch' defaults to it.
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    // Custom error handling for proxy failures
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("Network error: The Next.js proxy could not reach the FastAPI backend. Check if uvicorn is running at http://127.0.0.1:8000");
    }
    throw error;
  }
}

// ----------------------------
// 2. Planner API (Specific Role Roadmap)
// ----------------------------
export async function generateSpecificRoadmap(capabilities: any, goal: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/planner/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        capabilities: capabilities,
        goal: goal,
        timeframe_months: 3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate specific roadmap: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error("Failed to connect to the Roadmap Planner service.");
  }
}

// ----------------------------
// 3. Opportunity Agent API
// ----------------------------
export async function analyzeOpportunities(capabilities: any, targetRole: string = "") {
  try {
    const response = await fetch(`${API_BASE_URL}/opportunities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        capabilities: capabilities,
        market_analysis: {}, 
        target_role: targetRole,
      }),
    });

    if (!response.ok) {
      throw new Error(`Opportunity API failed: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error("Failed to connect to the Opportunities service.");
  }
}

// ----------------------------
// 4. Professional Presence
// ----------------------------
export async function analyzeProfessionalPresence(githubUrl: string, linkedinUrl: string, targetRole: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/professional-insight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        target_role: targetRole,
        linkedin_text: { headline: "", about: "", experience: [] }
      }),
    });

    if (!response.ok) {
      throw new Error(`Professional presence review failed: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error("Failed to connect to the Professional Presence service.");
  }
}
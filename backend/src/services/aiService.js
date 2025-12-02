// backend/src/services/aiService.js
// AI integration service for feedback, hints, analysis, and challenge generation

const OpenAI = require("openai");

let openaiClient = null;

// Initialize AI client safely
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI client initialized");
} else {
  console.warn("⚠️ No OPENAI_API_KEY found — AI running in STUB MODE.");
}

/**
 * Internal safe wrapper for OpenAI
 */
const callOpenAI = async (systemPrompt, userPrompt) => {
  if (!openaiClient) {
    return (
      "AI Stub Mode Response:\n" +
      `System: ${systemPrompt.substring(0, 100)}...\n` +
      `User: ${userPrompt.substring(0, 100)}...`
    );
  }

  const completion = await openaiClient.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() || "";
};

const aiService = {
  /**
   * Generate AI feedback for a user's submission
   */
  generateFeedback: async (submissionText, challenge = {}) => {
    const systemPrompt =
      "You are a helpful programming tutor. Provide clear feedback, bullet points, and next steps.";

    const userPrompt =
      `Challenge:\n${challenge.title || "No title"}\n\n` +
      `Description:\n${challenge.description || "No description"}\n\n` +
      `Submission:\n${submissionText}`;

    return await callOpenAI(systemPrompt, userPrompt);
  },

  /**
   * Generate hints (not solutions!)
   */
  generateHints: async (challenge, userProgressSummary = "") => {
    const systemPrompt =
      "Give 2–3 short hints ONLY. No solutions. No full code.";

    const userPrompt =
      `Title: ${challenge.title}\n` +
      `Description: ${challenge.description}\n` +
      (userProgressSummary ? `User Progress: ${userProgressSummary}\n` : "") +
      "Hints please.";

    return await callOpenAI(systemPrompt, userPrompt);
  },

  /**
   * Suggest next challenges in JSON format
   */
  suggestNextChallenges: async (userProfile = {}, completedChallenges = []) => {
    const systemPrompt =
      "Return ONLY a JSON array of challenge suggestions. Do NOT include text outside JSON.";

    const userPrompt = JSON.stringify({
      userProfile,
      completedChallenges,
    });

    const response = await callOpenAI(systemPrompt, userPrompt);

    try {
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback if AI didn't return JSON
      return [
        {
          title: "Arrays & Loops Practice",
          description: "Write a function that sums an array.",
          difficulty: "easy",
          category: "programming",
        },
        {
          title: "Fix The API Error",
          description: "Debug a failing API call in React.",
          difficulty: "medium",
          category: "frontend",
        },
      ];
    }
  },

  /**
   * Analyze user learning pattern
   */
  analyzePattern: async (learningData = {}) => {
    const systemPrompt =
      "Summarize the student's learning pattern. Include 3 concrete recommendations.";

    const userPrompt = JSON.stringify(learningData);

    return await callOpenAI(systemPrompt, userPrompt);
  },
};

module.exports = aiService;

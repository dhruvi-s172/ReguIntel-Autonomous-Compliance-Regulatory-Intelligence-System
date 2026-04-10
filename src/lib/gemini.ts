import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateLegalSummary(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following regulatory circular for a legal-tech dashboard. Focus on key compliance requirements and penalties: \n\n${text}`,
  });
  return response.text;
}

export async function classifyRegulatoryChange(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Classify the following regulatory change into one of these categories: Compliance Requirement, Penalty, Scope, Procedural Change. Return only the category name. \n\n${text}`,
  });
  return response.text;
}

export async function analyzeImpact(circular: string, internalData: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the impact of this regulatory circular on the company's internal data. 
    Circular: ${circular}
    Internal Data: ${internalData}
    
    Provide a JSON response with:
    - riskScore (0-100)
    - affectedDepartments (array)
    - impactedProducts (array)
    - impactedContracts (array)
    - impactedPolicies (array)
    - summary (string)
    - causalChain (array of {from, to, impact, reason})
    - predictiveInsight (string)`,
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function draftAmendment(originalContent: string, circularChange: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Draft an amendment for the following policy/contract clause based on the regulatory change.
    Original Clause: ${originalContent}
    Regulatory Change: ${circularChange}
    
    Provide the updated clause text and a brief legal justification for the change.
    Return as JSON: { content: string, justification: string }`,
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function simulateScenario(scenario: string, currentCompliance: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Simulate the following regulatory scenario against the company's current compliance state.
    Scenario: ${scenario}
    Current State: ${currentCompliance}
    
    Return JSON: { impactScore: number, mitigationStrategy: string }`,
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || "{}");
}

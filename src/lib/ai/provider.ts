import { GoogleGenerativeAI } from '@google/generative-ai';
import { analysisSystemPrompt, debriefSystemPrompt, callBriefSystemPrompt, chatSystemPrompt } from './prompts';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GROQ_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey || 'dummy_api_key_for_build');
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

export interface LeadDataInput {
  name?: string;
  location?: string;
  requirement?: string;
  budget?: string;
  timeline?: string;
  [key: string]: unknown;
}

export interface ChatHistoryMessage {
  role: string;
  content: string;
}

export async function analyzeLead(leadData: LeadDataInput, customerMessage: string) {
  const prompt = `
<lead_record>
Name: ${leadData.name ?? ''}
Location: ${leadData.location ?? ''}
Property requirement: ${leadData.requirement ?? ''}
Budget: ${leadData.budget ?? ''}
Buying timeline: ${leadData.timeline ?? ''}
</lead_record>
<customer_message>
${customerMessage}
</customer_message>
  `;

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: analysisSystemPrompt,
    generationConfig: { responseMimeType: "application/json" }
  });

  const result = await model.generateContent(prompt);
  const responseContent = result.response.text() || "{}";
  return JSON.parse(responseContent);
}

export async function generateCallBrief(analysis: Record<string, unknown>) {
  const prompt = `Analysis:\n${JSON.stringify(analysis)}`;
  
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: callBriefSystemPrompt,
    generationConfig: { responseMimeType: "application/json" }
  });

  const result = await model.generateContent(prompt);
  const responseContent = result.response.text() || "{}";
  return JSON.parse(responseContent);
}

export async function debriefCall(previousAnalysis: Record<string, unknown>, leadRecord: Record<string, unknown>, callNotes: string, chatSummary: string = "") {
  const prompt = `
<previous_analysis>
${JSON.stringify(previousAnalysis)}
</previous_analysis>
<lead_record>
${JSON.stringify(leadRecord)}
</lead_record>
<chat_summary>
${chatSummary}
</chat_summary>
<call_notes>
${callNotes}
</call_notes>
  `;

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: debriefSystemPrompt,
    generationConfig: { responseMimeType: "application/json" }
  });

  const result = await model.generateContent(prompt);
  const responseContent = result.response.text() || "{}";
  return JSON.parse(responseContent);
}

export async function chatWithLead(leadContext: Record<string, unknown>, newQuestion: string, history: ChatHistoryMessage[] = []) {
  const contextStr = `
<lead_context>
${JSON.stringify(leadContext)}
</lead_context>
  `;

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: chatSystemPrompt
  });

  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }))
  });

  const result = await chat.sendMessageStream(contextStr + '\n' + newQuestion);

  return {
    stream: (async function* () {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield { text: () => text };
        }
      }
    })()
  };
}

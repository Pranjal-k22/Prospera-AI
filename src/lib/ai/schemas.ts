import { SchemaType } from '@google/generative-ai';

// Gemini Schema objects
export const aiAnalysisSchemaObj = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING, description: "2 sentences maximum. Who they are, what they want, how urgent." },
    intent: { type: SchemaType.STRING, description: 'ready_to_buy, actively_comparing, early_research, investor, unclear' },
    intent_reasoning: { type: SchemaType.STRING, description: "one sentence citing evidence from the message" },
    key_requirements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "array of short strings (max 6), each 8 words or fewer" },
    objections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          concern: { type: SchemaType.STRING },
          evidence: { type: SchemaType.STRING },
          severity: { type: SchemaType.STRING, description: 'low, medium, high' }
        },
        required: ["concern", "evidence", "severity"]
      }
    },
    next_action: { type: SchemaType.STRING, description: "one imperative sentence starting with a verb" },
    suggested_response: { type: SchemaType.STRING, description: "60-120 words, warm and professional" },
    scores: {
      type: SchemaType.OBJECT,
      properties: {
        intent_strength: { type: SchemaType.INTEGER, description: "0-10" },
        budget_fit: { type: SchemaType.INTEGER, description: "0-10" },
        timeline_urgency: { type: SchemaType.INTEGER, description: "0-10" },
        information_completeness: { type: SchemaType.INTEGER, description: "0-10" },
        engagement_quality: { type: SchemaType.INTEGER, description: "0-10" }
      },
      required: ["intent_strength", "budget_fit", "timeline_urgency", "information_completeness", "engagement_quality"]
    },
    score_rationale: { type: SchemaType.STRING, description: "one sentence explaining strongest positive and biggest drag" },
    confidence: { type: SchemaType.STRING, description: 'high, medium, low' },
    missing_info: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "max 3 questions" }
  },
  required: [
    "summary", "intent", "intent_reasoning", "key_requirements", "objections", 
    "next_action", "suggested_response", "scores", "score_rationale", "confidence", "missing_info"
  ]
};

export const callBriefSchemaObj = {
  type: SchemaType.OBJECT,
  properties: {
    opener: { type: SchemaType.STRING, description: "max 25 words" },
    discovery_questions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "exactly 3" },
    likely_objections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          objection: { type: SchemaType.STRING },
          suggested_rebuttal: { type: SchemaType.STRING, description: "max 30 words" }
        },
        required: ["objection", "suggested_rebuttal"]
      },
      description: "max 3"
    },
    avoid_saying: { type: SchemaType.STRING, description: "one line" },
    goal_of_call: { type: SchemaType.STRING, description: "one line" }
  },
  required: ["opener", "discovery_questions", "likely_objections", "avoid_saying", "goal_of_call"]
};

export const debriefSchemaObj = {
  type: SchemaType.OBJECT,
  properties: {
    updated_requirements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    updated_objections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          concern: { type: SchemaType.STRING },
          evidence: { type: SchemaType.STRING },
          severity: { type: SchemaType.STRING },
          resolved: { type: SchemaType.BOOLEAN }
        },
        required: ["concern", "evidence", "severity"]
      }
    },
    updated_scores: {
      type: SchemaType.OBJECT,
      properties: {
        intent_strength: { type: SchemaType.INTEGER },
        budget_fit: { type: SchemaType.INTEGER },
        timeline_urgency: { type: SchemaType.INTEGER },
        information_completeness: { type: SchemaType.INTEGER },
        engagement_quality: { type: SchemaType.INTEGER }
      },
      required: ["intent_strength", "budget_fit", "timeline_urgency", "information_completeness", "engagement_quality"]
    },
    what_changed: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "max 4, start with +, -, ~" },
    next_action: { type: SchemaType.STRING },
    follow_up_message: { type: SchemaType.STRING }
  },
  required: ["updated_requirements", "updated_objections", "updated_scores", "what_changed", "next_action", "follow_up_message"]
};

// ==============================================================================
// RUNTIME SHAPE VALIDATORS (Manual, Zero External Dependencies)
// ==============================================================================

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function clampScore(val: unknown, fallback = 5): number {
  const num = typeof val === 'number' ? val : parseInt(String(val), 10);
  if (isNaN(num)) return fallback;
  return Math.min(10, Math.max(0, Math.round(num)));
}

export interface ValidatedAnalysis {
  summary: string;
  intent: string;
  intent_reasoning: string;
  key_requirements: string[];
  objections: Array<{ concern: string; evidence: string; severity: string; resolved?: boolean }>;
  next_action: string;
  suggested_response: string;
  scores: {
    intent_strength: number;
    budget_fit: number;
    timeline_urgency: number;
    information_completeness: number;
    engagement_quality: number;
  };
  score_rationale: string;
  confidence: string;
  missing_info: string[];
}

export function validateAnalysisShape(raw: unknown): ValidatedAnalysis {
  if (!isObject(raw)) {
    throw new Error('AI analysis output is not a valid JSON object');
  }

  const rawScores = isObject(raw.scores) ? raw.scores : {};
  const scores = {
    intent_strength: clampScore(rawScores.intent_strength),
    budget_fit: clampScore(rawScores.budget_fit),
    timeline_urgency: clampScore(rawScores.timeline_urgency),
    information_completeness: clampScore(rawScores.information_completeness),
    engagement_quality: clampScore(rawScores.engagement_quality)
  };

  const key_requirements = Array.isArray(raw.key_requirements)
    ? raw.key_requirements.map(String)
    : [];

  const objections = Array.isArray(raw.objections)
    ? raw.objections.filter(isObject).map(o => ({
        concern: String(o.concern || ''),
        evidence: String(o.evidence || ''),
        severity: ['low', 'medium', 'high'].includes(String(o.severity)) ? String(o.severity) : 'medium',
        resolved: Boolean(o.resolved)
      }))
    : [];

  const missing_info = Array.isArray(raw.missing_info)
    ? raw.missing_info.map(String)
    : [];

  return {
    summary: String(raw.summary || 'Summary unavailable'),
    intent: String(raw.intent || 'unclear'),
    intent_reasoning: String(raw.intent_reasoning || ''),
    key_requirements,
    objections,
    next_action: String(raw.next_action || 'Contact lead for discovery call'),
    suggested_response: String(raw.suggested_response || 'Thank you for reaching out to Prospera AI.'),
    scores,
    score_rationale: String(raw.score_rationale || ''),
    confidence: ['high', 'medium', 'low'].includes(String(raw.confidence)) ? String(raw.confidence) : 'medium',
    missing_info
  };
}

export interface ValidatedCallBrief {
  opener: string;
  discovery_questions: string[];
  likely_objections: Array<{ objection: string; suggested_rebuttal: string }>;
  avoid_saying: string;
  goal_of_call: string;
}

export function validateCallBriefShape(raw: unknown): ValidatedCallBrief {
  if (!isObject(raw)) {
    throw new Error('AI call brief output is not a valid JSON object');
  }

  const discovery_questions = Array.isArray(raw.discovery_questions)
    ? raw.discovery_questions.map(String)
    : ['What is your primary investment goal?'];

  const likely_objections = Array.isArray(raw.likely_objections)
    ? raw.likely_objections.filter(isObject).map(o => ({
        objection: String(o.objection || 'Timeline hesitation'),
        suggested_rebuttal: String(o.suggested_rebuttal || 'Highlight current market scarcity')
      }))
    : [];

  return {
    opener: String(raw.opener || 'Hello, thank you for your interest in our luxury listings.'),
    discovery_questions,
    likely_objections,
    avoid_saying: String(raw.avoid_saying || 'Avoid discussing unverified price reductions.'),
    goal_of_call: String(raw.goal_of_call || 'Schedule an in-person property walkthrough.')
  };
}

export interface ValidatedDebrief {
  updated_requirements?: string[];
  updated_objections?: Array<{ concern: string; evidence: string; severity: string; resolved?: boolean }>;
  updated_scores?: {
    intent_strength: number;
    budget_fit: number;
    timeline_urgency: number;
    information_completeness: number;
    engagement_quality: number;
  };
  what_changed: string[];
  next_action: string;
  follow_up_message: string;
}

export function validateDebriefShape(raw: unknown): ValidatedDebrief {
  if (!isObject(raw)) {
    throw new Error('AI debrief output is not a valid JSON object');
  }

  let updated_scores: ValidatedDebrief['updated_scores'] | undefined = undefined;
  if (isObject(raw.updated_scores)) {
    updated_scores = {
      intent_strength: clampScore(raw.updated_scores.intent_strength),
      budget_fit: clampScore(raw.updated_scores.budget_fit),
      timeline_urgency: clampScore(raw.updated_scores.timeline_urgency),
      information_completeness: clampScore(raw.updated_scores.information_completeness),
      engagement_quality: clampScore(raw.updated_scores.engagement_quality)
    };
  }

  const what_changed = Array.isArray(raw.what_changed)
    ? raw.what_changed.map(String)
    : ['Notes recorded from recent call'];

  return {
    updated_requirements: Array.isArray(raw.updated_requirements) ? raw.updated_requirements.map(String) : undefined,
    updated_objections: Array.isArray(raw.updated_objections)
      ? raw.updated_objections.filter(isObject).map(o => ({
          concern: String(o.concern || ''),
          evidence: String(o.evidence || ''),
          severity: String(o.severity || 'medium'),
          resolved: Boolean(o.resolved)
        }))
      : undefined,
    updated_scores,
    what_changed,
    next_action: String(raw.next_action || 'Follow up as agreed on the call'),
    follow_up_message: String(raw.follow_up_message || 'Thank you for your time on the phone today.')
  };
}

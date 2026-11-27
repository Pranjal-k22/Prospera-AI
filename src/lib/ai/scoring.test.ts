import { describe, it, expect } from 'vitest';
import { calculatePriority, calculateRawScore, calculateDecay, W, Scores } from './scoring';

describe('Lead Scoring Engine', () => {
  it('has verified weights summing to 1.0', () => {
    expect(W.intent_strength).toBe(0.30);
    expect(W.timeline_urgency).toBe(0.25);
    expect(W.budget_fit).toBe(0.25);
    expect(W.engagement_quality).toBe(0.10);
    expect(W.information_completeness).toBe(0.10);

    const sum = Object.values(W).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 5);
  });

  it('matches worked example: ratings (8, 9, 7, 6, 8) with 3 days decay', () => {
    const input: Scores = {
      intent_strength: 8,
      timeline_urgency: 9,
      budget_fit: 7,
      engagement_quality: 6,
      information_completeness: 8
    };

    const raw = calculateRawScore(input);
    expect(raw).toBe(78);

    const decay = calculateDecay(3);
    expect(decay).toBe(6);

    const result = calculatePriority(input, 3);
    expect(result.score).toBe(72);
    expect(result.tier).toBe('hot');
    expect(result.atRisk).toBe(true);
  });

  describe('Staleness Decay Rule', () => {
    it('applies 0 penalty for day 0 or day 1', () => {
      expect(calculateDecay(0)).toBe(0);
      expect(calculateDecay(1)).toBe(0);
    });

    it('applies 3 points penalty for day 2', () => {
      expect(calculateDecay(2)).toBe(3);
    });

    it('caps penalty at 15 points for large gaps', () => {
      expect(calculateDecay(6)).toBe(15);
      expect(calculateDecay(10)).toBe(15);
      expect(calculateDecay(100)).toBe(15);
    });
  });

  describe('Tier Cutoff Boundaries', () => {
    // Helper to produce a precise score with 0 decay
    // W: intent(0.30), timeline(0.25), budget(0.25), engagement(0.10), completeness(0.10)
    // 7.0 * 10 = 70
    it('assigns 70 as HOT', () => {
      const scores: Scores = {
        intent_strength: 7,
        timeline_urgency: 7,
        budget_fit: 7,
        engagement_quality: 7,
        information_completeness: 7
      };
      const result = calculatePriority(scores, 0);
      expect(result.score).toBe(70);
      expect(result.tier).toBe('hot');
    });

    it('assigns 69 as WARM', () => {
      // 6.9 * 10 = 69
      // intent 7 (2.1), timeline 7 (1.75), budget 7 (1.75), engagement 6 (0.6), completeness 7 (0.7) = 6.9
      const scores: Scores = {
        intent_strength: 7,
        timeline_urgency: 7,
        budget_fit: 7,
        engagement_quality: 6,
        information_completeness: 7
      };
      const result = calculatePriority(scores, 0);
      expect(result.score).toBe(69);
      expect(result.tier).toBe('warm');
    });

    it('assigns 45 as WARM', () => {
      // 4.5 * 10 = 45
      const scores: Scores = {
        intent_strength: 4.5,
        timeline_urgency: 4.5,
        budget_fit: 4.5,
        engagement_quality: 4.5,
        information_completeness: 4.5
      };
      const result = calculatePriority(scores, 0);
      expect(result.score).toBe(45);
      expect(result.tier).toBe('warm');
    });

    it('assigns 44 as COLD', () => {
      // 4.4 * 10 = 44
      const scores: Scores = {
        intent_strength: 4.4,
        timeline_urgency: 4.4,
        budget_fit: 4.4,
        engagement_quality: 4.4,
        information_completeness: 4.4
      };
      const result = calculatePriority(scores, 0);
      expect(result.score).toBe(44);
      expect(result.tier).toBe('cold');
    });
  });

  describe('Score Clamping (0 to 100)', () => {
    it('clamps to 0 when raw minus decay is negative', () => {
      const lowScores: Scores = {
        intent_strength: 1,
        timeline_urgency: 0,
        budget_fit: 0,
        engagement_quality: 0,
        information_completeness: 0
      }; // raw = 3
      const result = calculatePriority(lowScores, 10); // decay = 15 => 3 - 15 = -12
      expect(result.score).toBe(0);
      expect(result.tier).toBe('cold');
    });

    it('clamps to 100 when all scores are maxed', () => {
      const maxScores: Scores = {
        intent_strength: 10,
        timeline_urgency: 10,
        budget_fit: 10,
        engagement_quality: 10,
        information_completeness: 10
      };
      const result = calculatePriority(maxScores, 0);
      expect(result.score).toBe(100);
      expect(result.tier).toBe('hot');
    });
  });
});

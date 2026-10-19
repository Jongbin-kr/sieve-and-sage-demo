import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { examples, modelNames, results } from './data';
import { matchExample, simulate, validateInput } from './simulation';

describe('honest example simulation', () => {
  it('skips Sage for the distracted path and makes no remote calls', () => {
    const e = examples[2];
    const result = simulate(e.question, e.documents);
    expect(result.sageCalls).toBe(0);
    expect(result.baselineCalls).toBe(0);
    expect(result.remoteCalls).toBe(0);
    expect(result.sieveDecision).toBe('abstain');
    expect(result.score).toBeNull();
    expect(result.timings).toBeNull();
  });
  it('distinguishes answerable and unanswerable after a pass', () => {
    for (const e of examples.slice(0, 2)) {
      const result = simulate(e.question, e.documents);
      expect(result.sageCalls).toBe(1);
      expect(result.sieveDecision).toBe('pass');
      expect(result.example.answer).toBe(e.id === 'answerable' ? '1986' : null);
    }
  });
  it('only adds the baseline path for an explicit comparison', () => {
    const e = examples[2];
    const result = simulate(e.question, e.documents, true);
    expect(result.sageCalls).toBe(0);
    expect(result.baselineCalls).toBe(1);
    expect(result.remoteCalls).toBe(0);
  });
  it('never silently applies fixture results to custom or reordered input', () => {
    const e = examples[0];
    expect(matchExample(e.question + ' edited', e.documents)).toBeUndefined();
    expect(matchExample(e.question, [...e.documents].reverse())).toBeUndefined();
    expect(() => simulate(e.question, [{ ...e.documents[0], text: 'Different year: 2000' }])).toThrow('live backend');
    expect(matchExample(e.question, [{ ...e.documents[0], id: 'changed' }, e.documents[1]])).toBeUndefined();
  });
  it('validates empty, oversized, duplicate and excess inputs', () => {
    expect(validateInput('', examples[0].documents)).toMatch('question');
    expect(validateInput('a'.repeat(2001), examples[0].documents)).toMatch('2,000');
    expect(validateInput('q', [])).toMatch('1–5');
    expect(validateInput('q', Array(6).fill(examples[0].documents[0]))).toMatch('1–5');
    expect(validateInput('q', [examples[0].documents[0], examples[0].documents[0]])).toMatch('unique');
    expect(validateInput('q', [{ id: 'x', text: '' }])).toMatch('ID and text');
    expect(validateInput('q', [{ id: 'x', text: 'a'.repeat(12001) }])).toMatch('12,000');
  });
});

it('matches every chart value against independently extracted manuscript CSV', () => {
  const rows = readFileSync('public/results.csv', 'utf8').trim().split('\n').slice(1).map(line => line.trim().split(','));
  expect(rows).toHaveLength(40);
  for (const [dataset, model, accuracy, f1, latency] of rows) {
    const result = results.find(r => r.dataset === dataset)!;
    const index = modelNames.indexOf(model as typeof modelNames[number]);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(result.values[index]).toEqual([Number(accuracy), Number(f1), Number(latency)]);
  }
});

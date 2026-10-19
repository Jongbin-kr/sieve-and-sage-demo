import { examples, type Document, type Example } from './data';

export function matchExample(question: string, documents: Document[]): Example | undefined {
  return examples.find(example => question === example.question &&
    documents.length === example.documents.length &&
    documents.every((doc, i) => doc.id === example.documents[i].id && doc.text === example.documents[i].text));
}

export function validateInput(question: string, documents: Document[]): string | null {
  if (!question.trim()) return 'Enter a question.';
  if (question.length > 2000) return 'Keep the question within 2,000 characters.';
  if (documents.length < 1 || documents.length > 5) return 'Provide 1–5 documents.';
  if (documents.some(doc => !doc.id.trim() || !doc.text.trim())) return 'Each document needs an ID and text.';
  if (new Set(documents.map(doc => doc.id.trim())).size !== documents.length) return 'Document IDs must be unique.';
  if (documents.some(doc => doc.text.length > 12000)) return 'Keep each document within 12,000 characters.';
  return null;
}

export function simulate(question: string, documents: Document[], compare = false) {
  const error = validateInput(question, documents);
  if (error) throw new Error(error);
  const example = matchExample(question, documents);
  if (!example) throw new Error('Custom input needs the live backend. Restore a supplied example to run this walkthrough.');
  return {
    mode: 'simulation' as const,
    example,
    sieveDecision: example.id === 'distracted' ? 'abstain' : 'pass',
    sageCalls: example.id === 'distracted' ? 0 : 1,
    baselineCalls: compare ? 1 : 0,
    remoteCalls: 0,
    score: null,
    timings: null,
    compare,
  };
}

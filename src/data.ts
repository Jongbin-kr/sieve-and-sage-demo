export const PAPER_URL = import.meta.env.VITE_PAPER_URL || 'https://arxiv.org/abs/2609.35794';
export const CODE_URL = 'https://github.com/Jongbin-kr/Sieve-and-Sage';
export const RESEARCH_COMMIT = '7c03d99aa8cfb3d97bf62888462e349e21b80adf';

export type RetrievalState = 'answerable' | 'unanswerable' | 'distracted';
export interface Document { id: string; text: string }
export interface Example {
  id: RetrievalState;
  label: string;
  question: string;
  documents: Document[];
  explanation: string;
  answer: string | null;
}

// Original, fictional teaching examples, not benchmark samples or model outputs.
export const examples: Example[] = [
  {
    id: 'answerable', label: 'Answerable',
    question: 'In which year did the fictional Aster Observatory open?',
    documents: [
      { id: 'doc-1', text: 'The Aster Observatory opened in 1986. Its first telescope was installed in the east dome.' },
      { id: 'doc-2', text: 'Aster Observatory hosts public viewing nights every Friday. The west dome was added in 2004.' },
    ],
    explanation: 'The documents provide a year of opening without conflicting evidence. In this scripted example, Sieve passes the set and Sage answers.',
    answer: '1986',
  },
  {
    id: 'unanswerable', label: 'Insufficient evidence',
    question: 'In which year did the fictional Aster Observatory open?',
    documents: [
      { id: 'doc-1', text: 'Aster Observatory hosts public viewing nights every Friday. It operates two telescopes.' },
      { id: 'doc-2', text: 'The west dome at Aster Observatory was added in 2004. This record does not state when the observatory first opened.' },
    ],
    explanation: 'No opening year is given. Passing Sieve does not mean the question is answerable: Sage must still check whether the evidence supports an answer.',
    answer: null,
  },
  {
    id: 'distracted', label: 'Distracting evidence',
    question: 'In which year did the fictional Aster Observatory open?',
    documents: [
      { id: 'doc-1', text: 'The Aster Observatory opened in 1986. Its first telescope was installed in the east dome.' },
      { id: 'doc-2', text: 'The Aster Observatory first opened in 1992, with an inaugural ceremony in June of that year.' },
    ],
    explanation: 'The documents give conflicting opening years. The illustrated Sieve decision is to abstain early, so this path makes no Sage call. No individual document is labeled or removed.',
    answer: null,
  },
];

export const modelNames = ['Vanilla LLM', 'Sage-only', 'DTA-RAAT', 'DTA-chatQA', 'Sieve and Sage'] as const;
// Exact transcription of supplied paper.md, Table 15. Values are NOT demo measurements.
export const results = [
  { dataset: 'NQ-google', domain: 'General', values: [[.102,.179,74.204],[.664,.487,673.098],[.128,.123,328.374],[.230,.221,756.341],[.796,.731,379.574]] },
  { dataset: 'NQ-wiki', domain: 'General', values: [[.154,.241,88.822],[.792,.730,144.024],[.167,.142,122.625],[.226,.267,138.545],[.638,.632,103.794]] },
  { dataset: 'WebQ', domain: 'General', values: [[.110,.198,95.664],[.746,.667,166.580],[.153,.138,134.562],[.186,.219,170.475],[.578,.562,122.435]] },
  { dataset: 'RealtimeQA', domain: 'General', values: [[.225,.238,78.921],[.535,.314,869.669],[.134,.103,384.136],[.262,.253,897.628],[.802,.734,533.283]] },
  { dataset: 'RAG-Bench', domain: 'General', values: [[.125,.197,111.257],[.397,.415,124.208],[.179,.122,101.251],[.191,.215,112.768],[.368,.375,110.259]] },
  { dataset: 'MedQA', domain: 'Expert', values: [[.322,.412,168.602],[.489,.548,509.038],[.041,.127,304.529],[.297,.367,502.077],[.682,.766,322.954]] },
  { dataset: 'BioASQ', domain: 'Expert', values: [[.333,.326,138.037],[.428,.529,389.105],[.002,.073,216.414],[.456,.362,363.750],[.428,.552,312.165]] },
  { dataset: 'AstroQA', domain: 'Expert', values: [[.218,.347,779.595],[.550,.620,661.126],[.093,.170,393.698],[.208,.296,693.382],[.630,.662,453.511]] },
];

export const citation = `@misc{won2026sieve,
  title = {Sieve and Sage: Efficient Distraction Filtering for Reliable RALM Abstention},
  author = {Jongbin Won and Sung Geun An and Jay-Yoon Lee},
  year = {2026},
  eprint = {2609.35794},
  archivePrefix = {arXiv},
  primaryClass = {cs.CL},
  url = {https://arxiv.org/abs/2609.35794}
}`;

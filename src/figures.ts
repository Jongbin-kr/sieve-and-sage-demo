export interface ResearchFigure {
  id: string;
  file: string;
  title: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

// Unmodified embedded PNGs from the author's EMNLP 2026 poster PPTX.
// SHA256 hashes and source entries are recorded in public/figures/provenance.json.
export const figures = {
  framework: {
    id: 'framework', file: 'framework.png', title: 'Sieve and Sage framework', width: 2210, height: 838,
    alt: 'Three document sets enter Sieve. Distracted evidence exits early with a distraction abstention. The other sets reach Sage, which answers Burj Khalifa or abstains for insufficient evidence. State-specific signals connect to post-abstention strategies.',
    caption: 'Sieve detects distracting evidence before invoking Sage. Sage generates a grounded answer or abstains when evidence is insufficient. Different abstention states can guide different follow-up strategies.',
  },
  states: {
    id: 'retrieval-states', file: 'retrieval-states.png', title: 'Three retrieval states', width: 2568, height: 1074,
    alt: 'For the tallest-building question, an answerable document names Burj Khalifa, an unanswerable document gives only a construction year, and a deliberately distracting document names Taipei 101. The composition of the document set determines its retrieval state.',
    caption: 'Document-level evidence composition defines answerable, unanswerable, and distracted retrieval states. The red statement is deliberately misleading evidence in the research illustration.',
  },
  robust: {
    id: 'robust-ralm', file: 'robust-ralm.png', title: 'Robust RALM', width: 982, height: 436,
    alt: 'A robust RALM returns Burj Khalifa for all three document sets, including a set without supporting evidence, where it relies on parametric knowledge.',
    caption: 'A correct answer may still be unsupported by the retrieved documents.',
  },
  monolithic: {
    id: 'llm-abstention', file: 'llm-abstention.png', title: 'LLM-centric abstention', width: 1188, height: 564,
    alt: 'A single language model answers the supported case and abstains for missing or distracting evidence, but both abstentions leave the underlying state unknown.',
    caption: 'A single abstention signal does not explain which retrieval failure occurred.',
  },
  pareto: {
    id: 'accuracy-efficiency', file: 'accuracy-efficiency.png', title: 'Accuracy and efficiency', width: 1370, height: 512,
    alt: 'Two original research scatter plots compare inference time with system accuracy and Macro-F1 across datasets and methods. Stars identify Sieve and Sage; squares Sage-only; circles vanilla LLM; triangles DTA-chatQA and DTA-RAAT.',
    caption: 'The poster compares reliability and inference cost across datasets. Stars mark Sieve and Sage. Axes and legend are preserved from the original figure; the table explorer below reports manuscript Table 15 values.',
  },
  components: {
    id: 'component-analysis', file: 'component-analysis.png', title: 'Component analysis', width: 1240, height: 598,
    alt: 'Ablation table: on NQ-google, fine-tuning both stages achieves 0.796 system accuracy and 0.731 Macro-F1; on RealtimeQA, 0.802 and 0.734. Both exceed vanilla, Sage-only fine-tuning, and Sieve-only fine-tuning in these two comparisons.',
    caption: 'Fine-tuning both stages gives the highest system accuracy and Macro-F1 among the configurations shown for NQ-google and RealtimeQA.',
  },
  recovery: {
    id: 'state-aware-recovery', file: 'state-aware-recovery.png', title: 'State-aware follow-up strategies', width: 1194, height: 524,
    alt: 'Research recovery table: NQ-google accuracy is 0.247 without recovery, 0.867 with distraction filtering, and 0.716 with an agent in the loop. RealtimeQA values are 0.380, 0.943, and 0.774 respectively.',
    caption: 'The poster reports targeted recovery experiments after abstention. These research strategies are not implemented in the interactive demo.',
  },
  binary: {
    id: 'binary-training', file: 'binary-training.png', title: 'Why binary training for Sieve?', width: 1272, height: 696,
    alt: 'Side-by-side t-SNE projections compare binary training on answerable versus conflict states with three-way training that also includes unanswerable states. In the binary projection, distracting examples form a more distinct group, including negated and adversarial examples.',
    caption: 'The poster’s t-SNE analysis shows clearer separation of distracting cases with binary training, including unseen negated and adversarial examples. This is a qualitative visualization, not a calibrated confidence measure.',
  },
} satisfies Record<string, ResearchFigure>;

export const figureUrl = (figure: ResearchFigure) => `${import.meta.env.BASE_URL}figures/${figure.file}`;
export const POSTER_URL = `${import.meta.env.BASE_URL}downloads/sieve-and-sage-poster.pdf`;

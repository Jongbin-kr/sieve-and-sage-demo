import { useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCheck, ChevronRight, CircleHelp, Copy, Download, FileText, Filter, FlaskConical, Github, Menu, Plus, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react';
import { CODE_URL, PAPER_URL, citation, examples, modelNames, results, type Document, type RetrievalState } from './data';
import { matchExample, simulate, validateInput } from './simulation';
import ResearchFigure from './ResearchFigure';
import { figures, POSTER_URL } from './figures';

function Mark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark ${small ? 'small' : ''}`} aria-hidden="true"><Filter strokeWidth={1.4} /></span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="nav-wrap">
    <a className="brand" href="#home" aria-label="Sieve and Sage home"><Mark small /><span>Sieve <i>&</i> Sage</span></a>
    <button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="navigation" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    <nav id="navigation" className={open ? 'open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}>
      <a href="#home">Overview</a><a href="#results">Key results</a><a href="#demo">Demo <span className="nav-dot" /></a><a href="#method">Method</a>
    </nav>
    <a className="nav-code" href={CODE_URL} target="_blank" rel="noreferrer"><Github size={17} /> Code <ArrowUpRight size={14} /></a>
  </div></header>;
}

function Hero() {
  return <section className="hero" id="home">
    <div className="hero-copy">
      <div className="eyebrow"><span className="conference-mark" /> EMNLP 2026 · FINDINGS <span className="eyebrow-divider">/</span> RESEARCH PROJECT</div>
      <h1>Sieve <em>and</em> <span>Sage</span></h1>
      <h2>Efficient Distraction Filtering<br />for Reliable RALM Abstention</h2>
      <p className="hero-description">Handling different retrieval failures with a monolithic LLM is costly.<br className="desktop-break" /> Instead, we propose a two-stage framework.</p>
      <div className="authors"><span>Jongbin Won<sup>1</sup></span><span>Sung Geun An<sup>1</sup></span><span>Jay-Yoon Lee<sup>1</sup></span></div>
      <p className="affiliation"><sup>1</sup> Graduate School of Data Science, Seoul National University</p>
      <div className="hero-actions"><a className="button primary" href={PAPER_URL} target="_blank" rel="noreferrer"><FileText size={17} /> Read the paper <ArrowUpRight size={15} /></a><a className="button secondary" href={POSTER_URL} target="_blank" rel="noreferrer"><BookOpen size={17} /> View poster</a><a className="button secondary" href={CODE_URL} target="_blank" rel="noreferrer"><Github size={17} /> Research code</a><a className="button text-action" href="#demo">Try the walkthrough <ArrowRight size={17} /></a></div>
    </div>
    <div className="hero-figure-header"><span>THE SIEVE AND SAGE FRAMEWORK</span><span>Early abstention. Grounded generation. State-aware recovery.</span></div>
    <ResearchFigure figure={figures.framework} priority className="hero-figure" />
  </section>;
}

function Highlights() {
  return <div className="highlights">
    <div className="highlights-intro"><span className="eyebrow">ACCURACY & EFFICIENCY</span><p>Two stages.<br />Two advantages.</p></div>
    <div className="stat"><strong>+69.4<span>pp</span></strong><span>System accuracy</span><small>Up to · vs. vanilla LLM</small></div>
    <div className="stat"><strong>1.99<span>×</span></strong><span>Faster inference</span><small>Up to · vs. DTA-chatQA</small></div>
    <div className="stat state-stat"><ShieldCheck size={28} strokeWidth={1.3} /><span>State-aware abstention</span><small>Target the cause of abstention</small></div>
    <p className="stats-note">Research results, not demo measurements. The poster summarizes speedup as 1.9×; the manuscript reports 1.99×. Benefits vary by dataset. <a href="#results">Explore the evidence <ArrowRight size={12} /></a></p>
  </div>;
}

function Overview() {
  return <section className="section overview" id="overview">
    <div className="section-heading"><span className="section-number">03 / BACKGROUND</span><h2>A correct answer<br />is not always enough.</h2></div>
    <div className="overview-text"><p>Prior work focuses on robust RALMs under noisy retrieval. But in expert domains, <strong>abstention can be more valuable than a correct but ungrounded answer.</strong></p><p>Existing abstention methods are largely LLM-centric, incurring substantial computational costs. They also tend to treat different causes of abstention as a single state.</p></div>
    <div className="comparison-figures"><div><span className="figure-overline">01 / ROBUSTNESS</span><ResearchFigure figure={figures.robust} /></div><div><span className="figure-overline">02 / LLM-CENTRIC ABSTENTION</span><ResearchFigure figure={figures.monolithic} /></div></div>
    <div className="problem-heading"><span className="section-number">PROBLEM FORMULATION</span><h3>Three retrieval states.<br />Different evidence. Different decisions.</h3><p>We categorize retrieved document sets based on their document-level evidence composition.</p></div>
    <div className="states"><article><div className="state-icon answerable"><CheckCheck /></div><span className="micro-label">STATE 01</span><h3>Answerable</h3><p>Supporting evidence is present without distracting evidence.</p><span className="state-outcome">Sieve passes → Sage answers</span></article><article><div className="state-icon unanswerable"><CircleHelp /></div><span className="micro-label">STATE 02</span><h3>Unanswerable</h3><p>The required evidence is absent.</p><span className="state-outcome">Sieve passes → Sage abstains</span></article><article><div className="state-icon distracted"><Filter /></div><span className="micro-label">STATE 03</span><h3>Distracted</h3><p>Supporting evidence coexists with conflicting, negated, or adversarial documents.</p><span className="state-outcome">Sieve abstains → Sage is skipped</span></article></div>
    <ResearchFigure figure={figures.states} className="states-figure" />
    <p className="fine-print">These are the intended paths. Model decisions can be incorrect; a Sieve pass does not certify that an answer is supported.</p>
  </section>;
}

function Method() {
  return <section className="method-band" id="method"><div className="section method">
    <div className="method-intro"><span className="section-number">04 / METHODOLOGY</span><h2>Detect distraction early.<br /><em>Reason with evidence.</em></h2><p>Separate distraction detection from grounded answering and abstention.</p><a className="text-link" href={PAPER_URL} target="_blank" rel="noreferrer">Read the methodology <ArrowUpRight size={15} /></a></div>
    <div className="method-steps"><article><span className="step-number">01</span><div><h3>Sieve <span>LIGHTWEIGHT CLASSIFIER</span></h3><p>Detect distracting evidence and trigger early abstention before invoking the LLM. Sieve screens the entire document set.</p><div className="method-chips"><span>Longformer-base-4096</span><span>Binary classification</span></div><p className="training-note"><strong>Training:</strong> answerable vs. conflict retrieval states.</p></div></article><article><span className="step-number">02</span><div><h3>Sage <span>GROUNDED GENERATION</span></h3><p>Generate a grounded answer, or abstain when evidence is insufficient. State-specific abstention signals guide different follow-up strategies.</p><div className="method-chips"><span>Llama 3 8B or domain variants</span><span>Answer or abstain</span></div><p className="training-note"><strong>Training:</strong> supervised fine-tuning for grounded answers and unanswerable abstention.</p></div></article>
    <p className="method-footnote">The poster describes the research architecture. The live wrapper and post-abstention recovery are not implemented in this demo. Sieve alone does not identify or delete individual documents.</p></div>
  </div></section>;
}

function Demo() {
  const [selected, setSelected] = useState<RetrievalState>('answerable');
  const [question, setQuestion] = useState(examples[0].question);
  const [documents, setDocuments] = useState<Document[]>(structuredClone(examples[0].documents));
  const [result, setResult] = useState<ReturnType<typeof simulate> | null>(null);
  const [error, setError] = useState('');
  const fixture = matchExample(question, documents);
  const validation = validateInput(question, documents);

  function loadExample(id: RetrievalState) {
    const example = examples.find(e => e.id === id)!;
    setSelected(id); setQuestion(example.question); setDocuments(structuredClone(example.documents)); setResult(null); setError('');
  }
  function editDoc(index: number, key: keyof Document, value: string) {
    setDocuments(docs => docs.map((doc, i) => i === index ? { ...doc, [key]: value } : doc)); setResult(null); setError('');
  }
  function run(compare: boolean) {
    try { setResult(simulate(question, documents, compare)); setError(''); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to run the walkthrough.'); }
  }
  return <section className="section demo-section" id="demo"><div className="section-top"><div><span className="section-number">02 / INTERACTIVE WALKTHROUGH</span><h2>Follow the evidence.</h2></div><span className="status-pill"><span /> Example simulation</span></div>
    <p className="section-description">Explore how each retrieval state changes the path from question to answer.</p>
    <div className="demo-notice"><FlaskConical size={18} /><p><strong>A walkthrough, not live inference.</strong> These fictional examples have scripted outcomes. No models run, no remote calls are made, and your inputs stay in this browser.</p></div>
    <div className="demo-workspace"><div className="input-panel"><div className="panel-heading"><span><span className="panel-index">A</span> Question & evidence</span><button className="text-button" onClick={() => loadExample(selected)}><RotateCcw size={13} /> Reset</button></div>
      <div className="example-tabs" role="group" aria-label="Choose an example">{examples.map(e => <button key={e.id} onClick={() => loadExample(e.id)} className={selected === e.id ? 'active' : ''} aria-pressed={selected === e.id}><span className={`example-dot ${e.id}`} />{e.label}</button>)}</div>
      <label className="field-label" htmlFor="question">QUESTION</label><textarea id="question" className="question-input" value={question} maxLength={2000} rows={2} onChange={e => { setQuestion(e.target.value); setResult(null); setError(''); }} />
      <div className="documents-heading"><span className="field-label">RETRIEVED DOCUMENTS <span>({documents.length}/5)</span></span><span>In displayed order</span></div>
      <div className="documents">{documents.map((doc, i) => <div className="document-editor" key={i}><div className="document-toolbar"><FileText size={13} /><input aria-label={`Document ${i + 1} ID`} value={doc.id} maxLength={64} onChange={e => editDoc(i, 'id', e.target.value)} /><button className="icon-button" disabled={documents.length === 1} aria-label={`Remove document ${i + 1}`} onClick={() => { setDocuments(docs => docs.filter((_, index) => index !== i)); setResult(null); setError(''); }}><X size={14} /></button></div><textarea aria-label={`Document ${i + 1} text`} rows={3} maxLength={12000} value={doc.text} onChange={e => editDoc(i, 'text', e.target.value)} /></div>)}</div>
      <button className="add-document" disabled={documents.length >= 5} onClick={() => { const id = `doc-${Date.now()}`; setDocuments(docs => [...docs, { id, text: '' }]); setResult(null); setError(''); }}><Plus size={14} /> Add document</button>
      <p className="token-note">4096-token Sieve limit includes question, documents, and special tokens. Token count and truncation require the real tokenizer; neither is simulated here.</p>
      {!fixture && <p className="custom-notice" role="status">{validation || 'Custom input is ready to edit. Live inference is not connected; restore an example to run the walkthrough.'}</p>}
      <div className="demo-actions"><button className="button primary" disabled={!fixture || !!validation} onClick={() => run(false)}>Run example <ArrowRight size={16} /></button><button className="button secondary" disabled={!fixture || !!validation} onClick={() => run(true)}>Compare paths</button></div>
      <p className="cost-note">In live comparison, the baseline would call Sage even when Sieve abstains. This simulation incurs no cost.</p>
      {error && <p className="error" role="alert">{error}</p>}
    </div><div className="output-panel"><div className="panel-heading"><span><span className="panel-index">B</span> Decision trace</span><span className="micro-label">SIMULATED</span></div>
      <div className="trace" aria-live="polite"><div className={`trace-step ${result ? 'done' : ''}`}><span className="trace-icon"><Filter size={19} /></span><div><span className="micro-label">STAGE 01</span><h4>Sieve screens the evidence</h4><p>{result ? result.sieveDecision === 'pass' ? 'Pass → continue to Sage' : 'Distracted → early abstention' : 'The document set is checked for distraction.'}</p></div>{result && <Check size={16} />}</div>
      <div className={`trace-step ${result?.sageCalls ? 'done' : ''} ${result && !result.sageCalls ? 'skipped' : ''}`}><span className="trace-icon"><Sparkles size={19} /></span><div><span className="micro-label">STAGE 02</span><h4>Sage checks for an answer</h4><p>{result ? result.sageCalls ? 'Simulated generation step' : 'Skipped · no Sage call on this path' : 'Only invoked if the set passes Sieve.'}</p></div></div>
      <div className={`answer-box ${result ? 'has-result' : ''}`}><span className="micro-label">{result ? 'ILLUSTRATIVE OUTCOME' : 'FINAL RESPONSE'}</span>{result ? <><h3>{result.example.answer || 'Abstain'}</h3><p>{result.example.explanation}</p></> : <><h3>Evidence before answers.</h3><p>Select a retrieval state and run the example to see the decision path.</p><ArrowDown size={24} strokeWidth={1} /></>}</div>
      {result?.compare && <div className="comparison"><h4>Sage-only path comparison</h4><p>Same question and documents; Sieve is bypassed. This is an illustrative call-count comparison, not a reproduced paper baseline.</p><div><span>Sieve and Sage <strong>{result.sageCalls} Sage {result.sageCalls === 1 ? 'call' : 'calls'}</strong></span><span>Sage-only <strong>{result.baselineCalls} Sage call</strong></span></div><p className="fine-print">Baseline answer: not generated. Exact baseline prompt and checkpoint parity must be confirmed before live comparison.</p></div>}
      <dl className="telemetry"><div><dt>Sage calls on this path</dt><dd>{result ? `${result.sageCalls} (simulated)` : '—'}</dd></div><div><dt>Actual remote calls</dt><dd>0</dd></div><div><dt>Sieve model score</dt><dd>Not computed</dd></div><div><dt>Sieve / worker / total time</dt><dd>Not measured</dd></div></dl>
      <p className="fine-print score-note">A Sieve score is a classifier output, not a calibrated probability that an answer is correct.</p></div>
    </div></div>
    <details className="model-details"><summary><ShieldCheck size={16} /> Model configuration & implementation status <Plus size={15} /></summary><div className="model-details-content"><div><h4>Research configuration found</h4><p><strong>Sieve</strong><code>SKIML-ICL/longformer-base-4096-conflict_classification-smaller-classifier</code>Revision and numeric label mapping need checkpoint verification. Code default: pass when softmax P(answerable) ≥ 0.5.</p><p><strong>Sage</strong><code>meta-llama/Meta-Llama-3-8B-Instruct</code>With the unanswerable-QA LoRA adapter; revision <code>d6aab51469bb73801a15d020a7469b87c36c2a09</code>. Research config uses 10 new tokens and greedy generation.</p></div><div><h4>What runs on this page?</h4><p>No model is loaded. The three example outcomes are manually authored teaching fixtures. Editing the input clears the result and disables simulation until an exact supplied example is restored.</p><p>The paper describes an early exit. The inspected evaluation code runs Sage on all examples and then overlays Sieve labels. Runtime gating still needs a separate, verified wrapper.</p><a href={`${import.meta.env.BASE_URL}implementation-audit.md`} target="_blank" rel="noreferrer">Read the source audit <ArrowUpRight size={13} /></a></div></div></details>
  </section>;
}

function KeyResults() {
  return <section className="key-results-band" id="results"><div className="section key-results-section">
    <div className="section-top"><div><span className="section-number">01 / KEY RESULTS</span><h2>Accuracy and efficiency.</h2></div><a className="text-link" href="#benchmarks">Explore all benchmarks <ArrowRight size={15} /></a></div>
    <p className="section-description">Five general-domain and three expert-domain QA benchmarks. A lightweight filter improves the trade-off between reliable abstention and inference cost.</p>
    <ResearchFigure figure={figures.pareto} className="pareto-figure" />
    <div className="key-results-notes"><p><strong>More reliable abstention.</strong> Up to +69.4 percentage points in system accuracy and +55.2 points in Macro-F1 over vanilla LLM.</p><p><strong>Less unnecessary inference.</strong> Up to 1.99× speedup over DTA-chatQA. These are paper-reported maxima; performance varies by dataset.</p></div>
    <a className="demo-jump" href="#demo">See how the two stages work <ArrowDown size={17} /></a>
  </div></section>;
}

function Results() {
  const [dataset, setDataset] = useState('NQ-google');
  const [metric, setMetric] = useState(0);
  const current = results.find(r => r.dataset === dataset)!;
  const metricNames = ['System accuracy', 'Macro-F1', 'Latency (ms)'];
  const max = metric === 2 ? Math.max(...current.values.map(v => v[2])) * 1.1 : 1;
  return <section className="results-band" id="benchmarks"><div className="section results-section"><div className="section-top"><div><span className="section-number">05 / DETAILED RESULTS</span><h2>Benchmark explorer.</h2></div><a className="text-link" href={`${import.meta.env.BASE_URL}results.csv`} download><Download size={15} /> Download data</a></div><p className="section-description">Five general-domain and three expert-domain QA benchmarks. System accuracy, Macro-F1, and inference latency.</p>
    <div className="evaluation-strip"><div><span>DATASETS</span><p>NQ-google · NQ-wiki · WebQ · RealtimeQA · RAG-Bench · MedQA · BioASQ · AstroQA</p></div><div><span>BASELINES</span><p>Vanilla LLM · Sage-only · DTA-chatQA · DTA-RAAT</p></div></div>

    <div className="results-controls"><div className="dataset-select"><label htmlFor="dataset">DATASET</label><select id="dataset" value={dataset} onChange={e => setDataset(e.target.value)}>{results.map(r => <option key={r.dataset} value={r.dataset}>{r.dataset} · {r.domain}</option>)}</select></div><div className="metric-tabs" role="group" aria-label="Chart metric">{metricNames.map((name, i) => <button key={name} className={metric === i ? 'active' : ''} aria-pressed={metric === i} onClick={() => setMetric(i)}>{name}</button>)}</div></div>
    <div className="results-content"><div className="chart"><div className="chart-heading"><h3>{metricNames[metric]}</h3><span>{metric === 2 ? 'Lower is better ↓' : 'Higher is better ↑'}</span></div><div className="bars">{modelNames.map((name, i) => <div className={`bar-row ${i === 4 ? 'ours' : ''}`} key={name}><span className="bar-label">{name}{i === 4 && <span>OURS</span>}</span><div className="bar-track"><div className="bar-fill" style={{ '--width': `${current.values[i][metric] / max * 100}%` } as CSSProperties} /></div><strong>{current.values[i][metric].toFixed(metric === 2 ? 1 : 3)}</strong></div>)}</div><div className="chart-axis"><span>0</span><span>{metric === 2 ? `${Math.ceil(max)} ms` : '1.0'}</span></div></div>
    <aside className="results-reading"><BookOpen size={22} strokeWidth={1.4} /><h3>Keep the tradeoffs in view.</h3><p>The framework is designed to trade unnecessary generation for reliable abstention. The size of the benefit depends on the retrieval state and domain.</p><p>Sieve and Sage does not lead every metric on every dataset. For example, Sage-only has higher system accuracy on NQ-wiki, while DTA-chatQA has higher system accuracy on BioASQ.</p><a className="text-link" href={PAPER_URL} target="_blank" rel="noreferrer">See the paper <ArrowUpRight size={14} /></a></aside></div>
    <details className="results-table"><summary>View exact values for {dataset} <Plus size={15} /></summary><div className="table-scroll"><table><caption>Table 15 · {dataset} · paper-reported results</caption><thead><tr><th>Method</th><th>System accuracy</th><th>Macro-F1</th><th>Latency (ms)</th></tr></thead><tbody>{modelNames.map((name, i) => <tr key={name}><th scope="row">{name}</th>{current.values[i].map((value, j) => <td key={j}>{value.toFixed(3)}</td>)}</tr>)}</tbody></table></div></details>
    <p className="fine-print">Source: supplied manuscript, Table 15. System accuracy is the paper’s ternary system-level metric. Research latency uses the paper’s evaluation setup; it excludes the network and serverless overhead of a future deployment. No demo latency has been measured.</p>
  </div></section>;
}

function Analysis() {
  return <section className="section analysis-section" id="analysis">
    <div className="section-top"><div><span className="section-number">06 / COMPONENT ANALYSIS</span><h2>Why the separation matters.</h2></div><a className="text-link" href={POSTER_URL} target="_blank" rel="noreferrer">View the original poster <ArrowUpRight size={15} /></a></div>
    <div className="analysis-grid"><article><span className="figure-overline">SPECIALIZATION</span><h3>Fine-tuning both stages.</h3><p>Fine-tuning Sage or Sieve alone does not yield the best performance in the two datasets shown. Separating distraction detection from grounded answering and abstention gives the strongest results in this component study.</p><ResearchFigure figure={figures.components} /></article><article><span className="figure-overline">REPRESENTATION</span><h3>Why binary training for Sieve?</h3><p>The t-SNE plot shows clearer separation of distracting cases than three-way training, including unseen negated and adversarial examples.</p><ResearchFigure figure={figures.binary} /></article></div>
    <div className="recovery-section"><div><span className="section-number">BEYOND ABSTENTION</span><h3>State-aware<br />follow-up strategies.</h3><p>Target the cause of abstention, rather than treating every abstention the same way.</p><ul><li><strong>Missing evidence</strong><span>Re-retrieve to look for sufficient support.</span></li><li><strong>Distracting evidence</strong><span>Investigate and filter the source of distraction.</span></li><li><strong>Human or agent assistance</strong><span>Bring additional judgment into the recovery process.</span></li></ul><p className="fine-print">Research directions and experiments from the poster. Recovery is not available in the demo.</p></div><ResearchFigure figure={figures.recovery} /></div>
  </section>;
}

function Outlook() {
  return <div className="outlook-band"><section className="section outlook-section"><span className="section-number">CONCLUSION & FUTURE WORK</span><h2>Recognize the failure.<br />Choose the next step.</h2><p className="outlook-summary">Sieve detects distractions early, while Sage answers or abstains when evidence is missing. State-specific abstention can guide targeted follow-up actions.</p><div className="outlook-list"><div><span>01</span><p>Validate the framework on naturally occurring retrieval failures beyond simulated noise.</p></div><div><span>02</span><p>Reduce the need for labeled target-domain examples.</p></div><div><span>03</span><p>Calibrate abstention to reduce incorrect answers without unnecessarily sacrificing coverage.</p></div></div></section></div>;
}

function Citation() {
  const [copyStatus, setCopyStatus] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(citation); setCopyStatus('Copied'); }
    catch { setCopyStatus('Copy unavailable. Select the citation below.'); }
  }
  return <section className="section citation-section" id="citation"><div><span className="section-number">07 / PAPER & RESOURCES</span><h2>Build on this work.</h2><p>If you find this work useful, please cite our paper.</p><a className="poster-download" href={POSTER_URL} target="_blank" rel="noreferrer"><FileText size={24} /><span><strong>EMNLP 2026 poster</strong><small>Original A0 poster · PDF</small></span><ArrowUpRight size={18} /></a><a className="text-link" href="mailto:jongbinwon@snu.ac.kr">Get in touch <ArrowUpRight size={14} /></a></div><div className="citation-box"><div><span className="micro-label">BIBTEX</span><button className="text-button" onClick={copy}>{copyStatus === 'Copied' ? <Check size={14} /> : <Copy size={14} />} Copy citation</button></div><pre tabIndex={0}>{citation}</pre><span className="copy-status" role="status">{copyStatus}</span></div></section>;
}

export default function App() {
  return <><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main"><div className="page-width"><Hero /><Highlights /></div><KeyResults /><Demo /><Overview /><Method /><Results /><Analysis /><Outlook /><Citation /></main><footer><div><a className="brand" href="#home"><Mark small /><span>Sieve <i>&</i> Sage</span></a><p>Efficient distraction filtering. Reliable abstention.</p><div><a href={PAPER_URL} target="_blank" rel="noreferrer">Paper <ArrowUpRight size={12} /></a><a href={POSTER_URL} target="_blank" rel="noreferrer">Poster <ArrowUpRight size={12} /></a><a href={CODE_URL} target="_blank" rel="noreferrer">Code <ArrowUpRight size={12} /></a><a href="#home">Back to top <ChevronRight size={12} /></a></div></div><span>Seoul National University · Graduate School of Data Science</span></footer></>;
}

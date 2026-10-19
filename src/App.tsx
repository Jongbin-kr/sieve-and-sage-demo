import { useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCheck, ChevronRight, CircleHelp, Copy, Download, FileText, Filter, FlaskConical, Github, Menu, Plus, RotateCcw, ShieldCheck, Sparkles, Square, X } from 'lucide-react';
import { CODE_URL, PAPER_URL, citation, examples, modelNames, results, type Document, type RetrievalState } from './data';
import { matchExample, simulate, validateInput } from './simulation';

function Mark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark ${small ? 'small' : ''}`} aria-hidden="true"><Filter strokeWidth={1.4} /></span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="nav-wrap">
    <a className="brand" href="#home" aria-label="Sieve and Sage home"><Mark small /><span>Sieve <i>&</i> Sage</span></a>
    <button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="navigation" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    <nav id="navigation" className={open ? 'open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}>
      <a href="#overview">Overview</a><a href="#method">Method</a><a href="#results">Results</a><a href="#demo">Interactive demo <span className="nav-dot" /></a>
    </nav>
    <a className="nav-code" href={CODE_URL} target="_blank" rel="noreferrer"><Github size={17} /> Code <ArrowUpRight size={14} /></a>
  </div></header>;
}

function HeroArt() {
  return <div className="hero-art" role="img" aria-label="A set of retrieved documents enters Sieve. Distracting sets lead to early abstention. Otherwise Sage answers or abstains based on evidence.">
    <div className="art-top"><span>THE TWO-STAGE FRAMEWORK</span><span>Fig. 01 / Concept</span></div>
    <div className="art-documents"><div className="paper-sheet back" /><div className="paper-sheet middle" /><div className="paper-sheet front"><span className="doc-caption">Retrieved evidence</span><span /><span /><span className="red-line" /><span /><span className="short-line" /></div><span className="art-label">Question + documents</span></div>
    <div className="art-connector first"><span /><ArrowDown size={17} /></div>
    <div className="art-sieve"><div className="sieve-mesh">{Array.from({ length: 32 }, (_, i) => <span key={i} />)}</div><div><strong>Sieve</strong><small>Screen for distraction</small></div><Filter size={29} strokeWidth={1.1} /></div>
    <div className="art-branch"><div className="pass-branch"><ArrowDown size={17} /><span>Pass</span></div><div className="stop-branch"><span className="branch-line" /><span className="stop-tag"><Square size={10} fill="currentColor" /> Early abstention</span></div></div>
    <div className="art-sage"><Sparkles size={34} strokeWidth={1} /><div><strong>Sage</strong><small>Reason over the evidence</small></div><span className="sage-sun" aria-hidden="true">✳</span></div>
    <div className="art-connector last"><ArrowDown size={17} /></div>
    <div className="art-outcomes"><span><Check size={14} /> Grounded answer</span><i>or</i><span>Abstention</span></div>
    <p className="art-note">A little filtering. A more thoughtful answer.</p>
  </div>;
}

function Hero() {
  return <section className="hero" id="home"><div className="hero-copy">
    <div className="eyebrow"><span className="tiny-star">✳</span> RETRIEVAL-AUGMENTED GENERATION</div>
    <h1>Sieve <em>&</em> Sage<span className="title-period">.</span></h1>
    <h2>Efficient Distraction Filtering<br />for Reliable RALM Abstention</h2>
    <p className="hero-description">Knowing when to answer starts with knowing<br className="desktop-break" /> what to trust.</p>
    <p className="hero-detail">A lightweight filter meets a grounded language model.<br className="desktop-break" /> Together, they learn when to answer—and when to abstain.</p>
    <div className="hero-actions"><a className="button primary" href={PAPER_URL} target="_blank" rel="noreferrer"><FileText size={17} /> Read the paper <ArrowUpRight size={15} /></a><a className="button secondary" href="#demo">Explore the demo <ArrowRight size={17} /></a></div>
    <div className="authors"><span>Jongbin Won</span><span>Sung Geun An</span><span>Jay-Yoon Lee<sup>*</sup></span></div>
    <p className="affiliation">Graduate School of Data Science · Seoul National University</p>
    <a className="paper-id" href={PAPER_URL} target="_blank" rel="noreferrer">arXiv:2609.35794 <ArrowUpRight size={12} /></a>
  </div><HeroArt /></section>;
}

function Highlights() {
  return <div className="highlights">
    <div className="highlights-intro"><span className="eyebrow">AT A GLANCE</span><p>More reliable answers.<br />Less unnecessary inference.</p></div>
    <div className="stat"><strong>+69.4<span>pp</span></strong><span>System accuracy</span><small>Best gain vs. vanilla LLM</small></div>
    <div className="stat"><strong>+55.2<span>pp</span></strong><span>Macro-F1</span><small>Best gain vs. vanilla LLM</small></div>
    <div className="stat"><strong>1.99<span>×</span></strong><span>Inference speedup</span><small>Best speedup vs. DTA-chatQA</small></div>
    <p className="stats-note">Paper-reported maxima; improvements vary by dataset. These are research results, not measurements of this demo. <a href="#results">Explore all results <ArrowRight size={12} /></a></p>
  </div>;
}

function Overview() {
  return <section className="section overview" id="overview"><div className="section-heading"><span className="section-number">01 / THE IDEA</span><h2>Not all missing answers<br />have the same cause.</h2></div>
    <div className="overview-text"><p>Retrieved evidence can be incomplete. It can also be misleading. Asking a single language model to recognize both problems and answer the question makes reliable abstention difficult.</p><p>We separate these responsibilities. <strong>Sieve</strong> screens the document set for distracting evidence. <strong>Sage</strong> handles grounded generation and abstains when the evidence is insufficient.</p></div>
    <div className="states"><article><div className="state-icon answerable"><CheckCheck /></div><span className="micro-label">STATE 01</span><h3>Answerable</h3><p>Supporting evidence is present, without distracting evidence.</p><span className="state-outcome">Sieve passes → Sage answers</span></article><article><div className="state-icon unanswerable"><CircleHelp /></div><span className="micro-label">STATE 02</span><h3>Unanswerable</h3><p>The retrieved documents do not contain the evidence needed to answer.</p><span className="state-outcome">Sieve passes → Sage abstains</span></article><article><div className="state-icon distracted"><Filter /></div><span className="micro-label">STATE 03</span><h3>Distracted</h3><p>Supporting evidence coexists with conflicting, negated, or adversarial information.</p><span className="state-outcome">Sieve abstains → Sage is skipped</span></article></div>
    <p className="fine-print">These are the intended paths. Model decisions can be incorrect; a Sieve pass does not certify that an answer is supported.</p>
  </section>;
}

function Method() {
  return <section className="method-band" id="method"><div className="section method"><div className="method-intro"><span className="section-number">02 / THE METHOD</span><h2>Filter first.<br /><em>Reason when needed.</em></h2><p>Two specialized stages, with an early exit before expensive generation.</p><a className="text-link" href={PAPER_URL} target="_blank" rel="noreferrer">Dive into the methodology <ArrowUpRight size={15} /></a></div>
    <div className="method-steps"><article><span className="step-number">01</span><div><h3>Sieve <span>The lightweight gate</span></h3><p>A Longformer-based binary classifier screens the question and retrieved document set. A distracted decision triggers abstention for the entire set.</p><div className="method-chips"><span>Longformer-base-4096</span><span>Set-level classification</span></div></div></article><article><span className="step-number">02</span><div><h3>Sage <span>The grounded generator</span></h3><p>For inputs that pass, a fine-tuned language model returns a grounded answer or abstains if the documents do not contain enough evidence.</p><div className="method-chips"><span>Llama 3 8B + LoRA*</span><span>Answer or abstain</span></div></div></article>
    <p className="method-footnote">* General-domain configuration found in the research repository. Domain-specific variants are also studied. Sieve does not identify or remove individual documents.</p></div></div></section>;
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
  return <section className="section demo-section" id="demo"><div className="section-top"><div><span className="section-number">03 / TRY THE FRAMEWORK</span><h2>Follow the evidence.</h2></div><span className="status-pill"><span /> Example simulation</span></div>
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

function Results() {
  const [dataset, setDataset] = useState('NQ-google');
  const [metric, setMetric] = useState(0);
  const current = results.find(r => r.dataset === dataset)!;
  const metricNames = ['System accuracy', 'Macro-F1', 'Latency (ms)'];
  const max = metric === 2 ? Math.max(...current.values.map(v => v[2])) * 1.1 : 1;
  return <section className="results-band" id="results"><div className="section results-section"><div className="section-top"><div><span className="section-number">04 / THE EVIDENCE</span><h2>Reliability, with perspective.</h2></div><a className="text-link" href={`${import.meta.env.BASE_URL}results.csv`} download><Download size={15} /> Download data</a></div><p className="section-description">Eight benchmarks across general and expert domains. Explore the gains—and the tradeoffs.</p>
    <div className="results-controls"><div className="dataset-select"><label htmlFor="dataset">DATASET</label><select id="dataset" value={dataset} onChange={e => setDataset(e.target.value)}>{results.map(r => <option key={r.dataset} value={r.dataset}>{r.dataset} · {r.domain}</option>)}</select></div><div className="metric-tabs" role="group" aria-label="Chart metric">{metricNames.map((name, i) => <button key={name} className={metric === i ? 'active' : ''} aria-pressed={metric === i} onClick={() => setMetric(i)}>{name}</button>)}</div></div>
    <div className="results-content"><div className="chart"><div className="chart-heading"><h3>{metricNames[metric]}</h3><span>{metric === 2 ? 'Lower is better ↓' : 'Higher is better ↑'}</span></div><div className="bars">{modelNames.map((name, i) => <div className={`bar-row ${i === 4 ? 'ours' : ''}`} key={name}><span className="bar-label">{name}{i === 4 && <span>OURS</span>}</span><div className="bar-track"><div className="bar-fill" style={{ '--width': `${current.values[i][metric] / max * 100}%` } as CSSProperties} /></div><strong>{current.values[i][metric].toFixed(metric === 2 ? 1 : 3)}</strong></div>)}</div><div className="chart-axis"><span>0</span><span>{metric === 2 ? `${Math.ceil(max)} ms` : '1.0'}</span></div></div>
    <aside className="results-reading"><BookOpen size={22} strokeWidth={1.4} /><h3>Read the whole picture.</h3><p>The framework is designed to trade unnecessary generation for reliable abstention. The size of the benefit depends on the retrieval state and domain.</p><p>Sieve and Sage does not lead every metric on every dataset. For example, Sage-only has higher system accuracy on NQ-wiki, while DTA-chatQA has higher system accuracy on BioASQ.</p><a className="text-link" href={PAPER_URL} target="_blank" rel="noreferrer">See the paper <ArrowUpRight size={14} /></a></aside></div>
    <details className="results-table"><summary>View exact values for {dataset} <Plus size={15} /></summary><div className="table-scroll"><table><caption>Table 15 · {dataset} · paper-reported results</caption><thead><tr><th>Method</th><th>System accuracy</th><th>Macro-F1</th><th>Latency (ms)</th></tr></thead><tbody>{modelNames.map((name, i) => <tr key={name}><th scope="row">{name}</th>{current.values[i].map((value, j) => <td key={j}>{value.toFixed(3)}</td>)}</tr>)}</tbody></table></div></details>
    <p className="fine-print">Source: supplied manuscript, Table 15. System accuracy is the paper’s ternary system-level metric. Research latency uses the paper’s evaluation setup; it excludes the network and serverless overhead of a future deployment. No demo latency has been measured.</p>
  </div></section>;
}

function Citation() {
  const [copyStatus, setCopyStatus] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(citation); setCopyStatus('Copied'); }
    catch { setCopyStatus('Copy unavailable. Select the citation below.'); }
  }
  return <section className="section citation-section" id="citation"><div><span className="section-number">05 / BUILD ON THIS WORK</span><h2>A more thoughtful<br />way to answer.</h2><p>If you find this work useful, please cite our paper.</p><a className="text-link" href="mailto:jongbinwon@snu.ac.kr">Get in touch <ArrowUpRight size={14} /></a></div><div className="citation-box"><div><span className="micro-label">BIBTEX</span><button className="text-button" onClick={copy}>{copyStatus === 'Copied' ? <Check size={14} /> : <Copy size={14} />} Copy citation</button></div><pre tabIndex={0}>{citation}</pre><span className="copy-status" role="status">{copyStatus}</span></div></section>;
}

export default function App() {
  return <><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main"><div className="page-width"><Hero /><Highlights /></div><Overview /><Method /><Demo /><Results /><Citation /></main><footer><div><a className="brand" href="#home"><Mark small /><span>Sieve <i>&</i> Sage</span></a><p>Evidence first. Answers second.</p><div><a href={PAPER_URL} target="_blank" rel="noreferrer">Paper <ArrowUpRight size={12} /></a><a href={CODE_URL} target="_blank" rel="noreferrer">Code <ArrowUpRight size={12} /></a><a href="#home">Back to top <ChevronRight size={12} /></a></div></div><span>Seoul National University · Graduate School of Data Science</span></footer></>;
}

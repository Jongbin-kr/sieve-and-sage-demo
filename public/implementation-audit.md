# Sieve and Sage: source audit

Audit date: 2026-10-19. This is a **static frontend release**, not a reproduced inference service.

Sources: the supplied `paper.md` and `poster.md`, and local research checkout
`Sieve-and-Sage` at commit `7c03d99aa8cfb3d97bf62888462e349e21b80adf`.
Paper: https://arxiv.org/abs/2609.35794. Research repository:
https://github.com/Jongbin-kr/Sieve-and-Sage.

## Confirmed from source

| Item | Finding | Source |
| --- | --- | --- |
| General-domain Sieve | `SKIML-ICL/longformer-base-4096-conflict_classification-smaller-classifier` | `experiments/paper/0729_system/NQ-Llama/2stage-prefilter.json` |
| Architecture | `AutoModelForSequenceClassification`, fine-tuned from Longformer; inference tokenizer is loaded from the classifier model ID | `llm.py:454–457`, `train_smaller_classifier.py:87–94` |
| Labels | Binary `answerable` / `conflict`; numeric indices come from checkpoint `label2id` and `id2label`, not fixed constants. Training constructs labels with a Python set, so their numeric order must never be assumed. | `llm.py:525–530`, `train_smaller_classifier.py:75–78` |
| Classifier input | Extract user content from messages; remove `\nLabel:\s*\w*`. The content contains `####\nDocuments:\n`, each document prefixed by `- `, then `\nQuestion: ...`. First question character becomes lowercase and `?` is appended if absent. | `utils.py:769–790,897–900`, `prompts.py:39,340–355` |
| Document order | First `n_ctxs` records in supplied `ctxs` order; selected config uses 5. Dataset construction/augmentation can alter `ctxs` before prompt building. No document-ID text is added by the prompt formatter. | `prompts.py:342`, selected JSON, `utils.py` preprocessing |
| Truncation | One combined classifier string is tokenized with `padding=True`, `truncation=True`, `max_length=4096`; special tokens are not disabled. The research wrapper does not report pre-truncation length or retained content. | `llm.py:484–485` |
| Global attention | No explicit `global_attention_mask` is passed in the inspected classifier path. Effective automatic behavior must be verified against the deployed Transformers version and model class. | `llm.py:484–498` |
| Decision | Softmax over class logits; pass if `P(answerable) >= threshold`, otherwise `conflict`. CLI default 0.5; selected JSON does not override it. This is not calibrated answer correctness. | `llm.py:504,525–530`, `inference.py:234` |
| Sage base | `meta-llama/Meta-Llama-3-8B-Instruct` | selected JSON |
| Sage adapter | `SKIML-ICL/unanswerable-8.8k-Meta-Llama-3-8B-Instruct-QA-QU_-0Q-0U-0C-random-lora`, revision `d6aab51469bb73801a15d020a7469b87c36c2a09` | selected JSON |
| Sage loading | Transformers path loads base model in bfloat16, then `PeftModel.from_pretrained(..., revision=lora_revision)`. No quantization enabled in this path. | `llm.py:hf_completion` |
| Sage prompt | `unanswerable_qa`: answer from the documents; emit `unanswerable` if the answer is missing; request a single word or term. Zero demonstrations in selected config. Uses model tokenizer `apply_chat_template(..., add_generation_prompt=True, tokenize=False)` for test. | `prompts.py:49–55,301`, `llm.py:397` |
| Generation | Selected config: `max_new_tokens=10`. Current HF path: `do_sample=False`, left padding, EOS as padding, input truncation at 2048. The vLLM helper separately uses temperature 0 and max model length 2048. | selected JSON, `llm.py:hf_completion,vllm_completion` |
| Abstention parsing | Evaluator token-matches `unanswerable` or `I don't know`, then `conflict`, using `SimpleTokenizer` / `has_answer`; other strings are treated as answerable. This is evaluation parsing, not a new API response schema. | `evaluation.py:126–131` |

## Important paper/code difference

The paper describes **Sieve early abstention before invoking Sage**. In the inspected
`inference.py:111–179`, the classifier first predicts labels; the dataset is then
reloaded, Sage is run on the entire dataset, and classifier decisions overwrite
generated answers. The script computes a combined timing estimate afterward.
It does **not** prove that an actual Sage call was prevented for rejected inputs.

The website illustrates the paper's intended path, prominently labeled as a
simulation. A production wrapper must implement the real gate before submission,
then test classification parity and zero/one submission behavior independently.

## Still requires verification before live inference

1. Select the intended production Sieve checkpoint and immutable revision. Fetch
   its actual `config.json`, numeric label mapping, tokenizer files and revisions.
   Check checkpoint availability, access requirements and distribution rights.
2. Pin Sage base-model and tokenizer revisions in addition to the adapter revision.
   Verify adapter/base compatibility and exact chat serialization, including special
   token handling on the second tokenization pass. Verify the **2048**-token Sage
   input limit separately from Sieve's **4096**-token limit.
3. Confirm the selected experiment's effective threshold, dependency versions,
   document preprocessing and global attention behavior. Capture before/after
   token counts and the actual retained input if truncation occurs.
4. Choose the live baseline. The paper reports vanilla LLM, Sage-only, DTA-RAAT,
   and DTA-chatQA. They must not be treated as interchangeable. The website's
   explicit comparison illustrates only the call paths of a gate-bypassed Sage;
   it does not generate a baseline answer or claim a reproduced baseline result.
   Audit Sage-only's task, prompt, adapter and settings before same-checkpoint comparison.
5. Verify licenses and public-use conditions for models, adapters and datasets.
   No top-level research-code license was found in the checkout. The Llama base
   and any dataset have their own terms; no redistribution permission is assumed.
6. Reproduce original inference on agreed examples before deploying a GPU wrapper.
   No GPU inference, tokenizer run, calibration, memory profiling, latency benchmark,
   or Runpod/vLLM compatibility test was performed for this frontend release.

## Frontend behavior

- Three original, fictional Aster Observatory examples; no benchmark or private
  dataset content is republished. They are teaching examples, not model predictions.
- Exact question, document order, IDs and text must match a supplied fixture.
  Any change clears results. Arbitrary inputs are editable but cannot produce a
  scripted prediction. No heuristic classifier is substituted for Sieve.
- Scores are `Not computed`; timings are `Not measured`; revisions above are
  **research configuration**, not models used to run this page.
- Baseline and proposed-path illustrative counts are separate. Actual remote
  calls are always zero. A comparison is shown only after an explicit click.
- No individual document is identified or removed as distracting.
- Inputs exist only in React state: no persistence, logging, analytics or API
  submission. Google Fonts requests load typography, not input content.
- Displayed results come from the supplied manuscript's Table 15. The downloadable
  CSV was independently extracted from that local text and cross-checked against
  all 40 chart rows by a test. They are not new measurements and do not establish
  the performance of the future service.

## Release boundary

Included: React + TypeScript + Vite page, editable example walkthrough, paper
summary, exact result explorer, BibTeX, responsive layout, tests and Pages workflow.

Not implemented in this release: FastAPI, Docker/GPU service, job persistence,
Runpod worker, health/readiness checks, polling, live baseline, HTTPS API ingress,
rate/cost controls, or runtime measurement. These are the subsequent backend work,
not hidden or partially working frontend features.

# The collection guide runs on a closed world, with no language model

The Kiosk is an unattended machine in a museum with no internet access, so a hosted model was never available; an offline model was, and we rejected it. The guide instead resolves questions deterministically against a fixed corpus — 7 Plaids, 6 Scenes, 42 Exhibits, ~25 Tags, ~20 FAQ entries — using dictionary lookup for entities and weighted token overlap for intent, with edit distance as a fallback on entity lookup only.

The decisive argument was testability rather than answer quality. On an unattended kiosk what matters is the absence of embarrassing answers, not the best average one. A deterministic matcher can be pinned by a fixture of `question → expected destination` pairs that runs in CI, so every regression is caught before installation. It also cannot hallucinate about Frette's heritage or be talked into saying something off-brand.

## Considered options

- **Hosted model via a local proxy.** Rejected at the connectivity constraint, and it would have meant shipping a Node process holding an API key onto a machine nobody maintains — a new overnight failure mode with no operator to notice.
- **Quantized sentence embeddings in-browser (ONNX/WASM).** Genuinely offline and genuinely better at paraphrase. Rejected because its failures are only discoverable by trial, on a model that can't be debugged, in Italian, where small multilingual models are weak — and because ~40 MB plus a WASM runtime buys nothing testable.

## Consequences

The guide only answers questions whose shape someone anticipated. Unanticipated paraphrases — *"ce n'è uno che non dà nell'occhio?"* for Modernism Tortora — fall through to the tiered fallback. This is accepted, and the alias table is expected to grow from observed misses.

The UI must not call this "AI" (see the resting copy and labelling in `CONTEXT.md` terms). The label sets the yardstick visitors measure it against, and "guide to a collection of seven plaids" is one this design can meet.

# The Exhibit is the atomic destination

Every Plaid appears in every Scene, so "show me the Modernism Ambra" has seven-times-six answers, not one. Each of the 42 Exhibits carries a description that exists nowhere else — in `Fibra e Filato` the Ambra is about double-twisted yarn, in `Le Cromie` about amber on yellow, in `Alberghi` about reading distance from a lounge sofa. We therefore made the Exhibit — one Plaid seen through one Scene — the unit the guide navigates to. Navigating means opening a Scene's preview *and* focusing a card within it.

Addressing at Plaid granularity (7 destinations) or Scene granularity (6) would discard the axis that distinguishes the content, forcing the guide to answer coarser than the collection is written.

## Consequences

Plaid becomes a first-class entity. `plaids.ts` holds the 7 products with stable ids, captions, images and match aliases; `GridItemData` becomes `{ plaidId, description, tags }`. Previously identity was carried by the caption string `'Modernism — Ambra'` repeated 42 times, em-dash included — an edit in one Scene would have silently made a Plaid unreachable by name on a machine with no operator.

Answers routinely span Scenes: `verde ottanio` matches Exhibits in five, `deco` and `modernism` in all six. Since only one preview can be open at a time, the guide picks one Scene and offers the rest as chips. The choice is deterministic: prefer the Scene already open, else where the Tag is most concentrated, else the earliest. The first clause is what makes app-state-as-memory (ADR-0003) pay off — a visitor already inside a Scene stays there.

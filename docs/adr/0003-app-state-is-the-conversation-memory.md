# The app's visible state is the conversation memory

The guide keeps no dialogue buffer. Context for resolving a follow-up — *"e in verde?"* — comes from what is on screen: which Scene's preview is open, which Exhibit is focused, which Tag is active. Resolved state fills only the slots a query left empty; it never overrides something the visitor said.

This follows from the Kiosk showing no conversation history. A hidden buffer would mean the guide carries state the visitor cannot see, so when it misfires they have no way to understand why they were taken somewhere strange — the classic failure of scripted assistants, and worse on a machine where nobody can explain it. With app state as the memory, the context is on screen the whole time: the room didn't change, the plaid did, and the reasoning is self-evident.

## Consequences

Nothing expires and no TTL needs tuning. Context is cleared by the Idle Reset along with everything else, so a visitor never inherits a stranger's half-finished thought.

Conversational sequences that don't move the app cannot resolve. Two consecutive FAQ questions — *"chi è Tara Bernerd?"* then *"e con chi altro ha lavorato?"* — have no app state to lean on. Accepted: the FAQ corpus is ~20 flat entries rather than a dialogue tree, and each entry is written to stand alone.

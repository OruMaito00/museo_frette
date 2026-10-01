# Museo Frette

A museum kiosk presenting the Frette × Tara Bernerd plaid collection as a scrollable 3D exhibition. Runs offline on a single unattended machine; content is Italian, code and glossary are English.

## Language

### The collection

**Plaid**:
One of the seven physical throws in the collection. The same Plaid appears in every Scene.
_Avoid_: Product, item, blanket, throw

**Scene**:
A thematic lens through which the whole collection is retold — fibre, weave, colour, author, use, finish. There are six.
_Avoid_: Section, room, page, slide

**Exhibit**:
One Plaid as presented within one Scene: its caption, description and tags for that lens. Forty-two exist, and each holds text that appears nowhere else.
_Avoid_: Grid item, card, entry, tile

**Tag**:
A curatorial keyword attached to an Exhibit. Tag vocabulary is per-Scene, not global.
_Avoid_: Category, label, filter

### Addressing

A Plaid alone is not a navigable destination — it exists forty-two times over. A Scene alone is coarser than the content. **The Exhibit is the atomic destination**: to navigate is to open a Scene's preview *and* focus one Plaid's card within it.

### The kiosk

**Kiosk**:
The single unattended machine in the museum on which this runs. Offline, touchscreen, no operator, months of uptime between reloads.
_Avoid_: Installation, terminal, station

**Web Demo**:
The public, online, non-Kiosk presentation of the exhibition, for anyone with a browser. It carries the same collection but none of the Kiosk's unattended-machine behaviour.
_Avoid_: Production, deployment, live site

**Idle Reset**:
The return to a clean opening state after a visitor stops interacting — preview closed, Tag cleared, scroll at the top.
_Avoid_: Timeout, session end, logout

**Attract Mode**:
The ambient loop the Kiosk enters after an Idle Reset goes unanswered, whose purpose is to recruit a passing visitor. Any touch interrupts it.
_Avoid_: Screensaver, idle animation, demo mode

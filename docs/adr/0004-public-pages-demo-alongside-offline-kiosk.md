# A public Web Demo on GitHub Pages sits alongside the offline Kiosk

The exhibition is published as a Web Demo on GitHub Pages from a public repository. The Kiosk keeps running from its own offline build; the Web Demo is a showcase, not its runtime. One `dist/` serves both, which is why Vite uses a relative `base: './'` rather than the `/museo_frette/` prefix Pages would otherwise want.

This follows from wanting a shareable demo without adding a second host. Pages on a private repo needs a paid plan, and the alternatives (Netlify, Cloudflare Pages) would drop the GitHub-only deployment. A hardcoded Pages base path would have broken the offline Kiosk, which has no such prefix.

## Consequences

The repository is public, so the Frette product photography and the Italian exhibit copy are public too. Making it public is hard to reverse: forks and caches outlive a later flip back to private. Publishing was approved by the project owner.

CI gates the deploy: tests and the type-checked build must pass on `main` before Pages updates. The audit is not a gate, so a new unrelated advisory cannot block a release.

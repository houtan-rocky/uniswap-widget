# Specs

Design records for the `@uniswap-widget` monorepo. Each spec is a short, dated
decision record (Status / Context / Decision / Consequences).

> **Note:** ADRs 0001–0004 are dated records of the original single-package →
> monorepo work (when the widget was published as `react-uniswap`) and the
> *proposed* core decoupling. The core/React/Vue split has since shipped under
> the `@uniswap-widget/*` names; those historical references are left as-is.

| # | Spec | Status |
|---|------|--------|
| [0001](0001-monorepo-architecture.md) | Monorepo architecture | Accepted |
| [0002](0002-package-boundaries.md) | Package boundaries & public API | Accepted |
| [0003](0003-dependency-and-catalog-strategy.md) | Dependency & catalog strategy | Accepted |
| [0004](0004-core-deps-decoupling.md) | Core ↔ external-deps decoupling | **Proposed** (phase 2) |

## Reading order

Start at 0001 for the shape of the repo, then 0002 for what is/isn't part of
the published widget, then 0003 for how versions are managed. 0004 is the
forward-looking plan and is **not yet implemented**.

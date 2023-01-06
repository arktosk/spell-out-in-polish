# Spell Out amount in Polish

Typescript implementation of writing amount spelled out in Polish

## Usage

Script can be simply used as on bellowed example:

```typescript
import { spellOut } from "./spell-out";

const amount = 173.513;
const spelledOut = spellOut(173.513, { includeFraction: true }); // Result: "sto siedemdziesiąt trzy 51/100"
```

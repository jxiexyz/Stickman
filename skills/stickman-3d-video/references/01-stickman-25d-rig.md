# 01 — 2.5D Flat Vector Stickman Character Rig

Module: `src/characters/stickman-25d.js`

## Creating a Character Inside Any 3D Stage

```js
import { createStickman25D } from '../characters/stickman-25d.js';

const hero = createStickman25D({
  shirtColor: '#c2b39c',     // Hex color for capsule torso or hijabi dress
  headwear: 'cap',           // 'cap' | 'hijab' | 'peci' | 'bowl' | 'caping' | 'none'
  headwearColor: '#3b4c63',  // Applies to 'cap' and 'hijab'
  robeMode: false,           // true = tapered dress/gamis silhouette; false = pill torso + 3 buttons
  scale: 1.0,                // 0.78 for kids, 0.96 for crowd villagers, 1.0 for leads
});
this.root.add(hero.root);
```

## Available Expressions (`EXPRESSION_NAMES`)

| Expression | Visual Look | Best Story Moment |
|---|---|---|
| `neutral` | Flat eyes `- -`, calm line mouth | Routine action, working calmly |
| `deadpan` | Heavy flat brows + flat eyes | Suspicion, unimpressed stare |
| `confused` | Arched worried brows + wavy mouth | Questioning (*"kok dicat orang?"*) |
| `angry` | Sharp V brows + frown | Frustration, revenge action |
| `squint` | `> <` eyes + clenched teeth | Glare, cringe, awkward dilemma |
| `shock` | Wide white eyes + open O mouth | Sudden reveal / plot twist |
| `happy` | Dot eyes + gentle smile | Contentment, subtle pride |
| `smileBig` | `^ ^` eyes + open white grin | Big win, cheering crowd, smug payoff |
| `peaceful` | Soft brows + `^ ^` closed smile | Acceptance / resignation (*"ya udah"*) |
| `dizzy` | Spiral `@ @` eyes + wavy mouth | Exhaustion, defeated punchline |
| `sleep` | Closed U eyes + tiny O mouth | Asleep / dozing off |

## Posing & Arm Kinematics (Important Sign Convention)

Inside `evaluateBeat(beat, localTime, globalTime)`:

```js
hero.setExpression('confused');
hero.setNightBlend(night);                    // 0 = day, 1 = night
hero.setIcons({ q: true, bang: false, sweat: true });
hero.setPose({
  x: 0.2, y: 0, z: 0.75,
  ry: -0.2,                                   // Subtle artistic yaw offset
  bob: Math.abs(Math.sin(localTime * 8.5)) * 0.075, // Walking hop
  leftArmZ: 1.35,                             // Positive = swings OUTWARD LEFT (0.24 rest, 1.35 hold prop, 2.45 raise up)
  rightArmZ: -0.24,                           // Negative = swings OUTWARD RIGHT (-0.24 rest, -1.38 hold prop right)
  headTiltZ: 0.0,
  sit: false,                                 // true = hides standing stick legs for seated chair poses
  visible: true,
});
// Always call AFTER evaluateDioramaCamera so the 2.5D plane faces the camera smoothly on Y:
hero.faceCameraY(this.camera.position, -0.2 * 0.35);
```

## Adding New Headwear or Expressions

- **New Expression:** Add an `else if (expr === 'yourExpr')` block inside `drawFaceExpression2D()` in `src/characters/stickman-25d.js` and add its name to `EXPRESSION_NAMES`.
- **New Headwear:** Add an `else if (headwear === 'yourHat')` block inside `getStickmanHeadTexture()` (drawn on top of the 512×512 canvas with `#10141c` `lineWidth: 14–16` ink outlines) and add its ID to `HEADWEAR_TYPES`.
- **Floating Comic Sprites:** `createReactionSprite('HEHE')` renders crisp stroked comic text sprites you can attach to `hero.headGroup`.

---
description: Create detailed design specification based on requirements (Stage 2 of Spec-Driven Development)
---

# Design - 隧ｳ邏ｰ險ｭ險域嶌縺ｮ菴懈・

## Context

- Requirements document: Check `.tmp/requirements.md`

## Your task

### 1. Verify prerequisites

- Check that `.tmp/requirements.md` exists
- If not, inform user to run `#requirements` first

### 2. Analyze requirements

Read and understand the requirements document thoroughly

### 3. Create Design Document

Create `.tmp/design.md` with the following sections:

```markdown
# 隧ｳ邏ｰ險ｭ險域嶌 - [繧ｿ繧ｹ繧ｯ蜷江

## 1. 繧｢繝ｼ繧ｭ繝・け繝√Ε讎りｦ・

### 1.1 繧ｷ繧ｹ繝・Β讒区・蝗ｳ

[ASCII蝗ｳ繧Мermaid蝗ｳ縺ｧ繧ｷ繧ｹ繝・Β蜈ｨ菴薙・讒区・繧定｡ｨ迴ｾ]

### 1.2 謚陦薙せ繧ｿ繝・け

- 險隱・ [菴ｿ逕ｨ險隱槭→繝舌・繧ｸ繝ｧ繝ｳ]
- 繝輔Ξ繝ｼ繝繝ｯ繝ｼ繧ｯ: [菴ｿ逕ｨ繝輔Ξ繝ｼ繝繝ｯ繝ｼ繧ｯ]
- 繝ｩ繧､繝悶Λ繝ｪ: [荳ｻ隕√Λ繧､繝悶Λ繝ｪ荳隕ｧ]
- 繝・・繝ｫ: [繝薙Ν繝峨ヤ繝ｼ繝ｫ縲√ユ繧ｹ繝医ヤ繝ｼ繝ｫ縺ｪ縺ｩ]

## 2. 繧ｳ繝ｳ繝昴・繝阪Φ繝郁ｨｭ險・

### 2.1 繧ｳ繝ｳ繝昴・繝阪Φ繝井ｸ隕ｧ

| 繧ｳ繝ｳ繝昴・繝阪Φ繝亥錐 | 雋ｬ蜍・        | 萓晏ｭ倬未菫・                |
| ---------------- | ------------ | ------------------------ |
| [Component A]    | [雋ｬ蜍吶・隱ｬ譏讃 | [萓晏ｭ倥☆繧九さ繝ｳ繝昴・繝阪Φ繝・ |

### 2.2 蜷・さ繝ｳ繝昴・繝阪Φ繝医・隧ｳ邏ｰ

#### [Component A]

- **逶ｮ逧・*: [縺薙・繧ｳ繝ｳ繝昴・繝阪Φ繝医・逶ｮ逧Ь
- **蜈ｬ髢九う繝ｳ繧ｿ繝ｼ繝輔ぉ繝ｼ繧ｹ**:
  ```typescript
  interface ComponentA {
    method1(param: Type): ReturnType;
  }
  ```
- **蜀・Κ螳溯｣・婿驥・*: [螳溯｣・・繧｢繝励Ο繝ｼ繝‐

## 3. 繝・・繧ｿ繝輔Ο繝ｼ

### 3.1 繝・・繧ｿ繝輔Ο繝ｼ蝗ｳ

[繝・・繧ｿ縺ｮ豬√ｌ繧堤､ｺ縺吝峙]

### 3.2 繝・・繧ｿ螟画鋤

- 蜈･蜉帙ョ繝ｼ繧ｿ蠖｢蠑・ [蠖｢蠑上・隱ｬ譏讃
- 蜃ｦ逅・℃遞・ [螟画鋤繝ｭ繧ｸ繝・け]
- 蜃ｺ蜉帙ョ繝ｼ繧ｿ蠖｢蠑・ [蠖｢蠑上・隱ｬ譏讃

## 4. API繧､繝ｳ繧ｿ繝ｼ繝輔ぉ繝ｼ繧ｹ

### 4.1 蜀・ΚAPI

[繝｢繧ｸ繝･繝ｼ繝ｫ髢薙・繧､繝ｳ繧ｿ繝ｼ繝輔ぉ繝ｼ繧ｹ螳夂ｾｩ]

### 4.2 螟夜ΚAPI

[螟夜Κ繧ｷ繧ｹ繝・Β縺ｨ縺ｮ騾｣謳ｺ繧､繝ｳ繧ｿ繝ｼ繝輔ぉ繝ｼ繧ｹ]

## 5. 繧ｨ繝ｩ繝ｼ繝上Φ繝峨Μ繝ｳ繧ｰ

### 5.1 繧ｨ繝ｩ繝ｼ蛻・｡・

- [繧ｨ繝ｩ繝ｼ繧ｿ繧､繝・]: [蟇ｾ蜃ｦ譁ｹ豕評
- [繧ｨ繝ｩ繝ｼ繧ｿ繧､繝・]: [蟇ｾ蜃ｦ譁ｹ豕評

### 5.2 繧ｨ繝ｩ繝ｼ騾夂衍

[繧ｨ繝ｩ繝ｼ縺ｮ騾夂衍譁ｹ豕輔→繝ｭ繧ｰ謌ｦ逡･]

## 6. 繧ｻ繧ｭ繝･繝ｪ繝・ぅ險ｭ險・

### 6.1 隱崎ｨｼ繝ｻ隱榊庄

[蠢・ｦ√↓蠢懊§縺ｦ險倩ｼ云

### 6.2 繝・・繧ｿ菫晁ｭｷ

[讖溷ｯ・ョ繝ｼ繧ｿ縺ｮ謇ｱ縺・婿]

## 7. 繝・せ繝域姶逡･

### 7.1 蜊倅ｽ薙ユ繧ｹ繝・

- 繧ｫ繝舌Ξ繝・ず逶ｮ讓・ [%]
- 繝・せ繝医ヵ繝ｬ繝ｼ繝繝ｯ繝ｼ繧ｯ: [菴ｿ逕ｨ繝・・繝ｫ]

### 7.2 邨ｱ蜷医ユ繧ｹ繝・

[邨ｱ蜷医ユ繧ｹ繝医・繧｢繝励Ο繝ｼ繝‐

## 8. 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ譛驕ｩ蛹・

### 8.1 諠ｳ螳壹＆繧後ｋ雋闕ｷ

[繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ隕∽ｻｶ]

### 8.2 譛驕ｩ蛹匁婿驥・

[譛驕ｩ蛹悶・繧｢繝励Ο繝ｼ繝‐

## 9. 繝・・繝ｭ繧､繝｡繝ｳ繝・

### 9.1 繝・・繝ｭ繧､讒区・

[譛ｬ逡ｪ迺ｰ蠅・∈縺ｮ繝・・繝ｭ繧､譁ｹ豕評

### 9.2 險ｭ螳夂ｮ｡逅・

[迺ｰ蠅・､画焚縲∬ｨｭ螳壹ヵ繧｡繧､繝ｫ縺ｮ邂｡逅・

## 10. 螳溯｣・ｸ翫・豕ｨ諢丈ｺ矩・

- [豕ｨ諢冗せ1]
- [豕ｨ諢冗せ2]
```

### 4. Present to user

Show the created design document and ask for:
- Technical feedback
- Architecture approval
- Permission to proceed to task breakdown

## Important Notes

- Design should be implementable and testable
- Consider maintainability and extensibility
- Include concrete interface definitions where possible
- Address all requirements from the requirements document

Think hard and be thorough.

# Test Generator Prompt

縺薙・繧ｳ繝ｼ繝峨↓蟇ｾ縺吶ｋ繝・せ繝医こ繝ｼ繧ｹ繧堤函謌舌☆繧句ｮ壼梛繝励Ο繝ｳ繝励ヨ縲・

## 菴ｿ逕ｨ譁ｹ豕・

繧ｳ繝ｼ繝峨ｒ驕ｸ謚槭＠縺溽憾諷九〒 `#test-generator` 繧貞他縺ｳ蜃ｺ縺吶・

## 繝励Ο繝ｳ繝励ヨ

莉･荳九・繧ｳ繝ｼ繝峨↓蟇ｾ縺励※縲〃itest繧剃ｽｿ逕ｨ縺励◆繝・せ繝医こ繝ｼ繧ｹ繧剃ｽ懈・縺励※縺上□縺輔＞・・

### 隕∽ｻｶ

1. **豁｣蟶ｸ邉ｻ繝・せ繝・*: 譛溷ｾ・＆繧後ｋ蜈･蜉帙〒縺ｮ蜍穂ｽ懃｢ｺ隱・
2. **逡ｰ蟶ｸ邉ｻ繝・せ繝・*: 繧ｨ繝ｩ繝ｼ繝上Φ繝峨Μ繝ｳ繧ｰ縺ｮ遒ｺ隱・
3. **蠅・阜蛟､繝・せ繝・*: 繧ｨ繝・ず繧ｱ繝ｼ繧ｹ縺ｮ遒ｺ隱・
4. **繝｢繝・け**: 螟夜Κ萓晏ｭ倥・繝｢繝・け蛹・

### 蜃ｺ蜉帛ｽ｢蠑・

```typescript
import { describe, it, expect, vi } from 'vitest';
import { functionName } from './module';

describe('functionName', () => {
  // 豁｣蟶ｸ邉ｻ
  describe('豁｣蟶ｸ邉ｻ', () => {
    it('譛溷ｾ・＆繧後ｋ蜍穂ｽ懊ｒ隱ｬ譏・, () => {
      // Arrange
      // Act
      // Assert
    });
  });

  // 逡ｰ蟶ｸ邉ｻ
  describe('逡ｰ蟶ｸ邉ｻ', () => {
    it('繧ｨ繝ｩ繝ｼ譚｡莉ｶ繧定ｪｬ譏・, () => {
      // Arrange
      // Act & Assert
      expect(() => functionName(invalidInput)).toThrow();
    });
  });

  // 蠅・阜蛟､
  describe('蠅・阜蛟､', () => {
    it.each([
      { input: edge1, expected: result1 },
      { input: edge2, expected: result2 },
    ])('$input 縺ｮ蝣ｴ蜷・$expected 繧定ｿ斐☆', ({ input, expected }) => {
      expect(functionName(input)).toBe(expected);
    });
  });
});
```

### 繝√ぉ繝・け繝ｪ繧ｹ繝・

- [ ] 縺吶∋縺ｦ縺ｮ繝代ヶ繝ｪ繝・け繝｡繧ｽ繝・ラ縺後ユ繧ｹ繝医＆繧後※縺・ｋ
- [ ] 繧ｨ繝ｩ繝ｼ繧ｱ繝ｼ繧ｹ縺後き繝舌・縺輔ｌ縺ｦ縺・ｋ
- [ ] 蠅・阜蛟､縺後ユ繧ｹ繝医＆繧後※縺・ｋ
- [ ] 繝・せ繝医′迢ｬ遶九＠縺ｦ縺・ｋ・磯・ｺ丈ｾ晏ｭ倥↑縺暦ｼ・
- [ ] 繝｢繝・け縺碁←蛻・↓菴ｿ逕ｨ縺輔ｌ縺ｦ縺・ｋ

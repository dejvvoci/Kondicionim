import { slugify } from './slugify';

describe('slugify', () => {
  it('heq ë dhe ç', () => {
    expect(slugify('Çmimet dhe garancia')).toBe('cmimet-dhe-garancia');
    expect(slugify('Shërbimet në Lezhë')).toBe('sherbimet-ne-lezhe');
  });

  it('heq shenjat dhe vizat në skaje', () => {
    expect(slugify('  Pse nuk ftoh mirë?  ')).toBe('pse-nuk-ftoh-mire');
    expect(slugify('VRF/VRV për hotele')).toBe('vrf-vrv-per-hotele');
  });
});

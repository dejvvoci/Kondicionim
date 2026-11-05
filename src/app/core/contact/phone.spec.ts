import { formatPhone, telHref } from './phone';

describe('phone', () => {
  it('ndërton linkun tel: pa hapësira', () => {
    expect(telHref('+355 69 123 4567')).toBe('tel:+355691234567');
  });

  it('formaton numrin celular shqiptar', () => {
    expect(formatPhone('+355691234567')).toBe('+355 69 123 4567');
  });

  it('e lë të pandryshuar një numër që nuk njihet', () => {
    expect(formatPhone('+39 333 1234567')).toBe('+39 333 1234567');
  });
});

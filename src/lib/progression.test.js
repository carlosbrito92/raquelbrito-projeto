import { describe, it, expect } from 'vitest';
import { getExpected } from './progression';

describe('Cálculo de Progressão (getExpected)', () => {
  it('deve retornar 0 se a carga base for zero ou inválida', () => {
    expect(getExpected(0, 10, 1)).toBe(0);
    expect(getExpected(null, 10, 1)).toBe(0);
  });

  it('deve retornar a carga base exata na Semana 1', () => {
    expect(getExpected(100, 10, 1)).toBe(100);
  });

  it('deve aplicar a progressão exponencial na Semana 2', () => {
    // 100 * (1 + 0.10)^1 = 110
    expect(getExpected(100, 10, 2)).toBe(110);
  });

  it('deve aplicar a progressão exponencial na Semana 3', () => {
    // 100 * (1 + 0.10)^2 = 121
    expect(getExpected(100, 10, 3)).toBe(121);
  });

  it('deve aplicar o de-load de 75% na Semana 4', () => {
    // Semana 3 (121) * 0.75 = 90.75 -> arredondado para 90.8
    expect(getExpected(100, 10, 4)).toBe(90.8);
  });
});

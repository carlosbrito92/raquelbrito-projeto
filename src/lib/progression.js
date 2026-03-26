export function getExpected(base, rate, week) {
  if (!base || base <= 0) return 0;
  
  const r = rate / 100;
  
  if (week === 1) return base;
  
  // Semana 4 tem o de-load (75% da Semana 3)
  if (week === 4) {
    return Math.round(base * Math.pow(1 + r, 2) * 0.75 * 10) / 10;
  }
  
  // Demais semanas (progressão exponencial)
  return Math.round(base * Math.pow(1 + r, week - 1) * 10) / 10;
}

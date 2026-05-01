export const LOCATIONS = {
  "Farmacia": { x: 10, y: 10 },
  "Laboratorio": { x: 90, y: 10 },
  "Recepcao": { x: 50, y: 50 },
  "Quarto 101": { x: 10, y: 90 },
  "Quarto 102": { x: 30, y: 90 },
  "Quarto 103": { x: 50, y: 90 },
  "Estacao de Recarga": { x: 90, y: 90 }
};

export function findLocationKey(input) {
  if (!input) return null;
  const normalizedInput = input.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  return Object.keys(LOCATIONS).find(key => {
    const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedKey === normalizedInput;
  });
}

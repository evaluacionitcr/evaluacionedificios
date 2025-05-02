import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un valor monetario con separador de miles y dos decimales
 * @param value - El valor a formatear
 * @param currency - El símbolo de moneda a usar (₡ por defecto)
 * @returns Valor formateado como string (ej: ₡1.234,56)
 */
export function formatMoney(value: string | number | null, currency: string = "₡"): string {
  // Si el valor es nulo, undefined, cero o N/A, devolver 0 formateado
  if (!value || value === "0.00" || value === "0" || value === "N/A") {
    return `${currency}0,00`;
  }
  
  // Convertir a string si es número
  const valueStr = typeof value === 'number' ? value.toString() : value;
  
  // Convertir a número
  const numValue = parseFloat(valueStr.replace(/[^0-9.-]+/g, ""));
  
  // Formatear con separadores de miles y dos decimales (formato español)
  return `${currency}${numValue.toLocaleString('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

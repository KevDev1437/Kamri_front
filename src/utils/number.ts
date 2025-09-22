/**
 * Formate un nombre pour l'affichage
 * @param num - Le nombre à formater
 * @returns Le nombre formaté (ex: 1250 -> "1.2k")
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

/**
 * Formate un prix en euros
 * @param price - Le prix à formater
 * @returns Le prix formaté (ex: 29.99 -> "29,99 €")
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

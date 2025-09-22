import { useI18n } from 'vue-i18n'
import { useLocaleStore } from 'src/stores/locale'

export function useFormat() {
  const { t, n, d } = useI18n()
  const locale = useLocaleStore()

  const formatPrice = (amount: number, currency?: string) => {
    const target = currency || locale.currency
    return locale.priceFmt(amount, target)
  }

  const formatNumber = (x: number) => locale.numberFmt(x)
  const formatDate = (dt: string | number | Date) => locale.dateFmt(dt)

  return { t, n, d, formatPrice, formatNumber, formatDate }
}

export async function loadMessages(locale: 'fr' | 'en') {
  if (locale === 'en') {
    return (await import('./messages/en.json')).default
  }
  return (await import('./messages/fr.json')).default
}

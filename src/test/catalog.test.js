// Test simple pour vérifier le fonctionnement du store catalog
import { useCatalogStore } from 'stores/catalog'

// Test des getters
const catalog = useCatalogStore()

console.log('Test du store catalog:')

// Test des filtres actifs
catalog.q = 'smartphone'
catalog.category = 'electronics'
catalog.brands = ['samsung', 'apple']
catalog.price = { min: 200, max: 800 }
catalog.ratingMin = 4
catalog.inStock = true
catalog.ecoMin = 70
catalog.promo = true

console.log('Filtres actifs:', catalog.activeFiltersCount)
console.log('Filtres actifs:', catalog.activeFilters)

// Test de sérialisation
console.log('Query object:', catalog.toQuery())

// Test de réinitialisation
catalog.resetFilters()
console.log('Après reset:', catalog.activeFiltersCount)

console.log('Tests terminés!')

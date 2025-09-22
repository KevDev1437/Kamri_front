<template>
  <div
    class="kamri-category-card cursor-pointer"
    @click="handleClick"
    :aria-label="`Voir la catégorie ${category.name}`"
  >
    <!-- Badge TOP -->
    <q-badge v-if="category.tag" color="warning" floating>TOP</q-badge>

    <!-- Image circulaire avec fallback -->
    <div class="category-image-container">
      <q-img
        :src="category.image"
        :ratio="1"
        class="category-image rounded-bubble"
        @error="handleImageError"
      >
        <template v-slot:error>
          <div class="image-fallback flex flex-center">
            <q-icon name="image" size="48px" color="grey-5" />
          </div>
        </template>
        <template v-slot:loading>
          <q-skeleton type="rect" class="full-width full-height" />
        </template>
      </q-img>
    </div>

    <!-- Nom de la catégorie avec compteur optionnel -->
    <div class="kamri-category-name text-center q-mt-sm">
      {{ category.name }}
      <span v-if="showCount && category.productCount" class="kamri-category-count">
        ({{ category.productCount }})
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true,
    validator: (cat) => {
      return (
        cat.name &&
        typeof cat.slug === 'string' &&
        (!cat.productCount || typeof cat.productCount === 'number')
      )
    },
  },
  showCount: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click', 'error'])

const handleClick = () => {
  emit('click', props.category)
}

const handleImageError = () => {
  emit('error', {
    type: 'image',
    category: props.category,
  })
}
</script>

<style lang="scss" scoped>
@use 'src/css/_tokens.scss' as *;

.kamri-category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 1rem;
  background: #fff;
  border-radius: $radius-lg;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: scale(1.04);
    box-shadow: $shadow-2;
    border-color: $primary;

    .category-image-container {
      transform: scale(1.05);
    }
  }
}

.category-image-container {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  position: relative;
  transition: all 0.3s ease;
  border: 3px solid #e5e7eb;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, $primary, $accent);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
  }
}

.kamri-category-card:hover .category-image-container::before {
  opacity: 0.1;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.rounded-bubble {
  border-radius: 50%;
}

.kamri-category-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: $dark;
  margin-top: 1rem;
  width: 100%;
  text-align: center;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kamri-category-count {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

.image-fallback {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  color: #9ca3af;
}
</style>

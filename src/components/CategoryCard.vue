<template>
  <div class="category-card cursor-pointer" @click="handleClick">
    <!-- Badge TOP -->
    <q-badge
      v-if="category.isHot"
      class="top-badge"
      style="background: #FF6B00"
      text-color="white"
    >
      TOP
    </q-badge>

    <!-- Image circulaire avec fallback -->
    <div class="category-image-container">
      <q-img
        :src="category.image"
        :ratio="1"
        class="category-image"
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
    <div class="category-name text-center q-mt-sm">
      {{ category.name }}
      <span v-if="showCount && category.productCount" class="count">
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
      return cat.name &&
             typeof cat.slug === 'string' &&
             (!cat.productCount || typeof cat.productCount === 'number')
    }
  },
  showCount: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'error'])

const handleClick = () => {
  emit('click', props.category)
}

const handleImageError = () => {
  emit('error', {
    type: 'image',
    category: props.category
  })
}
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 8px;
  transition: transform 0.2s ease;
}

.category-image-container {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  background: #f5f5f5;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top-badge {
  position: absolute;
  top: 0;
  right: 12px;
  z-index: 2;
  font-size: 0.8rem;
  padding: 4px 8px;
  font-weight: 500;
  border-radius: 4px;
}

.category-name {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-top: 8px;
  width: 100%;
  text-align: center;
}

.count {
  color: #666;
  font-size: 0.9em;
}

.image-fallback {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}

.category-card:hover {
  transform: translateY(-2px);
}
</style>

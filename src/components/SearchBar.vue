<!-- src/components/SearchBar.vue -->
<template>
  <div class="search-bar-wrapper q-py-xl">
    <q-input
      dense
      outlined
      rounded
      placeholder="Rechercher des produits..."
      v-model="searchTerm"
      @keyup.enter="onSearch"
      class="search-input"
      style="width: 100%; min-height: 40px;"
    >
      <template #append>
        <div class="row items-center">
          <q-icon
            name="camera_alt"
            @click="onCameraClick"
            class="cursor-pointer q-mr-sm"
          />
          <q-separator vertical color="grey-5" class="q-mx-sm" />
          <q-icon
            name="search"
            @click="onSearch"
            class="cursor-pointer"
          />
        </div>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchTerm = ref('')

function onSearch() {
  if (!searchTerm.value.trim()) return
  router.push({ path: '/', query: { q: searchTerm.value } })
}

function onCameraClick() {
  // À implémenter : logique pour la fonctionnalité de caméra
  console.log('Camera clicked')
}
</script>

<style scoped>
/* Wrapper adds vertical padding */
.search-bar-wrapper {
  width: 100%;
}

:deep(.q-field__append) {
  padding-right: 8px;
}
</style>

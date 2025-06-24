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
        <q-icon name="search" @click="onSearch" class="cursor-pointer" />
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
</script>

<style scoped>
/* Wrapper adds vertical padding */
.search-bar-wrapper {
  width: 100%;
}
</style>

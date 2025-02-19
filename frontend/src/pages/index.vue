<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-900">Cuentos</h1>
    <div class="mb-4">
      <label for="sort" class="mr-2 text-sm text-gray-700">Ordenar por:</label>
      <select id="sort" v-model="sortBy" @change="loadStories" class="border rounded p-1 text-sm">
        <option value="createdAt:desc">Más recientes primero</option>
        <option value="createdAt:asc">Más antiguos primero</option>
        <option value="title:asc">Título A-Z</option>
        <option value="title:desc">Título Z-A</option>
      </select>
    </div>
    <div class="grid gap-6 md:grid-cols-2 mb-6">
      <div v-for="story in stories" :key="story.id"
        class="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col h-full">
        <div class="p-4 flex-grow story">
          <h2 class="text-xl font-semibold mb-2 text-gray-900">{{ story.title }}</h2>
          <p class="text-gray-700 text-sm mb-4 leading-relaxed">
            {{ cutBetweenWords(story.content, 45) }}
          </p>
        </div>
        <div class="bg-gray-50 px-4 pb-4 mt-auto flex justify-between items-center text-sm">
          <!-- Botón "Leer más" alineado a la izquierda -->
          <div>
            <router-link :to="`/stories/${story.id}`"
              class="bg-black text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-blue-700">
              Leer más
            </router-link>
          </div>

          <!-- Estadísticas alineadas a la derecha -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span class="font-medium">{{ story.statistics.totalVotes }}</span>
            </div>
            <div class="flex items-center text-yellow-500">
              <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="font-medium">{{ story.statistics.averageRating.toFixed(1) }}</span>
            </div>
            <div class="flex items-center text-black">
              📖 {{ story.readCount ?? 0 }}
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="flex justify-center items-center space-x-2 text-sm">
      <button @click="prevPage" :disabled="currentPage === 1" class="p-1 rounded-full bg-gray-200 disabled:opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd" />
        </svg>
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="p-1 rounded-full bg-gray-200 disabled:opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import storiesApi from '../api/stories'

export default {
  setup() {
    const stories = ref([])
    const currentPage = ref(1)
    const totalPages = ref(1)
    const sortBy = ref('createdAt:desc')

    const cutBetweenWords = (text, limit) => {
      const words = text.split(' ')
      if (words.length <= limit) {
        return text
      }
      return words.slice(0, limit).join(' ') + '...'
    }

    const loadStories = async () => {
      const response = await storiesApi.getStories(currentPage.value, 12, sortBy.value)
      stories.value = response.data
      totalPages.value = response.meta.pagination.pageCount
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        loadStories()
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        loadStories()
      }
    }

    onMounted(loadStories)

    return {
      stories,
      currentPage,
      totalPages,
      sortBy,
      cutBetweenWords,
      loadStories,
      prevPage,
      nextPage
    }
  }
}
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.story {
  font-family: Georgia, serif;
}
</style>
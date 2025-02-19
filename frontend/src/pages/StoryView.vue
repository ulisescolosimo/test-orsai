<template>
  <div class="container mx-auto px-4">
    <div v-if="story" class="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col">


      <!-- Contenido de la historia -->
      <div class="p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ story.title }}</h1>
        <p class="text-gray-600 text-sm mb-4">📖 Lecturas: {{ story.readCount }}</p>
        <p class="text-gray-700 leading-relaxed">
          {{ story.content }}
        </p>
      </div>

      <!-- Sección de estadísticas (Votos y Rating) -->
      <div class="bg-gray-50 px-6 py-3 flex justify-between items-center text-sm border-t">
        <div class="flex items-center text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span class="font-medium">{{ story.statistics.totalVotes || 0 }}</span>
        </div>
        <div class="flex items-center text-yellow-500">
          <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span class="font-medium">{{ story.statistics.averageRating?.toFixed(1) || "N/A" }}</span>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 text-lg font-semibold py-10">
      Cargando historia...
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import storyApi from "../api/stories";

export default {
  setup() {
    const route = useRoute();
    const story = ref(null);
    const storyId = route.params.id;

    const loadStory = async () => {
      story.value = await storyApi.getStoryById(storyId);

      // ✅ Después de 6 segundos, recargar la historia para reflejar el nuevo readCount
      setTimeout(async () => {
        story.value = await storyApi.getStoryById(storyId);
      }, 6000);
    };

    onMounted(loadStory);

    return { story };
  },
};
</script>



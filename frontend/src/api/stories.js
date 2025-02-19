import axios from "axios";

export default {
  async getStories(page = 1, limit = 10, sort = "createdAt:desc") {
    try {
      const response = await axios.get(`http://localhost:1337/api/stories`, {
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": limit,
          sort,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error en getStories():", error);
      return { data: [], meta: { pagination: { pageCount: 1 } } };
    }
  },

  async getAllStories() {
    const response = await axios.get(`/stories`, {
      params: {
        "pagination[pageSize]": 10000,
      },
    });
    return response.data.data;
  },

  async getStoryById(id) {
    try {
      const response = await axios.get(
        `http://localhost:1337/api/stories/${id}`
      );
      return response.data.data?.attributes || null;
    } catch (error) {
      console.error(
        `Error al obtener la historia con ID ${id}:`,
        error.response?.data || error.message
      );
      return null;
    }
  },
};

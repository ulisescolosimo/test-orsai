"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::story.story", ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    const enhancedData = await Promise.all(
      data.map(async (story) => {
        const votes = await strapi.entityService.findMany("api::vote.vote", {
          filters: { story: story.id },
        });

        const totalVotes = votes.length;
        const averageRating =
          totalVotes > 0
            ? votes.reduce((sum, vote) => sum + vote.rating, 0) / totalVotes
            : 0;

        return {
          ...story,
          statistics: {
            totalVotes,
            averageRating,
          },
        };
      })
    );

    return { data: enhancedData, meta };
  },
  async findOne(ctx) {
    try {
      const { id } = ctx.params;

      const story = await strapi.entityService.findOne("api::story.story", id, {
        populate: ["votes"],
      });

      if (!story) {
        return ctx.notFound("Story not found");
      }

      const votes = await strapi.entityService.findMany("api::vote.vote", {
        filters: { story: id },
      });

      const totalVotes = votes.length;
      const averageRating =
        totalVotes > 0
          ? votes.reduce((sum, vote) => sum + vote.rating, 0) / totalVotes
          : 0;

      // ✅ Esperar 5 segundos antes de actualizar readCount
      setTimeout(async () => {
        await strapi.entityService.update("api::story.story", id, {
          data: {
            readCount: (story.readCount || 0) + 1,
          },
        });
        console.log(`🔹 readCount incrementado para story ID: ${id}`);
      }, 5000);

      return {
        data: {
          id: story.id,
          attributes: {
            ...story,
            statistics: {
              totalVotes,
              averageRating,
            },
          },
        },
      };
    } catch (error) {
      console.error("Error en findOne:", error);
      return ctx.internalServerError("Error interno al obtener la historia");
    }
  },
}));

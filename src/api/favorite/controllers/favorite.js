const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::favorite.favorite', ({ strapi }) => ({
    async find(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized();
        }

        const favorites = await strapi.entityService.findMany('api::favorite.favorite', {
            filters: { user: user.id },
            populate: ['product']
        });

        return { data: favorites };
    },

    async create(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized();
        }

        ctx.request.body.data.user = user.id;
        const response = await super.create(ctx);
        return response;
    }
})); 
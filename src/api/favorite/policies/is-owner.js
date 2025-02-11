module.exports = async (policyContext, config, { strapi }) => {
    const { id } = policyContext.params;
    const user = policyContext.state.user;

    // Si no hay id, se asume que es una petición de creación
    if (!id) {
        return true;
    }

    if (!user) {
        return false;
    }

    // Primero intenta buscar con el id directamente
    let favorite = await strapi.entityService.findOne('api::favorite.favorite', id, {
        populate: ['user'],
    });

    // Si no se encuentra y el id no es numérico, podría tratarse del documentId
    if (!favorite && isNaN(id)) {
        const favorites = await strapi.entityService.findMany('api::favorite.favorite', {
            filters: { documentId: id },
            populate: ['user'],
        });
        if (favorites && favorites.length > 0) {
            favorite = favorites[0];
        }
    }

    if (!favorite) {
        return false;
    }

    return favorite.user.id === user.id;
};
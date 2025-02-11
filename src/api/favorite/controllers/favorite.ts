/**
 * favorite controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::favorite.favorite', ({ strapi }) => ({
    async findMine(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('No autorizado');
        }

        const favorites = await strapi.entityService.findMany('api::favorite.favorite', {
            filters: {
                user: user.id
            },
            populate: {
                product: {
                    populate: ['category', 'images']
                }
            }
        });

        return {
            data: favorites || [],
            meta: {
                count: favorites ? favorites.length : 0
            }
        };
    },
    async delete(ctx) {
        const { id } = ctx.params;
        // Utiliza el método por defecto para eliminar el registro
        const response = await super.delete(ctx);

        // Retorna un mensaje y/o los datos del elemento eliminado
        return { message: 'Favorite eliminado con éxito', data: response };
    },
    async create(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized();
        }

        // Obtenemos el valor enviado en el campo "product"
        let productField = ctx.request.body.data.product;

        // Si el valor enviado es un string y no se puede convertir a un número,
        // se asume que es un documentId
        if (typeof productField === 'string' && isNaN(Number(productField))) {
            // Se fuerza el tipo de filters para que incluya documentId, ya que TS no lo reconoce de forma predeterminada.
            const products = await strapi.entityService.findMany('api::product.product', {
                filters: { documentId: productField } as any,
                limit: 1,
                fields: ['id']
            });
            if (!products.length) {
                return ctx.badRequest(`No se encontró ningún producto con documentId: ${productField}`);
            }
            // Reemplazamos el valor del campo "product" por el id numérico obtenido
            ctx.request.body.data.product = products[0].id;
        }

        // Asignamos el usuario autenticado al favorite
        ctx.request.body.data.user = user.id;
        console.log('Usuario asignado:', user, 'Producto asignado:', ctx.request.body.data.product);

        const response = await super.create(ctx);
        return response;
    }
}));

export default {
    routes: [
        {
            method: 'GET',
            path: '/favorites/me',
            handler: 'favorite.findMine',
            config: {
                policies: [],
                middlewares: [],
                auth: {
                    scope: ['api::favorite.favorite.findMine']
                }
            }
        }
    ]
}; 
module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/favorites',
            handler: 'favorite.find',
            config: {
                policies: ['global::is-owner']
            }
        },
        {
            method: 'POST',
            path: '/favorites',
            handler: 'favorite.create',
            config: {
                policies: ['global::is-owner']
            }
        },
        {
            method: 'DELETE',
            path: '/favorites/:id',
            handler: 'favorite.delete',
            config: {
                policies: ['global::is-owner']
            }
        }
    ]
}; 
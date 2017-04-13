export let config = {
    baseUri: 'https://worldofrations.com',
    web: {
        uri: 'https://worldofrations.com',
    },
    db: {
        server: 'mysql',
        user: 'worldofrations_user',
        password: 'worldofrations_password',
        database: 'worldofrations',
    },
    logging: {
        enabled: false,
        path: '/logs/',
    },
    oauth: {
        jwtSecret: 'worldofrationskey',
        jwtIssuer: 'worldofrations.com',
        google: {
            clientId: '749471567348-o8fvlu40jadtumao8cgmjotvr0nibuso.apps.googleusercontent.com',
            clientSecret: 'zehw7T5OujXvzcgtTgbDzGI9',
        },
    },
};

export let config = {
    baseUri: 'http://localhost:3000',
    web: {
        uri: 'http://localhost:4200',
    },
    db: {
        server: 'mysql',
        user: 'worldofrations_user',
        password: 'worldofrations_password',
        database: 'worldofrations',
    },
    redis: {
        server: 'redis',
        port: 6379
    },
    logging: {
        enabled: true,
        path: './',
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

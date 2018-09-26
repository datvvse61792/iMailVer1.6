module.exports = {
    /*
    ** Headers of the page
    */
    head: {
        title: 'iMail - Bảo mật Email',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'Dịch vụ bảo mật email dành cho người Việt'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    /*
    ** Add axios globally
    */
    build: {
        vendor: ['axios'],
        /*
        ** Run ESLINT on save
        */
        extend(config, ctx) {
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    },
    serverMiddleware: [
        // API middleware
        '~/api/index.js'
    ],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        'bootstrap-vue/nuxt'
    ],

    axios: {
        baseURL: 'http://localhost:3000'
    },

    css: [
        'bootstrap/scss/bootstrap.scss',
        '@/assets/css/singin.css',
        '@/assets/css/app.scss',
        '@/assets/css/materialdesignicons.css'
    ],
    plugins:
        [
            {src: '~plugins/components.js', ssr: false}
        ],
    auth: {
        redirect: {
            callback: '/callback'
        },
        strategies: {
            social: {
                _scheme: 'oauth2',
                authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
                userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
                scope: [
                    'openid',
                    'profile',
                    'email',
                    'https://mail.google.com/'
                ],
                response_type: 'token',
                token_type: 'Bearer',
                redirect_uri: undefined,
                client_id: '314170165517-1fdennrqq5ng1l944648ijkv58er0ou4.apps.googleusercontent.com',
                token_key: 'access_token'
            }
        }
    }
}

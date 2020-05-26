
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Ulises',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Ulises.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat&display=swap' }

    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/styles.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@plugins/global.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/vuetify-module
    '@nuxtjs/vuetify',
  ],
  vuetify: {
    /* module options */
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    font: {
      family: 'Montserrat'
    },
    theme: {
      themes: {
        light: {
          primary: '#ff9320',
          secondary: '#000000',
          accent: '#f4f4f5',
          error: '#FF5252',
          info: '#A9AAA9',
          success: '#4CAF50',
          warning: '#FFC107',
        }
      }
    },
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    [
      'nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set:'@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          }
        ]
      },
    ]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL:  'http://127.0.0.1:8000',//'{BASE_URL_OF API}/',
    credentials: true
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}

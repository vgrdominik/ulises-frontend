<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      width="350"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="12">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content @click="$router.push({ path: item.path })">
                <v-list-item-title class="primary--text">
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
            >
              <v-list-item-action v-if="child.icon" @click="$router.push({ path: child.path })">
                <CtIcon :icon="child.icon" class="primary--text" />
              </v-list-item-action>
              <v-list-item-content @click="$router.push({ path: child.path })">
                <v-list-item-title class="primary--text">
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            link
          >
            <v-list-item-action @click="$router.push({ path: item.path })">
              <CtIcon :icon="item.icon" class="primary--text" />
            </v-list-item-action>
            <v-list-item-content @click="$router.push({ path: item.path })">
              <v-list-item-title class="primary--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container>
        <v-row dense>
          <v-col cols="6" sm="2">
            <v-row>
              <v-col class="text--right">
                <CtBtn type="icon" :icon="['fas', 'chevron-left']" @click="$router.go(-1)" class="float-right mt-2" />
              </v-col>
              <v-col class="mt-2 ml-3 pl-0">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" sm="2">
            <a href="/" title="Home">
              <v-row>
                <v-col class="pr-0 mr-0">
                  <v-img src="img/ulises_logo_180.png" class="float-right" width="50px" title="Ulises" alt="Ulises" />
                </v-col>
                <v-col class="mt-2 ml-3 pl-0 title font-weight-black">
                  Ulises
                </v-col>
              </v-row>
            </a>
          </v-col>

          <v-spacer />
          <template v-if="user">
            <v-col cols="4" sm="2" class="mt-7">
              <a type="text" class="secondary--text text-center" href="/account">
                Mi cuenta
              </a>
            </v-col>
            <v-col cols="4" sm="2" class="mt-7">
              <a type="text" class="secondary--text text-center" @click="logout()">
                Salir
              </a>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="4" sm="2" class="mt-7">
              <a type="text" class="secondary--text text-center" href="/login">
                Login
              </a>
            </v-col>
            <v-col cols="4" sm="2" class="mt-7 text-center">
              <a type="text" class="secondary--text" href="/registro">
                Empezar
              </a>
            </v-col>
          </template>

          <v-spacer />
          <v-col cols="4" sm="2" class="mt-6">
            <CtBtn type="icon" class="float-right" color="black" :icon="['fas', 'bell']" to="/notificaciones" />
          </v-col>
        </v-row>
      </v-container>
      <v-container
        class="main-container"
        :fluid="!$vuetify.breakpoint.mdAndUp"
      >
        <nuxt />
      </v-container>
    </v-content>

    <v-footer color="transparent">
      <v-row class="title-footer">
        <v-col class="text-center primary--text display-4 font-weight-black">
          <a href="/" title="Home">Ulises</a>
        </v-col>
      </v-row>
      <v-container>
        <CtCard type="empty" flat tile width="100%" class="accent text-center">

          <v-card-text class="secondary--text">
            <br><br><br>
            Puedes encontrarnos en redes con el hashtag #ulises.
          </v-card-text>

          <v-card-text>
            <CtBtn type="text" href="https://www.ciclotic.com/sobre-ciclotic.php#condiciones" target="_blank" color="secondary">Condiciones</CtBtn>
            <CtBtn type="text" href="https://miolimpo.org" target="_blank" color="secondary">{{ new Date().getFullYear() }} — Mi Olimpo</CtBtn>
          </v-card-text>
        </CtCard>
        <v-row class="pt-12">
          <v-spacer />
          <v-col cols="3" sm="1">
            <v-img src="img/ulises_logo_180.png" width="50px" title="Ulises" alt="Ulises" />
          </v-col>
          <v-spacer />
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  props: {
    source: String,
  },

  data: () => ({
    dialog: false,
    drawer: false,
    items: [
      { icon: ['fas', 'cube'], text: 'Productos', path: '/product' },
      { icon: ['fas', 'cube'], text: 'Productos - Categorías', path: '/taxon' },
      { icon: ['fas', 'cube'], text: 'Complementos', path: '/complement' },
      { icon: ['fas', 'cube'], text: 'Complementos - Categorías', path: '/complement-taxon' },
      { icon: ['fas', 'cube'], text: 'Canales', path: '/channel' },
      { icon: ['fas', 'cube'], text: 'Vendedores', path: '/vendor' },
    ],
  }),

  computed: {
    user () {
      return this.$store.state.user.user
    }
  },

  methods: {
    afterLogout(){
      this.setToken('')
      this.removeUser()
      setTimeout(() => this.$router.push({ path: '/' }), 2000)
    },

    logout () {
      this.$axios.post('/api/logout')
        .then(() => this.afterLogout())
    },

    ...mapActions({
      setToken: 'user/setToken',
    }),

    ...mapMutations({
      removeUser: 'user/removeUser',
    }),
  },
}
</script>

<style>
/* SCROLL THEME */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #ff9320;
}
</style>

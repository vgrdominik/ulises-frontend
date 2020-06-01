<template>
  <v-app id="inspire">
    <v-content class="primary white--text">
      <v-container fill-height class="main-container-cart pa-0">
        <nuxt />
      </v-container>
    </v-content>

    <v-footer class="primary white--text" v-if="$store.state.generic.showFooter === true">
      <v-row class="pt-12" @click="$router.push({ path: '/' })">
        <v-col cols="6">
          <v-img src="img/ulises_logo_400_white.png" class="float-right" width="100px" title="Ulises" alt="Ulises" />
        </v-col>
        <v-col cols="6">
          <span class="body-1">
            Powered by
          </span><br>
          <span class="display-1">
            Ulises
          </span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  props: {
    source: String,
  },

  data: () => ({}),

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

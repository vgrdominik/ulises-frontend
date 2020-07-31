<template>
    <CtCard title="Login" width="300" class="mx-auto">
      <v-row dense>
        <v-col cols="12" class="mt-5">
          <CtTextField append-icon="mdi-email" label="Email" v-model="signInData.email" @keyup.enter="login()" />
        </v-col>
        <v-col cols="12">
          <CtTextField type="password" append-icon="mdi-lock" label="Password" v-model="signInData.password" @keyup.enter="login()" />
        </v-col>
        <v-col cols="12" v-if="serverMessage && serverMessage instanceof Object" class="error--text">
          <v-row v-for="(serverError, index) in serverMessage" :key="index">
            <v-col cols="12" v-html="serverError" />
          </v-row>
        </v-col>
        <v-col cols="12" v-else-if="serverMessage" v-html="serverMessage" class="error--text" />
        <v-col cols="12">
          <CtBtn @click="login()" type="primary" block>
            Entrar
          </CtBtn>
        </v-col>
        <v-col cols="12" class="mt-5">
          <v-row>
            <v-spacer />
            <nuxt-link to="/recordar-password">
              ¿Has olvidado el password?
            </nuxt-link>
            <v-spacer />
          </v-row>
        </v-col>
        <v-col cols="12" class="my-5">
          <CtBtn to="/registro" type="accent" block>
            Registro
          </CtBtn>
        </v-col>
      </v-row>
    </CtCard>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data(){
    return {
      signInData: {
        email: '',
        password: '',
        device_name: 'website',
      },
    }
  },

  computed: {
    serverMessage () {
      return this.$store.state.serverMessage.serverMessage
    }
  },

  methods: {
    afterLogin(response){
      this.setToken(response.data.token)
      this.fetchUser()
      this.$router.push('/sala-de-espera')
    },

    login(){
      this.$axios.post('/api/login', this.signInData)
        .then((response) => (response.data.token) ? this.afterLogin(response) : this.setServerMessage(response.data))
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    ...mapActions({
      setToken: 'user/setToken',
      fetchUser: 'user/fetchUser',
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>

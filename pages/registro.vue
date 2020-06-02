<template>
  <CtCard title="Registro" width="300" class="mx-auto">
    <v-row v-if="! processing" dense>
      <v-col cols="12" class="mt-5">
        <CtTextField append-icon="mdi-account" label="Nombre público" v-model="signUpData.name"/>
      </v-col>
      <v-col cols="12">
        <CtTextField append-icon="mdi-email" label="Email" v-model="signUpData.email"/>
      </v-col>
      <v-col cols="12">
        <CtTextField type="password" append-icon="mdi-lock" label="Password" v-model="signUpData.password"/>
      </v-col>
      <v-col cols="12" v-if="serverMessage && serverMessage instanceof Object" class="error--text">
        <v-row v-for="(serverError, index) in serverMessage" :key="index">
          <v-col cols="12" v-html="serverError" />
        </v-row>
      </v-col>
      <v-col cols="12" v-else-if="serverMessage" v-html="serverMessage" class="error--text" />
      <v-col cols="12">
        <CtBtn @click="signUp()" type="primary" block>
          Enviar
        </CtBtn>
      </v-col>
      <v-col cols="12" class="my-5">
        <CtBtn to="/login" type="accent" block>
          Volver
        </CtBtn>
      </v-col>
    </v-row>
    <v-row v-else><v-col cols="12">Te estamos dando de alta. Espera unos segundos y te llevaremos al login.</v-col></v-row>
  </CtCard>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data(){
    return {
      signUpData: {
        name: '',
        email: '',
        password: '',
      },

      processing: false,
    }
  },

  computed: {
    serverMessage () {
      return this.$store.state.serverMessage.serverMessage
    }
  },

  methods: {
    signUp(){
      this.processing = true

      this.$axios.post('/api/register', this.signUpData)
        .then((response) => (response.data === 'User registered') ? this.$router.push({ path: '/login' }) : this.setServerMessage(response.data))
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    ...mapActions({
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>

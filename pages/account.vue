<template>
  <CtCard :title="formTitle" fluid max-width="1000" width="100%" min-height="350px" class="mx-auto">
    <v-tabs
      v-model="tab"
      background-color="primary"
      dark
    >
      <v-tab
        v-for="item in items"
        :key="item.tab"
      >
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="Datos de cuenta">
        <v-container
          fluid
          id="scroll-target"
          style="max-height: 400px"
          class="overflow-y-auto"
        >
          <v-row dense>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Nombre" v-model="user.description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Email" v-model="user.email"/>
            </v-col>

            <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <CtBtn @click="save()" type="primary" block>
            Guardar
          </CtBtn>
        </v-card-actions>
      </v-tab-item>
      <v-tab-item key="Password">
        Modificar password
      </v-tab-item>
      <v-tab-item key="Suscripción">
        Tu suscripción actual
      </v-tab-item>
      <v-tab-item key="Eliminar suscripción">
        Texto eliminar suscripción
      </v-tab-item>
    </v-tabs-items>
  </CtCard>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  middleware: 'authenticated',

  data() {
    return {
      // Tabs properties
      tab: null,
      items: [
        { tab: 'Datos de cuenta' },
        { tab: 'Password' },
        { tab: 'Suscripción' },
        { tab: 'Eliminar suscripción' },
      ],

      channels: [],
      user: {
        description: '',
        email: '',
      },
      profile: {
        description: '',
        creator_id: null,
        channel_id: null,
        details: '',
        avatar: '',
      },
      userId: null,
      formTitle: 'Modificar mi cuenta',

    }
  },

  computed: {
    serverMessage () {
      return this.$store.state.serverMessage.serverMessage
    },
  },

  mounted() {
    this.updateUser()
    this.profile.creator_id = this.$store.state.user.user.id
  },

  methods: {

    updateUser() {
      this.userId = this.$store.state.user.user.id
      this.user.description = this.$store.state.user.user.description
      this.user.email = this.$store.state.user.user.email
    },

    postSave() {
      return
    },

    save() {
      if (this.userId !== null && this.userId !== 0) {
        this.$axios.put('/api/user/' + this.userId, this.user)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error update user.'))
        return
      }

      return
    },

    ...mapActions({
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>

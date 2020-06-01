<template>
  <v-row dense>
    <v-col cols="12">
      <h1 class="display-3 text-center" v-html="(vendor !== null) ? vendor.description : 'Cargando...'" />
    </v-col>
    <v-col cols="12" class="mt-12">
      <v-row>
        <v-spacer />
        <CtBtn type="outlined" large color="white" :to="'/carta/' + account + '/productos/' + rate">
          La carta
        </CtBtn>
        <v-spacer />
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  layout: 'cart',

  validate ({ params }) {
    // Must be a number
    return /^\d+$/.test(params.rate) && /^\d+$/.test(params.account)
  },

  data: () => ({
    vendor: null,

    rate: '',
    account: null,
  }),

  mounted() {
    this.fetch()
    this.setShowFooter(true)

    this.setRouteParams()
  },

  methods: {
    setRouteParams() {
      this.rate = this.$nuxt._route.params.rate
      this.account = this.$nuxt._route.params.account
    },

    initVendor(vendors) {
      if (vendors[0] !== undefined) {
        this.vendor = vendors[0]
      }
    },

    fetch() {
      this.$axios.get('/api/vendorSummary')
        .then((response) => (response.data) ? this.initVendor(response.data) : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    ...mapActions({
      setShowFooter: 'generic/setShowFooter',
    }),
  },
}
</script>

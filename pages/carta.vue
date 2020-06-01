<template>
  <v-row dense>
    <v-col cols="12">
      <h1 class="display-3 text-center" v-html="(vendor !== null) ? vendor.description : 'Cargando...'" />
    </v-col>
    <v-col cols="12" class="mt-12">
      <v-row>
        <v-spacer />
        <CtBtn type="outlined" large color="white" to="/carta-productos">
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

  data: () => ({
    vendor: null,
  }),

  mounted() {
    this.fetch()
    this.setShowFooter(true)
  },

  methods: {

    initVendor(vendors) {
      if (vendors[0] !== undefined) {
        this.vendor = vendors[0]
      }
    },

    fetch() {
      this.$axios.get('/api/vendorSummary')
        .then((response) => (response.data) ? this.initVendor(response.data) : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list products.'))
    },

    ...mapActions({
      setShowFooter: 'generic/setShowFooter',
    }),
  },
}
</script>

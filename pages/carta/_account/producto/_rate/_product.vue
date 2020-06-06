<template>
  <v-card
    width="100%"
    height="100%"
  >
    <v-img
      v-if="currentImage"
      class="pa-3"
      height="200px"
      :src="currentImage">
      <CtBtn type="icon" class="white" :icon="['fas', 'chevron-left']" @click="$router.go(-1)" />
    </v-img>

    <v-card-title v-if="currentTitle" v-html="currentTitle" />

    <v-card-text v-if="currentDetails" v-html="currentDetails" />

    <v-card-actions>
      <span class="text--primary"></span>
    </v-card-actions>
  </v-card>
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
      products: [],
      productData: null,

      rate: '',
      product: '',
      account: null,

      currentProduct: null,
    }),

    computed: {
      currentImage() {
        if (this.currentProduct !== null) {
          return this.currentProduct.photo
        }

        return null
      },

      currentTitle() {
        if (this.currentProduct !== null) {
          return this.currentProduct.description
        }

        return 'Cargando...'
      },

      currentDetails() {
        if (this.currentProduct !== null) {
          return this.currentProduct.details
        }

        return null
      },
    },

    mounted() {
      this.setRouteParams()
      this.fetchVendor()
      this.fetchProducts()

      this.setShowFooter(false)
    },

    methods: {
      setRouteParams() {
        if (this.$nuxt._route.params.rate !== '0') {
          this.rate = this.$nuxt._route.params.rate
        }
        this.product = this.$nuxt._route.params.product
        this.account = this.$nuxt._route.params.account
      },

      initVendor(vendors) {
        if (vendors[0] !== undefined) {
          this.vendor = vendors[0]
        }
      },

      fetchVendor() {
        this.$axios.get('/api/vendorSummary?account_id=' + this.account)
          .then((response) => (response.data) ? this.initVendor(response.data) : '')
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
      },

      fetchProducts() {
        this.$axios.get('/api/productSummary?account_id=' + this.account)
          .then((response) => {
            if (response.data) {
              this.products = response.data
              this.fetchProduct()
            }
          })
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
      },

      fetchProduct() {
        for (let i = 0; i < this.products.length; i++) {
          if (this.product == this.products[i].id) {
            this.currentProduct = this.products[i]
          }
        }
      },

      ...mapActions({
        setShowFooter: 'generic/setShowFooter',
      }),
    },
  }
</script>

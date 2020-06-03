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

    <v-tabs
      v-model="currentTaxonIndex"
      show-arrows
    >
      <v-tab
        v-for="(taxon, index) in taxons"
        :key="index"
      >
        {{ taxon.short_description }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentTaxonIndex">
      <v-tab-item
        v-for="(taxon, index) in taxons"
        :key="index"
      >
        <v-card flat>
          <v-list three-line>
            <template v-for="(product, index) in productList">
              <v-divider />
              <v-list-item
                :key="product.id"
                @click=""
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <div v-html="product.description" class="float-left" />
                    <div v-if="product['retail_price' + rate] !== 0" v-html="product['retail_price' + rate] + ' €'" class="float-right" />
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <div v-html="product.details" />
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar width="70" height="70">
                  <v-img :src="product.photo" :title="product.description" :alt="product.description"></v-img>
                </v-list-item-avatar>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

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
    taxons: [],
    complements: [],
    complementTaxons: [],

    rate: '',
    account: null,

    currentProduct: null,

    currentTaxon: null,
    currentTaxonIndex: null,
  }),

  computed: {
    currentImage() {
      if (this.currentProduct !== null) {
        return this.currentProduct.photo
      }
      if (this.currentTaxon !== null) {
        return this.currentTaxon.photo
      }

      return null
    },

    currentTitle() {
      if (this.currentProduct !== null) {
        return this.currentProduct.description
      }
      if (this.currentTaxon !== null) {
        return this.currentTaxon.description
      }

      return 'Cargando...'
    },

    currentDetails() {
      if (this.currentProduct !== null) {
        return this.currentProduct.details
      }
      if (this.currentTaxon !== null) {
        return this.currentTaxon.details
      }

      return null
    },

    productList() {
      let products = []
      if (this.currentTaxon && this.products) {
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].taxon_id === this.currentTaxon.id) {
            products.push(this.products[i])
          }
        }
      }

      return products
    }
  },

  watch: {
    currentTaxonIndex: function (newValue) {
      if (this.taxons) {
        for (let i = 0; i < this.taxons.length; i++) {
          if (i === newValue) {
            this.currentTaxon = this.taxons[i]
          }
        }
      }
    }
  },

  mounted() {
    this.setRouteParams()
    this.fetchVendor()
    this.fetchProducts()
    this.fetchTaxons()
    this.fetchComplements()
    this.fetchComplementTaxons()

    this.setShowFooter(false)
  },

  methods: {
    setRouteParams() {
      if (this.$nuxt._route.params.rate !== '0') {
        this.rate = this.$nuxt._route.params.rate
      }
      this.account = this.$nuxt._route.params.account
    },

    initVendor(vendors) {
      if (vendors[0] !== undefined) {
        this.vendor = vendors[0]
      }
    },

    initTaxons(taxons) {
      this.taxons = taxons
      this.$nextTick(() => {
        if (taxons[0] !== undefined) {
          this.currentTaxon = taxons[0]
          this.currentTaxonIndex = 0
        }
      })
    },

    fetchVendor() {
      this.$axios.get('/api/vendorSummary?account_id=' + this.account)
        .then((response) => (response.data) ? this.initVendor(response.data) : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    fetchProducts() {
      this.$axios.get('/api/productSummary?account_id=' + this.account)
        .then((response) => (response.data) ? this.products = response.data : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    fetchTaxons() {
      this.$axios.get('/api/taxonSummary?account_id=' + this.account)
        .then((response) => (response.data) ? this.initTaxons(response.data) : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    fetchComplements() {
      this.$axios.get('/api/complementSummary?account_id=' + this.account)
        .then((response) => (response.data) ? this.complements = response.data : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    fetchComplementTaxons() {
      this.$axios.get('/api/complementTaxonSummary?account_id=' + this.account)
        .then((response) => (response.data) ? this.complementTaxons = response.data : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    ...mapActions({
      setShowFooter: 'generic/setShowFooter',
    }),
  },
}
</script>

<template>
  <CtCard title="Productos" width="100%" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addProduct" />
    </template>
    <v-container fluid>
      <v-row dense>
        <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
      </v-row>
      <v-data-iterator
        :items="products"
        :items-per-page.sync="itemsPerPage"
        :page="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        hide-default-footer
      >
        <template v-slot:header>
          <v-toolbar
            dark
            color="primary darken-3"
            class="mb-1"
          >
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-search"
              label="Search"
            ></v-text-field>
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-spacer></v-spacer>
              <v-select
                v-model="sortBy"
                flat
                solo-inverted
                hide-details
                :items="keys"
                item-text="description"
                item-value="key"
                prepend-inner-icon="mdi-search"
                label="Ordenar por"
              ></v-select>
              <v-spacer></v-spacer>
              <v-btn-toggle
                v-model="sortDesc"
                mandatory
              >
                <v-btn
                  large
                  depressed
                  color="blue"
                  :value="false"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn
                  large
                  depressed
                  color="blue"
                  :value="true"
                >
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>
          <v-row dense>
            <v-col
              cols="12"
              class="mt-2">
              <v-row dense>
                <v-col cols="1" />
                <v-col
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                  class="text-center"
                >
                  <template v-if="key.hint">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <CtBtn type="icon" color="primary" :icon="['fas', 'question-circle']" v-on="on">
                          <span class="primary--text" v-html="key.description" />
                        </CtBtn>
                      </template>
                      <span v-html="key.hint" />
                    </v-tooltip>
                  </template>
                  <template v-else>
                    <CtBtn type="text" color="primary">
                      <span class="primary--text" v-html="key.description" />
                    </CtBtn>
                  </template>
                </v-col>
                <v-col cols="1" />
              </v-row>
            </v-col>
          </v-row>
        </template>

        <template v-slot:default="props">
          <v-row dense>
            <v-col
              v-for="productItem in props.items"
              :key=" productItem.id"
              cols="12"
              class="mt-2">
              <v-row dense>
                <v-col cols="1">
                  <CtBtn type="icon" color="warning" :icon="['fas', 'trash']" @click="removeProduct(productItem.id)" />
                </v-col>
                <v-col
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                >
                  <span :class="{ 'primary--text': sortBy === key }" v-html="productItem[key.key]" />
                </v-col>
                <v-col cols="1" class="text-right">
                  <CtBtn type="icon" color="primary" :icon="['fas', 'edit']" @click="updateProduct(productItem.id)" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Items por página</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  text
                  color="primary"
                  class="ml-2"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span
              class="mr-4
            grey--text"
            >
            Página {{ page }} of {{ numberOfPages }}
          </span>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
    <CtDialog v-model="form" :title="formTitle" width="500" class="mx-auto">
      <template v-slot:rightTitleContent>
        <CtBtn type="icon" color="white" :icon="['fas', 'times']" @click="closeProduct" />
      </template>
      <v-card-text>
        <v-container
          fluid
          id="scroll-target"
          style="max-height: 400px"
          class="overflow-y-auto"
        >
          <v-row dense>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Nombre" v-model="product.description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Nombre corto" v-model="product.short_description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextarea append-icon="mdi-fingerprint" label="Detalles" v-model="product.details"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Orden" v-model="product.order"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtSelect :items="vendors" item-text="description" item-value="id" label="Vendedor" v-model="product.vendor_id"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtSelect :items="taxons" item-text="description" item-value="id" label="Categoría" v-model="product.taxon_id"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="PVP" v-model="product.retail_price"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="PVP Tarifa 2" v-model="product.retail_price2"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="PVP Tarifa 3" v-model="product.retail_price3"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="PVP Tarifa 4" v-model="product.retail_price4"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Tasa de tramitación" v-model="product.handling_fee"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Coste" v-model="product.product_cost"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Margen" v-model="product.margin"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="IVA" v-model="product.iva"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Referencia" v-model="product.sku"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Código de barras" v-model="product.barcode"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtCheckbox label="Inventario habilitado" v-model="product.inventory"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Cantidad inventario" v-model="product.quantity_inventory"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Foto" v-model="product.photo"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtCheckbox label="Complementos obligatorios" v-model="product.compulsory_complements"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtCheckbox label="Envío a dispositivos habilitado" v-model="product.send"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtCheckbox label="Está disponible" v-model="product.is_available"/>
            </v-col>
            <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <CtBtn @click="save()" type="primary" block>
          Guardar
        </CtBtn>
      </v-card-actions>
    </CtDialog>
  </CtCard>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  middleware: 'authenticated',

  data() {
    return {
      products: [],
      vendors: [],
      taxons: [],
      product: {
        description: '',
        short_description: '',
        details: '',
        order: '',
        creator_id: null,
        vendor_id: null,
        taxon_id: null,
        barcode: '',
        sku: '',
        iva: 0,
        inventory: false,
        quantity_inventory: 0,
        photo: '',
        retail_price: 0,
        retail_price2: 0,
        retail_price3: 0,
        retail_price4: 0,
        handling_fee: 0,
        product_cost: 0,
        margin: 0,
        compulsory_complements: false,
        send: false,
        is_available: false,
      },
      productId: null,
      formTitle: '',
      form: false,

      // DataIterator
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 8,
      sortBy: 'description',
      keys: [
        {
          description: 'Descripción',
          hint: null,
          key: 'description',
        },
        {
          description: 'Cantidad inventario',
          hint: null,
          key: 'quantity_inventory',
        },
        {
          description: 'PVP',
          hint: 'Precio de venta al público',
          key: 'retail_price',
        },
      ],
    }
  },

  computed: {
    serverMessage () {
      return this.$store.state.serverMessage.serverMessage
    },

    // DataIterator
    numberOfPages () {
      return Math.ceil(this.products.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key.key !== `to_views`) // TODO Filtered by views
    },
  },

  mounted() {
    this.fetch()
    this.fetchVendors()
    this.fetchTaxons()
    this.product.creator_id = this.$store.state.user.user.id
  },

  methods: {
    resetProductData() {
      this.form = false
      this.formTitle = ''
      this.productId = null
      this.product.description = ''
      this.product.short_description = ''
      this.product.details = ''
      this.product.order = ''
      this.product.vendor_id = null
      this.product.taxon_id = null
      this.product.barcode = ''
      this.product.sku = ''
      this.product.iva = 0
      this.product.inventory = false
      this.product.quantity_inventory = 0
      this.product.photo = ''
      this.product.retail_price = 0
      this.product.retail_price2 = 0
      this.product.retail_price3 = 0
      this.product.retail_price4 = 0
      this.product.handling_fee = 0
      this.product.product_cost = 0
      this.product.margin = 0
      this.product.compulsory_complements = false
      this.product.send = false
      this.product.is_available = false
    },

    closeProduct() {
      this.resetProductData()
    },

    addProduct() {
      this.resetProductData()
      this.formTitle = 'Añadir producto'
      this.form = true
      this.productId = 0
    },

    initUpdateProduct(product) {
      this.formTitle = 'Modificar producto'
      this.form = true
      this.productId = product.id
      this.product = product
      this.product.creator_id = product.creator.id
      this.product.vendor_id = product.vendor.id
      this.product.taxon_id = product.taxon.id
    },

    updateProduct(productId) {
      this.$axios.get('/api/product/' + productId)
        .then((response) => (response.data) ? this.initUpdateProduct(response.data) : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error get product.'))
    },

    removeProduct(productId) {
      if (productId !== null) {
        this.$axios.delete('/api/product/' + productId)
          .then((response) => this.fetch())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error remove product.'))
        return
      }

      return
    },

    postSave() {
      this.fetch()
      this.closeProduct()
    },

    save() {
      if (this.productId === 0) {
        this.$axios.post('/api/product', this.product)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error create product.'))
        return
      }
      if (this.productId !== null) {
        this.$axios.put('/api/product/' + this.productId, this.product)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error update product.'))
        return
      }

      return
    },

    fetch() {
      this.$axios.get('/api/product')
        .then((response) => (response.data) ? this.products = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list products.'))
    },

    fetchVendors() {
      this.$axios.get('/api/vendor')
        .then((response) => (response.data) ? this.vendors = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list products.'))
    },

    fetchTaxons() {
      this.$axios.get('/api/taxon')
        .then((response) => (response.data) ? this.taxons = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list products.'))
    },

    // DataIterator
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },

    ...mapActions({
      setServerMessage: 'serverMessage/setServerMessage',
    }),
  }
}
</script>

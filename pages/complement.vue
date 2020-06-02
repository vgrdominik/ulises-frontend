<template>
  <CtCard title="Complementos" width="100%" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addComplement" />
    </template>
    <v-container fluid>
      <v-row dense>
        <v-col cols="12" v-if="serverMessage && serverMessage instanceof Object" class="error--text">
          <v-row v-for="(serverError, index) in serverMessage" :key="index">
            <v-col cols="12" v-html="serverError" />
          </v-row>
        </v-col>
        <v-col cols="12" v-else-if="serverMessage" v-html="serverMessage" class="error--text" />
      </v-row>
      <v-data-iterator
        :items="complements"
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
                  color="primary"
                  :value="false"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn
                  large
                  depressed
                  color="primary"
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
              v-for="complementItem in props.items"
              :key=" complementItem.id"
              cols="12"
              class="mt-2">
              <v-row dense>
                <v-col cols="1">
                  <CtBtn type="icon" color="warning" :icon="['fas', 'trash']" @click="removeComplement(complementItem.id)" />
                </v-col>
                <v-col
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                >
                  <span :class="{ 'primary--text': sortBy === key }" v-html="complementItem[key.key]" />
                </v-col>
                <v-col cols="1" class="text-right">
                  <CtBtn type="icon" color="primary" :icon="['fas', 'edit']" @click="updateComplement(complementItem.id)" />
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
              color="primary darken-3"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="primary darken-3"
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
        <CtBtn type="icon" color="white" :icon="['fas', 'times']" @click="closeComplement" />
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
              <CtTextField append-icon="mdi-fingerprint" label="Nombre" v-model="complement.description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Nombre corto" v-model="complement.short_description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextarea append-icon="mdi-fingerprint" label="Detalles" v-model="complement.details"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Orden" v-model="complement.order"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtSelect :items="complementTaxons" item-text="description" item-value="id" label="Categoría" v-model="complement.complement_taxon_id"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtSelect :items="products" item-text="description" item-value="id" label="Producto asociado" v-model="complement.product_id"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtSelect :items="products" item-text="description" item-value="id" label="Es un complemento del producto" v-model="complement.complement_of_id"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Cantidad inventario" v-model="complement.quantity_inventory"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="PVP" v-model="complement.retail_price"/>
            </v-col>
            <v-col cols="12">
              <CtTextField type="number" append-icon="mdi-height" label="Margen" v-model="complement.margin"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <v-checkbox label="Precio incluído" v-model="complement.include"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <v-checkbox label="Solo se puede incluir una vez" v-model="complement.unique"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <v-checkbox label="Incluido por defecto" v-model="complement.by_default"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <v-checkbox label="Está disponible" v-model="complement.is_available"/>
            </v-col>
            <v-col cols="12" v-if="serverMessage && serverMessage instanceof Object" class="error--text">
              <v-row v-for="(serverError, index) in serverMessage" :key="index">
                <v-col cols="12" v-html="serverError" />
              </v-row>
            </v-col>
            <v-col cols="12" v-else-if="serverMessage" v-html="serverMessage" class="error--text" />
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
      complements: [],
      products: [],
      complementTaxons: [],
      complement: {
        description: '',
        short_description: '',
        details: '',
        order: '',
        creator_id: null,
        complement_taxon_id: null,
        product_id: null,
        complement_of_id: null,
        quantity_inventory: 0,
        retail_price: 0,
        margin: 0,
        include: false,
        unique: false,
        by_default: false,
        is_available: false,
      },
      complementId: null,
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
          description: 'Producto',
          hint: null,
          key: 'product_id',
        },
        {
          description: 'Inventario',
          hint: null,
          key: 'quantity_inventory',
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
      return Math.ceil(this.complements.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key.key !== `to_views`) // TODO Filtered by views
    },
  },

  mounted() {
    this.fetch()
    this.fetchProducts()
    this.fetchComplementTaxons()
    this.complement.creator_id = 1
  },

  methods: {
    resetComplementData() {
      this.form = false
      this.formTitle = ''
      this.complementId = null
      this.complement.description = ''
      this.complement.short_description = ''
      this.complement.details = ''
      this.complement.order = ''
      this.complement.complement_taxon_id = null
      this.complement.product_id = null
      this.complement.complement_of_id = null
      this.complement.quantity_inventory = 0
      this.complement.retail_price = 0
      this.complement.margin = 0
      this.complement.include = false
      this.complement.unique = false
      this.complement.by_default = false
      this.complement.is_available = false
    },

    closeComplement() {
      this.resetComplementData()
    },

    addComplement() {
      this.resetComplementData()
      this.formTitle = 'Añadir complemento'
      this.form = true
      this.complementId = 0
    },

    initUpdateComplement(complement) {
      this.formTitle = 'Modificar complemento'
      this.form = true
      this.complementId = complement.id
      this.complement = complement
      this.complement.creator_id = complement.creator.id
      this.complement.complement_taxon_id = complement.complement_taxon.id
      this.complement.product_id = complement.product.id
      this.complement.complement_of_id = complement.complement_of.id
    },

    updateComplement(complementId) {
      this.$axios.get('/api/complement/' + complementId)
        .then((response) => (response.data) ? this.initUpdateComplement(response.data) : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    removeComplement(complementId) {
      if (complementId !== null) {
        this.$axios.delete('/api/complement/' + complementId)
          .then((response) => this.fetch())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }

      return
    },

    postSave() {
      this.fetch()
      this.closeComplement()
    },

    save() {
      if (this.complementId === 0) {
        this.$axios.post('/api/complement', this.complement)
          .then(() => this.postSave())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }
      if (this.complementId !== null) {
        this.$axios.put('/api/complement/' + this.complementId, this.complement)
          .then(() => this.postSave())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }

      return
    },

    fetch() {
      this.$axios.get('/api/complement')
        .then((response) => (response.data) ? this.complements = response.data : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    fetchProducts() {
      this.$axios.get('/api/product')
        .then((response) => (response.data) ? this.products = response.data : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    fetchComplementTaxons() {
      this.$axios.get('/api/complementTaxon')
        .then((response) => (response.data) ? this.complementTaxons = response.data : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
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

<template>
  <CtCard title="Productos" width="100%" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addProduct" />
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
                  class="text-center"
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
              <CtTextField append-icon="mdi-format-text-variant" label="Nombre" v-model="product.description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-tag-text-outline" label="Nombre corto" v-model="product.short_description"/>
            </v-col>
            <v-col cols="12" class="mt-5" id="editor-texto">
              Detalles<br/>
              <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                <div class="menubar">

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.bold() }"
                    @click="commands.bold"
                  >
                    <CtIcon :icon="['fas', 'bold']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.italic() }"
                    @click="commands.italic"
                  >
                    <CtIcon :icon="['fas', 'italic']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.strike() }"
                    @click="commands.strike"
                  >
                    <CtIcon :icon="['fas', 'strike']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.underline() }"
                    @click="commands.underline"
                  >
                    <CtIcon :icon="['fas', 'underline']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.code() }"
                    @click="commands.code"
                  >
                    <CtIcon :icon="['fas', 'code']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.paragraph() }"
                    @click="commands.paragraph"
                  >
                    <CtIcon :icon="['fas', 'paragraph']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                    @click="commands.heading({ level: 1 })"
                  >
                    H1
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                    @click="commands.heading({ level: 2 })"
                  >
                    H2
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                    @click="commands.heading({ level: 3 })"
                  >
                    H3
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.bullet_list() }"
                    @click="commands.bullet_list"
                  >
                    <CtIcon :icon="['fas', 'ul']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.ordered_list() }"
                    @click="commands.ordered_list"
                  >
                    <CtIcon :icon="['fas', 'ol']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.blockquote() }"
                    @click="commands.blockquote"
                  >
                    <CtIcon :icon="['fas', 'quote']" />
                  </button>

                  <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.code_block() }"
                    @click="commands.code_block"
                  >
                    <CtIcon :icon="['fas', 'code']" />
                  </button>

                  <button
                    class="menubar__button"
                    @click="commands.horizontal_rule"
                  >
                    <CtIcon :icon="['fas', 'hr']" />
                  </button>

                  <button
                    class="menubar__button"
                    @click="commands.undo"
                  >
                    <CtIcon :icon="['fas', 'undo']" />
                  </button>

                  <button
                    class="menubar__button"
                    @click="commands.redo"
                  >
                    <CtIcon :icon="['fas', 'redo']" />
                  </button>

                </div>
              </editor-menu-bar>
              <editor-content class="editor__content" :editor="editor"  />
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-swap-vertical" label="Orden" v-model="product.order"/>
            </v-col>
            <input type="hidden" v-model="product.vendor_id"/>
            <v-col cols="12" class="mt-5">
              <CtSelect :items="taxons" item-text="description" item-value="id" label="Categoría" v-model="product.taxon_id"/>
            </v-col>
            <v-col cols="12">
              <CtTextField append-icon="mdi-currency-eur" label="PVP Tarifa 1" v-model="product.retail_price"/>
            </v-col>
            <v-col cols="12">
              <CtTextField append-icon="mdi-currency-eur" label="PVP Tarifa 2" v-model="product.retail_price2"/>
            </v-col>
            <v-col cols="12">
              <CtTextField append-icon="mdi-currency-eur" label="PVP Tarifa 3" v-model="product.retail_price3"/>
            </v-col>
            <v-col cols="12">
              <CtTextField append-icon="mdi-currency-eur" label="PVP Tarifa 4" v-model="product.retail_price4"/>
            </v-col>
            <input type="hidden" v-model="product.handling_fee"/>
            <input type="hidden" v-model="product.product_cost"/>
            <input type="hidden" v-model="product.margin"/>
            <v-col cols="12">
              <CtTextField append-icon="mdi-office-building" label="% IVA" v-model="product.iva"/>
            </v-col>
            <input type="hidden" v-model="product.sku"/>
            <input type="hidden" v-model="product.barcode"/>
            <input type="hidden" v-model="product.inventory"/>
            <input type="hidden" v-model="product.quantity_inventory"/>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-file-image" label="Foto" v-model="product.photo"/>
            </v-col>
            <input type="hidden" v-model="product.compulsory_complements"/>
            <input type="hidden" v-model="product.send"/>
            <v-col cols="12" class="mt-5">
              <v-checkbox label="Está disponible" v-model="product.is_available"/>
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
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  middleware: 'authenticated',

  components: {
    EditorContent,
    EditorMenuBar,
  },

  data() {
    return {
      editor: null,

      products: [],
      vendors: [],
      taxons: [],
      product: {
        description: '',
        short_description: '',
        details: '',
        order: '',
        creator_id: null,
        //vendor_id: null,
        vendor_id: 1,
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
        is_available: true,
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
          description: 'Categoría',
          hint: null,
          key: 'taxon_name',
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
    this.product.creator_id = 1
    this.product.details = '<p>Descripción del producto</p>'

    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      content: this.product.details,
    })
  },

  methods: {
    resetProductData() {
      this.form = false
      this.formTitle = ''
      this.productId = null
      this.product.description = ''
      this.product.short_description = ''
      this.product.details = '<p>Descripción del producto</p>'
      this.editor.setContent(this.product.details)
      this.product.order = ''
      this.product.vendor_id = 1
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
      this.product.is_available = true
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

      this.editor.setContent(this.product.details)
    },

    updateProduct(productId) {
      this.$axios.get('/api/product/' + productId)
        .then((response) => (response.data) ? this.initUpdateProduct(response.data) : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    removeProduct(productId) {
      if (productId !== null) {
        this.$axios.delete('/api/product/' + productId)
          .then((response) => this.fetch())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }

      return
    },

    postSave() {
      this.fetch()
      this.closeProduct()
    },

    save() {
      this.product.details = this.editor.getHTML()

      if (this.productId === 0) {
        this.$axios.post('/api/product', this.product)
          .then(() => this.postSave())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }
      if (this.productId !== null) {
        this.$axios.put('/api/product/' + this.productId, this.product)
          .then(() => this.postSave())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }

      return
    },

    fetch() {
      this.$axios.get('/api/product')
        .then((response) => (response.data) ? this.products = response.data : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    fetchVendors() {
      this.$axios.get('/api/vendor')
        .then((response) => (response.data) ? this.vendors = response.data : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    fetchTaxons() {
      this.$axios.get('/api/taxon')
        .then((response) => (response.data) ? this.taxons = response.data : '')
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
  },

  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
<style>
  .editor__content {
    border: 1px solid black;
  }
</style>

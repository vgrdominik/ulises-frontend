<template>
  <CtCard title="Vendedores" width="100%" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addVendor" />
    </template>
    <v-container fluid>
      <v-row dense>
        <v-col cols="12" v-if="serverMessage" v-html="serverMessage" class="error--text" />
      </v-row>
      <v-data-iterator
        :items="vendors"
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
              v-for="vendorItem in props.items"
              :key=" vendorItem.id"
              cols="12"
              class="mt-2">
              <v-row dense>
                <v-col cols="1">
                  <CtBtn type="icon" color="warning" :icon="['fas', 'trash']" @click="removeVendor(vendorItem.id)" />
                </v-col>
                <v-col
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                >
                  <span :class="{ 'primary--text': sortBy === key }" v-html="vendorItem[key.key]" />
                </v-col>
                <v-col cols="1" class="text-right">
                  <CtBtn type="icon" color="primary" :icon="['fas', 'edit']" @click="updateVendor(vendorItem.id)" />
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
        <CtBtn type="icon" color="white" :icon="['fas', 'times']" @click="closeVendor" />
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
              <CtTextField append-icon="mdi-fingerprint" label="Nombre" v-model="vendor.description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Nombre corto" v-model="vendor.short_description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextarea append-icon="mdi-fingerprint" label="Detalles" v-model="vendor.details"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="DNI/NIF" v-model="vendor.nif"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Dirección" v-model="vendor.address"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Código Postal" v-model="vendor.postal_code"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Población/Ciudad" v-model="vendor.city"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Provincia" v-model="vendor.province"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Móvil" v-model="vendor.mobile"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Correo" v-model="vendor.email"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField type="password" append-icon="mdi-fingerprint" label="Password" v-model="vendor.password"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtSelect :items="rates" item-text="description" item-value="id" label="Tarifa" v-model="vendor.default_rate"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtSelect :items="types" item-text="description" item-value="id" label="Tipo de vendedor" v-model="vendor.type"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Token" v-model="vendor.token"/>
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
      vendors: [],
      rates: [
        {
          description: 'Tarifa por defecto',
          id: 'Tarifa por defecto',
        },
        {
          description: 'Tarifa 2',
          id: 'Tarifa 2',
        },
        {
          description: 'Tarifa 3',
          id: 'Tarifa 3',
        },
        {
          description: 'Tarifa 4',
          id: 'Tarifa 4',
        },
      ],
      types: [
        {
          description: 'Cualquiera',
          id: 'Cualquiera',
        },
        {
          description: 'Ordenador',
          id: 'Ordenador',
        },
        {
          description: 'Móvil',
          id: 'Móvil',
        },
        {
          description: 'Otro',
          id: 'Otro',
        },
      ],
      vendor: {
        description: '',
        short_description: '',
        details: '',
        nif: '',
        address: '',
        postal_code: '',
        city: '',
        province: '',
        mobile: '',
        email: '',
        password: '',
        default_rate: null,
        type: null,
        creator_id: null,
        token: '',
      },
      vendorId: null,
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
          description: 'Dni / Nif',
          hint: null,
          key: 'nif',
        },
        {
          description: 'Token',
          hint: null,
          key: 'token',
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
      return Math.ceil(this.vendors.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key.key !== `to_views`) // TODO Filtered by views
    },
  },

  mounted() {
    this.fetch()
    this.vendor.creator_id = this.$store.state.user.user.id
  },

  methods: {
    resetVendorData() {
      this.form = false
      this.formTitle = ''
      this.vendorId = null
      this.vendor.description = ''
      this.vendor.short_description = ''
      this.vendor.details = ''
      this.vendor.nif = ''
      this.vendor.address = ''
      this.vendor.postal_code = ''
      this.vendor.city = ''
      this.vendor.province = ''
      this.vendor.mobile = ''
      this.vendor.email = ''
      this.vendor.password = ''
      this.vendor.default_rate = null
      this.vendor.type = null
      this.vendor.token = ''
    },

    closeVendor() {
      this.resetVendorData()
    },

    addVendor() {
      this.resetVendorData()
      this.formTitle = 'Añadir vendedor'
      this.form = true
      this.vendorId = 0
    },

    initUpdateVendor(vendor) {
      this.formTitle = 'Modificar vendedor'
      this.form = true
      this.vendorId = vendor.id
      this.vendor = vendor
      this.vendor.creator_id = vendor.creator.id
    },

    updateVendor(vendorId) {
      this.$axios.get('/api/vendor/' + vendorId)
        .then((response) => (response.data) ? this.initUpdateVendor(response.data) : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error get vendor.'))
    },

    removeVendor(vendorId) {
      if (vendorId !== null) {
        this.$axios.delete('/api/vendor/' + vendorId)
          .then((response) => this.fetch())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error remove vendor.'))
        return
      }

      return
    },

    postSave() {
      this.fetch()
      this.closeVendor()
    },

    save() {
      if (this.vendorId === 0) {
        this.$axios.post('/api/vendor', this.vendor)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error create vendor.'))
        return
      }
      if (this.vendorId !== null) {
        this.$axios.put('/api/vendor/' + this.vendorId, this.vendor)
          .then(() => this.postSave())
          .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error update vendor.'))
        return
      }

      return
    },

    fetch() {
      this.$axios.get('/api/vendor')
        .then((response) => (response.data) ? this.vendors = response.data : '')
        .catch((error) => (error.response && error.response.data && error.response.data.message) ? this.setServerMessage(error.response.data.message) : this.setServerMessage('Error list vendors.'))
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

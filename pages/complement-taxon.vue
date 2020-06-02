<template>
  <CtCard title="Categorías de complemento" width="100%" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn type="icon" color="white" :icon="['fas', 'plus']" @click="addComplementTaxon" />
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
        :items="complementTaxons"
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
              v-for="complementTaxonItem in props.items"
              :key=" complementTaxonItem.id"
              cols="12"
              class="mt-2">
              <v-row dense>
                <v-col cols="1">
                  <CtBtn type="icon" color="warning" :icon="['fas', 'trash']" @click="removeComplementTaxon(complementTaxonItem.id)" />
                </v-col>
                <v-col
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                >
                  <span :class="{ 'primary--text': sortBy === key }" v-html="complementTaxonItem[key.key]" />
                </v-col>
                <v-col cols="1" class="text-right">
                  <CtBtn type="icon" color="primary" :icon="['fas', 'edit']" @click="updateComplementTaxon(complementTaxonItem.id)" />
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
        <CtBtn type="icon" color="white" :icon="['fas', 'times']" @click="closeComplementTaxon" />
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
              <CtTextField append-icon="mdi-fingerprint" label="Nombre" v-model="complementTaxon.description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Nombre corto" v-model="complementTaxon.short_description"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextarea append-icon="mdi-fingerprint" label="Detalles" v-model="complementTaxon.details"/>
            </v-col>
            <v-col cols="12" class="mt-5">
              <CtTextField append-icon="mdi-fingerprint" label="Orden" v-model="complementTaxon.order"/>
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
      complementTaxons: [],
      complementTaxon: {
        description: '',
        short_description: '',
        details: '',
        order: '',
        creator_id: null,
      },
      complementTaxonId: null,
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
          description: 'Orden',
          hint: null,
          key: 'order',
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
      return Math.ceil(this.complementTaxons.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key.key !== `to_views`) // TODO Filtered by views
    },
  },

  mounted() {
    this.fetch()
    this.complementTaxon.creator_id = 1
  },

  methods: {
    resetComplementTaxonData() {
      this.form = false
      this.formTitle = ''
      this.complementTaxonId = null
      this.complementTaxon.description = ''
      this.complementTaxon.short_description = ''
      this.complementTaxon.details = ''
      this.complementTaxon.order = ''
      this.complementTaxon.photo = ''
      this.complementTaxon.channel_id = null
      this.complementTaxon.product_id = null
    },

    closeComplementTaxon() {
      this.resetComplementTaxonData()
    },

    addComplementTaxon() {
      this.resetComplementTaxonData()
      this.formTitle = 'Añadir categoría de complemento'
      this.form = true
      this.complementTaxonId = 0
    },

    initUpdateComplementTaxon(complementTaxon) {
      this.formTitle = 'Modificar categoría de complemento'
      this.form = true
      this.complementTaxonId = complementTaxon.id
      this.complementTaxon = complementTaxon
      this.complementTaxon.creator_id = complementTaxon.creator.id
    },

    updateComplementTaxon(complementTaxonId) {
      this.$axios.get('/api/complementTaxon/' + complementTaxonId)
        .then((response) => (response.data) ? this.initUpdateComplementTaxon(response.data) : '')
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    removeComplementTaxon(complementTaxonId) {
      if (complementTaxonId !== null) {
        this.$axios.delete('/api/complementTaxon/' + complementTaxonId)
          .then((response) => this.fetch())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }

      return
    },

    postSave() {
      this.fetch()
      this.closeComplementTaxon()
    },

    save() {
      if (this.complementTaxonId === 0) {
        this.$axios.post('/api/complementTaxon', this.complementTaxon)
          .then(() => this.postSave())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }
      if (this.complementTaxonId !== null) {
        this.$axios.put('/api/complementTaxon/' + this.complementTaxonId, this.complementTaxon)
          .then(() => this.postSave())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }

      return
    },

    fetch() {
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

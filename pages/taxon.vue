<template>
  <CtCard title="Categorías" width="100%" class="mx-auto">
    <template v-slot:rightTitleContent>
      <CtBtn color="white" :icon="['fas', 'plus']" @click="addTaxon">
        Añadir
      </CtBtn>
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
        :items="taxons"
        :items-per-page.sync="itemsPerPage"
        :page="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        hide-default-footer
      >
        <template v-slot:header>
          <v-row class="d-flex">
            <v-text-field
              v-model="search"
              flat
              outlined
              dense
              hide-details
              label="Search"
            ></v-text-field>
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-spacer></v-spacer>
              <v-select
                v-model="sortBy"
                flat
                hide-details
                outlined
                dense
                :items="keys"
                item-text="description"
                item-value="key"
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
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
                <v-btn
                  large
                  depressed
                  color="primary"
                  :value="true"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              class="mt-2">
              <v-row dense>
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
                <v-col cols="1" />
              </v-row>
            </v-col>
          </v-row>
        </template>

        <template v-slot:default="props">
          <v-row dense>
            <v-col
              v-for="taxonItem in props.items"
              :key=" taxonItem.id"
              cols="12"
              class="mt-2">
              <v-row dense>
                <v-col
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                  class="text-center"
                >
                  <template v-if="key.key === 'descriptionWithParent' && taxonItem.parent_taxon_id">
                    <template v-if="taxonEdition[taxonItem.index] && taxonEdition[taxonItem.index].isEditing">
                      <CtSelect :items="taxons" item-text="description" item-value="id" label="Categoría padre" v-model="taxonItem.parent_taxon_id" @input="updateTaxonFromList(taxonItem.index)" />
                      <CtTextField @input="updateTaxonFromList(taxonItem.index)" :label="key.description" v-model="taxonItem.description"/>
                    </template>
                    <span v-else :class="{ 'primary--text': sortBy === key }" v-html="taxonItem.descriptionWithParent" />
                  </template>
                  <template v-else>
                    <CtTextField v-if="taxonEdition[taxonItem.index] && taxonEdition[taxonItem.index].isEditing" @input="updateTaxonFromList(taxonItem.index)" :label="key.description" v-model="taxonItem[key.key]"/>
                    <span v-else :class="{ 'primary--text': sortBy === key }" v-html="taxonItem[key.key]" />
                  </template>
                </v-col>
                <v-col cols="1" class="text-right">
                  <CtBtn type="icon" color="primary" :icon="['fas', 'edit']" @click="taxonEdition[taxonItem.index].isEditing = ! taxonEdition[taxonItem.index].isEditing" />
                </v-col>
                <v-col cols="1">
                  <CtBtn type="icon" color="error" :icon="['fas', 'trash']" @click="removeTaxon(taxonItem.id)" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row dense>
            <v-col
              v-if="form"
              cols="12"
              class="mt-2">
              <v-row dense>
                <v-col class="text-center">
                  <CtSelect :items="taxons" item-text="description" item-value="id" label="Categoría padre" v-model="taxon.parent_taxon_id" @keyup.enter="save(null, taxon)" />
                </v-col>
                <v-col
                  v-for="(key, index) in filteredKeys"
                  :key="index"
                  class="text-center"
                >
                  <template v-if="key.key === 'descriptionWithParent'">
                    <CtTextField :label="key.description" v-model="taxon.description" @keyup.enter="save(null, taxon)" />
                  </template>
                  <CtTextField v-else :label="key.description" v-model="taxon[key.key]" @keyup.enter="save(null, taxon)" />
                </v-col>
                <v-col cols="2" class="text-right">
                  <CtBtn type="icon" color="primary" :icon="['fas', 'save']" @click="save(null, taxon)" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
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
  </CtCard>
</template>

<script>
import { mapActions } from 'vuex'
import CtTextField from "~/components/CtTextField";
export default {
  components: {CtTextField},
  middleware: 'authenticated',

  data() {
    return {
      taxons: [],
      taxonEdition: [],
      taxon: {
        description: '',
        order: '1',
        photo: '',
        creator_id: '1',
        parent_taxon_id: null,
        is_available: true,
      },
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
          key: 'descriptionWithParent',
        },
        {
          description: 'Order',
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
      return Math.ceil(this.taxons.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key.key !== `to_views`) // TODO Filtered by views
    },
  },

  mounted() {
    this.fetch()
  },

  destroyed() {
    for (let i = 0; i < this.taxonEdition.length; i++) {
      this.taxonEdition[i].taxonNextEditionTimeFunction = null
    }
  },

  methods: {
    addTaxon() {
      this.form = true
    },

    removeTaxon(taxonId) {
      if (taxonId !== null) {
        this.$axios.delete('/api/taxon/' + taxonId)
          .then((response) => this.fetch())
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }

      return
    },

    updateTaxonFromList(taxonKey) {
      if (this.taxonEdition[taxonKey].taxonNextEditionTime) {
        this.$nextTick(() => {
           this.save(taxonKey, this.taxons[taxonKey])
        })

        this.taxonEdition[taxonKey].taxonNextEditionTime = false
        this.taxonEdition[taxonKey].taxonNextEditionTimeFunction = setTimeout(() => {
          this.taxonEdition[taxonKey].taxonNextEditionTime = true
          if (this.taxonEdition[taxonKey].taxonNextEditionTimeQueued) {
            this.taxonEdition[taxonKey].taxonNextEditionTimeQueued = false
            this.updateTaxonFromList(taxonKey)
          }
        }, 2000)
      } else {
        this.taxonEdition[taxonKey].taxonNextEditionTimeQueued = true
      }
    },

    save(taxonItemIndex, taxon) {
      if (taxonItemIndex !== null) {
        this.$axios.put('/api/taxon/' + this.taxons[taxonItemIndex].id, taxon)
          .then(() => {})
          .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
        return
      }

      this.$axios.post('/api/taxon', taxon)
        .then(() => {
          this.fetch()

          this.taxon.description = ''
          this.taxon.order = '1'
          this.taxon.photo = ''
          this.taxon.creator_id = '1'
          this.taxon.parent_taxon_id = null
          this.taxon.is_available = true

          this.form = false
        })
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))

      return
    },

    fetch() {
      this.$axios.get('/api/taxon')
        .then((response) => {
          this.taxons = []
          this.taxonEdition = []

          for (let i = 0; i < response.data.length; i++) {
            this.taxons.push(response.data[i])
            this.taxons[i].creator_id = this.taxons[i].creator.id
            this.taxons[i].parent_taxon_id = (this.taxons[i].parent_taxon) ? this.taxons[i].parent_taxon.id : null
            this.taxons[i].index = i

            this.taxonEdition.push({
              id: this.taxons[i].id,
              index: i,
              isEditing: false,
              taxonNextEditionTime: true,
              taxonNextEditionTimeQueued: false,
              taxonNextEditionTimeFunction: null,
            })
          }
          for (let i = 0; i < this.taxons.length; i++) {
            this.taxons[i].descriptionWithParent = (this.taxons[i].parent_taxon) ? this.getTaxonDescriptionById(this.taxons[i].id) : this.taxons[i].description
          }
        })
        .catch((error) => (error.response.data.message) ? (error.response.data.message === 'The given data was invalid.' && error.response.data.errors) ? this.setServerMessage(error.response.data.errors) : this.setServerMessage(error.response.data.message) : this.setServerMessage('Error.'))
    },

    getTaxonDescriptionById(taxonId) {
      for (let i = 0; i < this.taxons.length; i++) {
        if (this.taxons[i].id === taxonId) {
          if (this.taxons[i].parent_taxon_id) {
            return this.getTaxonDescriptionById(this.taxons[i].parent_taxon_id) + ' -> ' + this.taxons[i].description
          }

          return this.taxons[i].description
        }
      }

      return ''
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

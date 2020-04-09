<template>
<q-page class="q-pa-md">  
<template v-slot:top>
  <q-btn 
  @click="showAddItem = true"
  color="primary" 
  icon="add" 
  label="Add a sentence" />

  <q-dialog v-model="showAddItem">
    <add-item @close="showAddItem = false"/>
  </q-dialog>
  <q-space />
  <q-input borderless dense debounce="300" color="primary" v-model="filter">
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-input>
  
</template>

        <q-table
          v-if="Object.keys(arrayOfItems).length"
          row-key="fr"
          title="Sentences"
          :pagination.sync="pagination"
          :filter="filter"
          :data="arrayOfItems"
          :columns="columns"
          :selected.sync="selected"
        >

          <template v-slot:top-right>
        <q-input dense v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
            </q-input>
          </template>
         <template v-slot:body-cell-selected="props">
            <q-td key="selected" :props="props">
              <div>
                <q-checkbox multiple v-model="props.row[1].selected" />
              </div>
            </q-td>
          </template>
         <template v-slot:body-cell-concepts="props">
            <q-td key="concepts" :props="props">
              <div v-for="concept in props.row[1].concepts">
                <q-badge v-if="concept" clickable @click="filter=concept" color="primary" text-color="white">
                  {{concept}}
                </q-badge>
              </div>
            </q-td>
        </template>
    </q-chip>
        <template v-slot:body-cell-date="props">
          <q-td key="date" :props="props">           
            <div v-if="props.row[1].state == 'new' || props.row[1].date == ''" >
              <p>New</p>         
            </div>
            <div v-else-if="moment(props.row[1].date) <= moment()">
              <q-badge color="yellow"> Needs Reviewing! </q-badge>
            </div>
            <div v-else>
              <p> {{moment(props.row[1].date).format('ll')}} </p>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-button="props">
            <q-td key="button" :props="props">
              <div>
                <play-button
                  :audio="props.row[1].audio_url"/>
              </div>
            </q-td>
          </template>
        </q-table>
        
</q-page>
</template>

<script>

import { mapActions, mapState, mapGetters } from 'vuex'
const moment = require('moment')

export default {
data(){
return {
    moment,
    showAddItem: false,
    selected: [],
    loading: false,
    filter: '',
    pagination: {
      rowsPerPage: 50
    },
    columns: [
    {
      name: 'selected',
      field: row => row[1].selected,
      format: val => `${val}`
    },
    {
      name: 'name',
      required: true,
      label: 'Sentence',
      align: 'left',
      field: row => row[1].fr,
      format: val => `${val}`,
      sortable: true
    },
    { name: 'en', label: 'en', field: 'en', align:'left',
      field: row => row[1].en,
      format: val => `${val}`, 
      sortable: true },
    { name: 'concepts',
      required: true,
      label: 'Concepts',
      align: 'left',
      field: row => row[1].concepts,
      sortable: true},
    { name: 'date',
      required: true,
      label: 'Due',
      align: 'center',
      field: row => moment(row[1].date).format('l') || 'new',
      sortable: true},
    { name: 'button', label: 'button', sortable: false}
  ]
}
},
methods: {
  customSort (rows, sortBy, descending) {
  const data = [ ...rows ]

    if (sortBy) {
      data.sort((a, b) => {
        const x = descending ? b : a
        const y = descending ? a : b

        if (sortBy === 'name') {
          // string sort
          return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
        }
        else {
          // numeric sort
          return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
        }
      })
    }

    return data
  }
},
  computed: {
    ...mapState('items', ['items', 'search']),
    ...mapActions('items', ['selectDueItems']),
    ...mapGetters('items', ['arrayOfItems', 'dueItems']),
  },
  watch: {
  //     selectReview: function(value, oldValue) {
  //       console.log('selectReview: function(value) :', value)
  //       console.log('selectReview: function(oldValue) :', oldValue)
  // }
  },
components: {
'item' : require('components/List/Item.vue').default,
'add-item' : require('components/List/Modals/AddItem.vue').default,
'search' : require('components/List/Tools/Search.vue').default,
'no-items' : require('components/List/NoItems.vue').default,
'play-button' : require('components/Table/PlayButton.vue').default
}
}
</script>


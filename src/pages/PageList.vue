<template>
  <q-page padding class="flex-center">
    <q-table 
      class="q-pa-md" 
      title="Treats" 
      :data="data" 
      :columns="columns"
      :selected.sync="selected"
      selection="multiple" 
      :filter="filter"
      :filter-method="customFilter"
      row-key="Record ID" >

      <template v-slot:top-right>
        <q-input rounded dense debounce="300" standout v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>                                  
              <q-checkbox v-model="props.selected"/>
          </q-td>  
          <q-td key="French" :props="props">
            {{ props.row.French }}
          </q-td>
          <q-td key="English" :props="props">
              {{ props.row.English }}
          </q-td>
          <q-td key="Tags" :props="props">
              <q-badge outline class="q-pa-sm q-mx-xs" rounded color="orange"  text-color="black" :label="props.row.Tags.Tense" />
              <q-badge outline class="q-pa-sm q-mx-xs" color="cyan" rounded text-color="black" :label="props.row.Tags.Voice" />
              <q-badge outline class="q-pa-sm q-mx-xs" color="red" rounded text-color="black" :label="props.row.Tags.Registre" />
              <q-badge outline class="q-pa-sm q-mx-xs" color="green" rounded text-color="black" :label="props.row.Tags.Form" />
              <q-badge outline class="q-pa-sm q-mx-xs" color="grey" rounded text-color="black" :label="props.row.Tags.Mood" />
          </q-td>
          <q-td key="Level" :props="props">
              {{ props.row.Level }}
          </q-td>
          <q-td key="Audio" :props="props">
            <audio-btn :audioUrl="props.row.audioUrl"></audio-btn>
          </q-td>
        </q-tr>
      </template>

    </q-table>
    <div>
      {{selected}}
    </div>
  </q-page>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import AudioBtn from '../components/AudioBtn.vue'

export default {
  data(){
    return{
      filter:'',
      data:[],
      selected:[],
      columns:[
        {
          name: 'French',
          required: true,
          label: 'French',
          align: 'left',
          field: row => row.French,
          sortable:true
        },
        {
          name: 'English',
          required: true,
          label: 'English',
          align: 'left',
          field: row => row.English,
          sortable:true
        },
        {
          name: 'Tags',
          required: true,
          label: 'Tags',
          align: 'left',
          field: row => row.Tags,
        },
        {
          name: 'Level',
          required: true,
          label: 'Level',
          align: 'left',
          field: row => row.Level,
          sortable:true
        },
        {
          name: 'Audio',
          required: true,
          field: row => row.audioUrl,
          label: 'Audio',
          align: 'left',
        },
      ]
    }
  },
  computed:{
    ...mapGetters('playlist', ['getPlayedPhrases']),
    ...mapGetters('items', ['getTableData']),
  },
  methods:{
    ...mapActions('items', ['setCurrentActive','populateAllKeyPhrasesDetails']),
    populateTableData(){
      this.data = this.getTableData;
    },
    customFilter(rows, terms){

     return rows.filter(row => {
          var searchKeys = ["English","French","Tags","Level"];
          var filteredRow = {};
          searchKeys.forEach(prop => filteredRow[prop] = row[prop]);
          return Object.values(this.flattenObject(filteredRow))
              .filter(val => val.includes(terms))
              .length >=1 ? true : false;

     });
               
      
    },
    flattenObject(obj) {
        const flattened = {}

        Object.keys(obj).forEach((key) => {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(flattened, this.flattenObject(obj[key]))
          } else {
            flattened[key] = obj[key]
          }
        })

        return flattened;
    }
  },
  components:{
    AudioBtn
  },
  mounted(){
   this.populateAllKeyPhrasesDetails();
   this.populateTableData();
  }
}
</script>

<style lang="sass" scoped>
</style>
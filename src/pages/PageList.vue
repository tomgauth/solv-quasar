<template>
  <q-page padding class="flex-center">
    <q-table 
      class="q-pa-md custom" 
      title="Phrases" 
      :data="data" 
      :columns="columns"
      :selected.sync="selected"
      no-data-label="Nothing to learn!"
      no-results-label="The filter didn't uncover any results!"
      selection="multiple" 
      :filter="filter"
      :loading="tableLoading"
      :filter-method="customFilter"
      row-key="Record ID"
      @selection="selection" >

      <template v-slot:top-right>
        <label for="tagFilter" class="q-mx-sm text-bold">Search</label>
        <q-input rounded dense  standout v-model="filter" ref="tagFilter" >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:header-cell-Tags="props">
        <q-th :props="props" class="row items-center">
          <span class="col-1">
            {{props.col.name}}
          </span>
           <!-- <q-btn color="white" text-color="black" icon="filter_list" round flat size="12px" /> -->
               <q-select
                hide-bottom-space
                hide-hint
                bg-color="white"
                standout="bg-white"
                dense
                hide-dropdown-icon
                v-model="filteredTags"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="tagsOptions"
                class="col-10"
                @add="onTagOptionChange"
                @remove="onTagOptionChange"
              >
                <template v-slot:prepend>
                  <q-icon name="filter_list" color="black"/>
                </template>
               </q-select>
        </q-th>
      </template>
      
      <template v-slot:no-data="{ message }">
        <div class="full-width row q-py-lg flex-center q-gutter-sm">
          <span class="text-body2">
            {{ message }}
          </span>
        </div>
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
  </q-page>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import AudioBtn from '../components/AudioBtn.vue'

export default {
  data(){
    return{
      filteredTags:[],
      tableLoading:false,
      tagsOptions:[],
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
    ...mapGetters('items', ['getTableData','getAllTagsValues']),
  },
  methods:{
    ...mapActions('items', ['setCurrentActive','populateAllKeyPhrasesDetails','toggleSelection']),
    populateTableData(){
      this.data = this.getTableData;
      this.selected = this.data.filter(rec => rec.selected);
      this.tagsOptions = this.getAllTagsValues;
    },
    customFilter(){
     return this.allFiltersApplied();
    },
    allFiltersApplied(){
      var filteredRows = this.data.filter(row => {
            var searchKeys = ["English","French","Tags","Level"];
            var filteredRow = {};
            searchKeys.forEach(prop => filteredRow[prop] = row[prop]);
            return Object.values(this.flattenObject(filteredRow))
                .filter(val => this.localizeKeyWords(val).toLowerCase().includes(this.filter.trim().toLowerCase()))
                .length >=1 ? true : false;
      });

      var tagFiltered = filteredRows.filter(rec => {
        var allTagsVals = Object.values(rec.Tags);
        return this.filteredTags.every(val => allTagsVals.includes(val));
      });
      
      return tagFiltered;
    },
    onTagOptionChange(detail){
      if (this.filter.length == 0)
      this.filter += " ";
  
    },
    localizeKeyWords(val){
      var mapper = {
        "e":/e|é|è|ê|ë/gi,
        "c":/c|ç/gi,
        "a":/a|à|â/gi
      };
      for (const key in mapper) {
        if (Object.hasOwnProperty.call(mapper, key)) {
          const regex = mapper[key];
          val = val.replace(regex,key);
        }
      }
      return val;
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
    },
    selection(details){
     this.toggleSelection(details);
    }
  },
  components:{
    AudioBtn
  },
  async mounted(){
     this.tableLoading = true;
     await this.populateAllKeyPhrasesDetails();
     this.populateTableData();
     this.tableLoading = false;
  }
}
</script>

<style lang="scss"  >
.q-select__input.q-placeholder.col.q-select__input--padding{
  display: none;
}
label .q-chip.row.inline.no-wrap.items-center.q-chip--dense{
  color: white;
  padding-left: 10px;
  padding-right: 10px;
  background-color: rebeccapurple;
}
label .q-field__prepend.q-field__marginal.row.no-wrap.items-center{
  margin: auto;
}
</style>
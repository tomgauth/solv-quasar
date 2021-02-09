<template>
  <q-page padding class="flex-center">
    <q-table 
      class="q-pa-md custom table-responsive" 
      :dense="$q.screen.lt.md"
      :grid="$q.screen.lt.sm"
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

      <template v-slot:item="props">
        <div
          class="transition q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition custom-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card>
            <q-card-section>
              <q-badge color="black" text-color="white" floating class="dark-card-badge q-pa-sm" :label="`Level ${props.row.Level}`" />
              
            </q-card-section>
            <q-card-section class="row items-center justify-between">
              <span class="text-h3 text-bold text-grey-4">Fr</span>
              <span class="text-body1 text-bold"><q>{{ props.row.French}}</q></span>
            </q-card-section>
            <q-card-section class="row items-center justify-between">
              <span class="text-h3 text-bold text-grey-4">En</span>
              <span class="text-body1 text-bold"><q>{{ props.row.English }}</q></span>
            </q-card-section>
            <q-card-section class="row items-center q-my-md q-gutter-sm justify-center">
              <q-badge outline class="q-pa-sm q-mx-xs" rounded color="orange"  text-color="black" :label="props.row.Tags.Tense" />
              <q-badge outline class="q-pa-sm q-mx-xs" color="cyan" rounded text-color="black" :label="props.row.Tags.Voice" />
              <q-badge outline class="q-pa-sm q-mx-xs" color="red" rounded text-color="black" :label="props.row.Tags.Registre" />
              <q-badge outline class="q-pa-sm q-mx-xs" color="green" rounded text-color="black" :label="props.row.Tags.Form" />
              <q-badge outline class="q-pa-sm q-mx-xs" color="grey" rounded text-color="black" :label="props.row.Tags.Mood" />
            </q-card-section>
            <q-card-section class="row  items-center justify-center">
              <audio-btn size="18px" :audioUrl="props.row.audioUrl"></audio-btn>
            </q-card-section>
            <q-card-section class="column items-center justify-center">
                <q-badge color="black" outline class="q-pa-sm" text-color="white" label="Learn this phrase" />
                <q-checkbox v-model="props.selected" color="black" />
            </q-card-section>
          </q-card>
          
        </div>
      </template>
      <template v-slot:top-right>
        <label for="tagFilter" v-if="!$q.screen.lt.sm" class="q-mx-sm text-bold">Search</label>
        <q-input :class="[{'q-mt-md':$q.screen.lt.sm},{'full-width':$q.screen.lt.sm}]" rounded dense standout v-model="filter" ref="tagFilter" >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="column text-bold q-my-md" v-if="$q.screen.lt.sm">
          <label class="q-mt-md"> Tag Filter </label>
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
        </div>
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
          label: 'French',
          align: 'left',
          field: row => row.French,
          sortable:true
        },
        {
          name: 'English',
          label: 'English',
          align: 'left',
          field: row => row.English,
          sortable:true
        },
        {
          name: 'Tags',
          label: 'Tags',
          align: 'left',
          field: row => row.Tags,
        },
        {
          name: 'Level',
          label: 'Level',
          align: 'left',
          field: row => row.Level,
          sortable:true
        },
        {
          name: 'Audio',
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
    onLeft(details){
      console.log(details);
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
.custom-transition{
  transition: all .3s;
}
.dark-card{
  background-color: black;
}
</style>
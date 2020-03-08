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
  title="Treats"
  :data="data"
  :columns="columns"
  :filter="filter"
  row-key="name"
  selection="single"
  :selected.sync="selected"
  :sort-method="customSort"
  binary-state-sort
>
  <template v-slot:body="props">
    <q-tr :props="props">
      <q-td key="fr" :props="props">
        {{ props.row.fr }}
        <q-popup-edit v-model="props.row.fr">
          <q-input v-model="props.row.fr" dense autofocus counter />
        </q-popup-edit>
        </q-td>
      <q-td key="en" :props="props">
        {{ props.row.en }}
        <q-popup-edit v-model="props.row.en">
          <q-input v-model="props.row.en" dense autofocus counter />
        </q-popup-edit>
        </q-td>
      </q-tr>
    </template>
</q-table>
</q-page>
</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {
data(){
return {
    showAddItem: false,
    selected: [],
    loading: false,
    filter: '',
    rowCount: 100,
    columns: [
    {
      name: 'name',
      required: true,
      label: 'Sentence',
      align: 'left',
      field: row => row.fr,
      format: val => `${val}`,
      sortable: true
    },
    { name: 'en', label: 'en', field: 'en', align:'left', sortable: true },
    { name: 'concepts',
      required: true,
      label: 'Concepts',
      align: 'left',
      field: row => row.concepts,
      sortable: true},
    { name: 'button', label: 'button', sortable: false}
  ],
  data: [
  {selected:false, day:"001", type:"QNA", block_number:"001", name:"L001QNA001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"], concepts: ["present tense","question"]},
  {selected:false, day:"001", type:"MIP", block_number:"001", name:"L001MIP001", fr: "ça va", en: "It’s okay", words: ["ça", "va"], concepts: ["present tense"]},
  {selected:true,  day:"001", type:"MIP", block_number:"002", name:"L001MIP002", fr: "comment", en: "how", words: ["comment"], concepts: ["present tense"]},
  {selected:false, day:"001", type:"MIP", block_number:"003", name:"L001MIP003", fr: "très bien", en: "very good", words: ["très", "bien"], concepts: ["present tense"]},
  {selected:true,  day:"001", type:"MIP", block_number:"004", name:"L001MIP004", fr: "je vais", en: "I go", words: ["je", "vais"], concepts: ["present tense"]},
  {selected:false, day:"001", type:"MIP", block_number:"005", name:"L001MIP005", fr: "pas", en: "not", words: ["pas"], concepts: ["present tense"]},
  {selected:false, day:"001", type:"COM", block_number:"001", name:"L001COM001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"], concepts: ["present tense","question"]},
  {selected:false, day:"001", type:"COM", block_number:"002", name:"L001COM002", fr: "Je vais très bien", en: "I am doing very well", words: ["je", "vais", "très", "bien"], concepts: ["present tense"]},
  {selected:false, day:"001", type:"COM", block_number:"003", name:"L001COM003", fr: "Ça va pas très bien", en: "It’s not going very well", words: ["ça", "va", "pas", "très", "bien"], concepts: ["present tense"]},
  {selected:false, day:"001", type:"COM", block_number:"004", name:"L001COM004", fr: "Comment je vais ? Très bien .", en: "How am I doing ? Very well .", words: ["comment", "je", "vais", "très", "bien"], concepts: ["present tense"]},
  {selected:false, day:"001", type:"COM", block_number:"005", name:"L001COM005", fr: "Ça va bien ?", en: "Is it going well ?", words: ["ça", "va", "bien"], concepts: ["present tense"]},
  {selected:false, day:"002", type:"QNA", block_number:"001", name:"L002QNA001", fr: "Est-ce que tu parles français ?", en: "Do you speak French ?", words: ["est", "ce", "que", "tu", "parles", "français"], concepts: ["present tense","question"]},
  {selected:false, day:"002", type:"MIP", block_number:"001", name:"L002MIP001", fr: "Je parle français", en: "I speak French", words: ["je", "parle", "français"], concepts: ["present tense"]},
  {selected:false, day:"002", type:"MIP", block_number:"002", name:"L002MIP002", fr: "Tu parles", en: "You speak", words: ["tu", "parles"], concepts: ["present tense"]},
  {selected:false, day:"002", type:"MIP", block_number:"003", name:"L002MIP003", fr: "un peu", en: "a little", words: ["un", "peu"], concepts: ["present tense"]},
  {selected:false, day:"002", type:"MIP", block_number:"004", name:"L002MIP004", fr: "et toi", en: "and you", words: ["et", "toi"], concepts: ["present tense"]},
  {selected:false, day:"002", type:"MIP", block_number:"005", name:"L002MIP005", fr: "mais", en: "but", words: ["mais"]},
  {selected:false, day:"001", type:"COM", block_number:"005", name:"L001COM008", fr: "je vais", en: "I go", words: ["je", "vais"], concepts: ["present"]},
  {selected:true,  day:"002", type:"QNA", block_number:"001", name:"L002QNA028",fr: "je vais aller", en: "I will go", words: ["je","vais","aller"], concepts: ["futur proche"]},
  {selected:true,  day:"002", type:"MIP", block_number:"001", name:"L002MIP038", fr: "je vais y aller", en: "I will go there", words: ["je","vais","y","aller"], concepts: ["futur proche", "y"]},
  {selected:false, day:"002", type:"MIP", block_number:"002", name:"L002MIP048", fr: "je suis allé", en: "I went", words: ["je", "suis","allé"], concepts: ["passé composé", "auxiliaire être"]},
  {selected:true,  day:"002", type:"MIP", block_number:"003", name:"L002MIP058", fr: "j’y suis allé", en: "I went there", words: ["je","y","suis","aller"], concepts: ["passé composé", "auxiliaire être", "y"]},
  {selected:false, day:"002", type:"MIP", block_number:"004", name:"L002MIP068", fr: "j’y suis pas allé", en: "I haven’t been there", words: ["je","y","suis","pas","aller"], concepts: ["passé composé", "auxiliaire être", "y", "adverbe"]},
  {selected:false, day:"002", type:"MIP", block_number:"005", name:"L002MIP078", fr: "j’y suis pas encore allé", en: "I haven’t been there yet", words: ["je","y","suis","pas","encore","aller"], concepts: ["passé composé", "auxiliaire être", "y", "adverbe"]}
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
  ...mapGetters('items', ['items'])
},
components: {
'item' : require('components/List/Item.vue').default,
'add-item' : require('components/List/Modals/AddItem.vue').default,
'search' : require('components/List/Tools/Search.vue').default,
'no-items' : require('components/List/NoItems.vue').default
}
}
</script>


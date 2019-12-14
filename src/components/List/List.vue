<template>
  <div class="q-pa-md">
    <q-table
      title="Items"
      :data="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
      :selected.sync="selected"
      :filter="filter"
      :pagination.sync="pagination"
    >
    <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>

export default {
  data () {
    return {
        filter: '',
        pagination: {
            sortBy: 'name',
            descending: false,
            page: 1,
            rowsPerPage: 5
            // rowsNumber: xx if getting data from a server
            },
        selected: [],
        columns: [
            {
            name: 'index',
            label: '#',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true
            },
            { name: 'Day', align: 'center', label: 'Day', field: 'day', sortable: true },
            { name: 'Type', label: 'Type', field: 'type', sortable: true },
            { name: 'Name', label: 'Name', field: 'name', sortable: true},
            { name: 'English', label: 'English', field: 'en', sortable: true },
            { name: 'French', label: 'French', field: 'fr', sortable: true },
            { name: 'words', label: 'Words', field: 'words'},
      ],

    data: [{day:"001", type:"QNA", block_number:"001", name:"L001QNA001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"]},
      {day:"001", type:"MIP", block_number:"001", name:"L001MIP001", fr: "ça va", en: "It’s okay", words: ["ça", "va"]},
      {day:"001", type:"MIP", block_number:"002", name:"L001MIP002", fr: "comment", en: "how", words: ["comment"]},
      {day:"001", type:"MIP", block_number:"003", name:"L001MIP003", fr: "très bien", en: "very good", words: ["très", "bien"]},
      {day:"001", type:"MIP", block_number:"004", name:"L001MIP004", fr: "je vais", en: "I go", words: ["je", "vais"]},
      {day:"001", type:"MIP", block_number:"005", name:"L001MIP005", fr: "pas", en: "not", words: ["pas"]},
      {day:"001", type:"COM", block_number:"001", name:"L001COM001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"]},
      {day:"001", type:"COM", block_number:"002", name:"L001COM002", fr: "Je vais très bien", en: "I am doing very well", words: ["je", "vais", "très", "bien"]},
      {day:"001", type:"COM", block_number:"003", name:"L001COM003", fr: "Ça va pas très bien", en: "It’s not going very well", words: ["ça", "va", "pas", "très", "bien"]},
      {day:"001", type:"COM", block_number:"004", name:"L001COM004", fr: "Comment je vais ? Très bien .", en: "How am I doing ? Very well .", words: ["comment", "je", "vais", "très", "bien"]},
      {day:"001", type:"COM", block_number:"005", name:"L001COM005", fr: "Ça va bien ?", en: "Is it going well ?", words: ["ça", "va", "bien"]},
      {day:"002", type:"QNA", block_number:"001", name:"L002QNA001", fr: "Est-ce que tu parles français ?", en: "Do you speak French ?", words: ["est", "ce", "que", "tu", "parles", "français"]},
      {day:"002", type:"MIP", block_number:"001", name:"L002MIP001", fr: "Je parle français", en: "I speak French", words: ["je", "parle", "français"]},
      {day:"002", type:"MIP", block_number:"002", name:"L002MIP002", fr: "Tu parles", en: "You speak", words: ["tu", "parles"]},
      {day:"002", type:"MIP", block_number:"003", name:"L002MIP003", fr: "un peu", en: "a little", words: ["un", "peu"]},
      {day:"002", type:"MIP", block_number:"004", name:"L002MIP004", fr: "et toi", en: "and you", words: ["et", "toi"]},
      {day:"002", type:"MIP", block_number:"005", name:"L002MIP005", fr: "mais", en: "but", words: ["mais"]}
]
    }
  },
    methods: {
        getSelectedString () {
            return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.sentences.length}`
        }
    }
}
</script>


<style lang="sass">

</style>
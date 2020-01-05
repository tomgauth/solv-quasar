<template>
<q-card class="my-card" align="center">
      <q-card-section> 
        {{itemToRepeat.en}}
      </q-card-section>
      <a v-for="(word, key) in wordsPrompt"
        :key="key">
        <q-chip
        v-if="wordsAnswer.includes(word)"
          class="ma-2"
          color="green"
          text-color="white">
          
          {{word}}
        </q-chip>
        <q-chip v-else-if="!wordsAnswer.includes(word)"
        class="ma-2">...</q-chip>
      </a>
      <q-card-section class="q-pa-md">

      <div class="q-gutter-md" style="max-width: 300px">
        <q-input v-model="Answer" label="Answer" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">
             
            </div>
          </template>
        </q-input>
      </div>
      </q-card-section>
      <q-card-actions align="around" >
        <q-btn color="amber" @click="nextSentence()"  label="Next Sentence" />
        <q-btn color="amber" @click="updateItem({ id: arrayOfItems.filter(item => item[1].selected)[itemIndex][0] , updates: { selected: false } } )" label="Unselect"/>
      </q-card-actions>
    </q-card>

</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: ['item', 'id'],
  name: 'lesson-test',
  data: () => ({
    activeClass: "green--text",
    itemIndex: 0,
    Answer: "",
    toggle: false,
  }),
  watch: {
        Answer: function () {
        if ((JSON.stringify(this.wordsPrompt) === JSON.stringify(this.wordsAnswer))) {   
          // show all words in green, then success
          setTimeout(this.success, 500)  
        }
    }
  },
  computed: {
    ...mapGetters('items', ['items', 'arrayOfItems', 'getItemByName']),
    ...mapState('items', ['items', 'itemIndex']),
    itemToRepeat: {
      get() {
        //console.log("item: ", Object.entries(this.selectedItems)[this.itemIndex][1])

        return this.arrayOfItems.filter(item => item[1].selected)[this.itemIndex][1]
				}
    },
    wordsPrompt:  {
      get() {
        // return [ "je", "vais", "très", "bien" ]
        return this.itemToRepeat.fr.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\_`~()]/g,"").replace(/\s+/g, " ").split(' ').filter(String)
        
       }
    },
    wordsAnswer: {
     get() {       
        return this.Answer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"").replace(/\s+/g, " ").split(' ')
      }
    }
  },
  methods: {
    ...mapActions('items', ['updateItem', 'incrementIndex']),
    nextSentence: function () {
      //if no nextSentence, session is done
      let selectedItems = this.arrayOfItems.filter(item => item[1].selected)
      console.log("selectedItems: ",selectedItems)
      console.log('itemToRepeat: ', Object.entries(selectedItems)[this.itemIndex][1])
      let length = selectedItems.length
      console.log('length: ',length) 
      console.log('itemIndex: ',this.itemIndex)
      
      this.Answer = ""
      if (this.itemIndex < length - 1) {
        //this.itemIndex = this.itemIndex + 1
        this.itemIndex += 1
        } else {
          this.itemIndex = 0
          this.$q.dialog({
            title: "confirm",
            message: "You're done for today!",
            cancel: true,
            persistent: true,
            }).onOk(() => {
              console.log('>>>> OK')
              // todo: redirect to pick items page

            })
          // implement a modal / alert to say that the session is done
        }
    },
    success: function () {
      // show success
      this.$q.notify({
        message: 'Correct answer',
        color: 'secondary'
      })
    }
  }

}

</script>
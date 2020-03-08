<template>
<q-card class="q-pt-md" align="center">

  {{arrayOfWords}}
      <q-btn
      round
      color="deep-orange"
      @click="playAudio(itemToRepeat.name);"
      icon="play_arrow"
      />
      <p>
        <q-btn color="secondary" label="Show Answer" v-on:click="showAnswer = !showAnswer" />
      </p>
        {{selectedWords}} 
      <q-card-section v-if="showAnswer" class="q-pa-md">     


      <div class="q-gutter-md" style="max-width: 500px">
        <a v-for="(word, key) in wordsPrompt"
          :key="key">
          <q-chip v-if="!selectedWords.includes(word)"
            clickable 
            @click="addToSelected(word)"
            class="ma-2"
            color="green"
            text-color="white">
            
            
            {{word}}
          </q-chip>
          <q-chip v-else
            clickable
            @click="removeToSelected(word, key)"
            class="ma-2"
            color="red"
            text-color="white">
            
            
            {{word}}
          </q-chip>
      </a>
      {{selectedWords}}
      </div>
      </q-card-section>
      <q-card-actions align="around">

      </q-card-actions>
    </q-card>

</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { firebaseStorage } from '../../boot/firebase'

export default {
  props: ['item', 'id'],
  name: 'comprehension',
  data: () => ({
    selectedWords: [],
    storageRef: firebaseStorage.ref(),
    activeClass: "green--text",
    itemIndex: 0,
    showAnswer: false,
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
    ...mapGetters('words', ['words', 'arrayOfWords', 'getWordByName']),
    ...mapState('items', ['items', 'itemIndex']),
    itemToRepeat: {
      get() {
        //console.log("item: ", Object.entries(this.selectedItems)[this.itemIndex][1])
        return this.arrayOfItems.filter(item => item[1].selected)[this.itemIndex][1]
				}
    },
    wordsPrompt:  {
      get() {
        return this.itemToRepeat.words
        //return this.itemToRepeat.fr.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\_`~()]/g,"").replace(/\s+/g, " ").split(' ').filter(String)
        
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
    removeToSelected: function (selectedWord, key) {
      console.log('selectedWords: ', selectedWords, 'key: ', key)
      this.selectedWords.filter(key, 1)
      // push to the user's difficult words to understand
    },
    addToSelected: function (selectedWord) {
      console.log('selectedWords :' , arrayOfWords)

      this.arrayOfWords.push(selectedWord)
      // push to the user's difficult words to understand
    },
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
    },
    playAudio (itemID) {
      this.storageRef.child('ID'+itemID+'.mp3').getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'
        console.log(url)
        var audio = new Audio(url)
        audio.play()
        }).catch(function(error) {
      // Handle any errors
      });
    },
  }

}

</script>
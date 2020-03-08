<template>
<q-card class="q-pt-md" align="center">
  
  <div class="voice interface">
      <q-btn
      :loading="loading"
      :percentage="percentage"
      round
      color="deep-orange"
      @click="start()"
      icon="play_arrow"
      />
      </div>
    </q-card>

</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { firebaseStorage } from '../../boot/firebase'

export default {
  props: ['item', 'id'],
  name: 'audio-only',
  data: () => ({
    storageRef: firebaseStorage.ref(),
    itemIndex: 0,
    Answer: "",
    toggle: false,
  }),
  components: {
    'comprehension' : require('components/Lesson/Comprehension.vue').default,
    'search' : require('components/List/Tools/Search.vue').default
  },
  computed: {
    ...mapGetters('items', ['items', 'arrayOfItems', 'getItemByName']),
    ...mapState('items', ['items', 'itemIndex']),
    itemToRepeat: {
      get() {
        //console.log("item: ", Object.entries(this.selectedItems)[this.itemIndex][1])

        return this.arrayOfItems.filter(item => item[1].selected)[this.itemIndex][1]
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
    },
    start () {
        this.playAudio(this.itemToRepeat.name)
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
      this.nextSentence()
    },
  }

}

</script>
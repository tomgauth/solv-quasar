<template>
    <q-btn
        round
        color="deep-orange"
        @click="playAudio(audio);"
        icon="play_arrow"
        />
</template>




<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { firebaseStorage } from '../../boot/firebase'
const moment = require('moment');

export default {
    props: ['audio', 'id'],
    data () {
      return{
        moment,
        storageRef: firebaseStorage.ref(),
        loading: false,
        percentage: 0,
      }
    },
    methods: {
      ...mapActions('items', ['updateItem', 'deleteItem']),
      	playAudio (audio_url) {
          console.log(audio_url)
          var audio = new Audio(audio_url)
          audio.addEventListener('loadedmetadata', function(){
            // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
            var duration = audio.duration;

            // example 12.3234 seconds
            console.log("The duration of the song is of: " + duration + " seconds");
            // Alternatively, just display the integer value with
            // parseInt(duration)
            // 12 seconds
        },false);
          
          audio.play().catch(function(error) {
            console.error()
          });
        }
    }
}
</script>


<style scoped>

</style>
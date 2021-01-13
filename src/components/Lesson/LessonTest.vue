<template>

<q-card class="q-pt-md" align="center">
  <div>
    <p>{{lessonItems}}</p>
    <q-btn
      class="ma-2"
      color="green"
      label="index +3 ()"
      @click="increaseIndex()"
    />
    <p>0/{{numberOfItemsToReview}}</p>
  </div>

  <div class="q-pa-md">
    <q-linear-progress stripe rounded size="20px" :value="progress" color="green" class="q-mt-sm" />
  </div>

  <div class="voice interface">
  
      <q-card-section> 
        <h4>{{itemToRepeat.en}}</h4>
        
        <p>Next review is due {{moment(itemToRepeat.date, "").calendar()}}</p>
        

      </q-card-section>
      <a v-for="(word, key) in wordsPrompt"
        :key="key">
        <q-chip v-if="wordsAnswer.includes(word)"
            class="ma-2"
            color="green"
            text-color="white">
            {{word}}</q-chip>

        <q-chip v-else-if="!wordsAnswer.includes(word) && Answer==''"
            class="ma-2">...</q-chip>
        <q-chip v-else-if="!wordsAnswer.includes(word) && !Answer==''"
            class="ma-2" color="red">???</q-chip>
      </a>
      <q-card-actions align="around">
        <q-btn focus 
          size="xl"
          color="red" icon="mic" round push
          @mousedown="start(); startRecording();"
          @mouseup="endSpeechRecognition(); endRecording();"
          ></q-btn> 
      </q-card-actions>
      <q-card-actions align="around">  
        <q-btn 
          v-if="Answer" 
          round 
          color="secondary" 
          icon="play_arrow"
          @click="audioPlay(itemToRepeat.student_audio_url)"
        /> 
        <q-btn
          v-if="Answer == itemToRepeat.fr"
          :loading="loading"
          :percentage="percentage"
          border
          round
          color="green"
          @click="audioPlay(itemToRepeat.audio_url);"
          icon="hearing"
        />
      </q-card-actions>
      <q-card-actions v-if="Answer" align="around" >
        <q-btn
          color="blue"
          label="show answer"
          @click="showAnswer"
          ></q-btn>        
        <q-btn color="red" @click="increaseIndex();schedule({id: itemToRepeatID, updates: { date: itemToRepeat.state, grade: 'bad' } })" icon="clear" label="wrong" />
        <q-btn color="yellow" @click="increaseIndex();schedule({id: itemToRepeatID, updates: { date: itemToRepeat.state, grade: 'ok' } })" label="ok" />
        <q-btn color="green" @click="schedule({id: itemToRepeatID, updates: { date: itemToRepeat.state, grade: 'good' } })"  icon="done" label="good" />        
      </q-card-actions>
      </div>
    </q-card>

</template>
<script>
let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = SpeechRecognition ? new SpeechRecognition() : false;

const { detect } = require('detect-browser');
const browser = detect();
const moment = require('moment');

import { mapState, mapActions, mapGetters } from 'vuex'
import { firebaseStorage } from '../../boot/firebase'
import firebase from 'firebase';
import {date} from 'quasar'


export default {
  props: ['item', 'id'],
  name: 'lesson-test',
  data: () => ({
    numberOfItemsToReview: 1,
    loading: false,
    percentage: 0,
    storageRef: firebaseStorage.ref(),
    activeClass: "green--text",
    Answer: " ",
    toggle: false,
    browser,
    moment,
    isRecording: false,
    audioRecorder: null,
    recordingData: [],
    dataUrl: '',
    uploadValue: 0,
    recordingData: [],
    finalTranscript: "",
    sourceLanguage: "",
    recognitionLang: "fr-FR",
    targetLanguage: "fr",
    toggle: false,
    voice: "French Female",
  }),
  components: {
    'comprehension' : require('components/Lesson/Comprehension.vue').default,
    'search' : require('components/List/Tools/Search.vue').default
  },
  watch: {
        Answer: function () {
          console.log('Date(this.itemToRepeat.next_review) : ',Date.parse(this.itemToRepeat.next_review))
          console.log('time : ', Date(this.itemToRepeat.next_review)-Date.parse(Date.now()))
        if ((JSON.stringify(this.wordsPrompt) === JSON.stringify(this.wordsAnswer))) {   
          // show all words in green, then success
          
          setTimeout(this.success, 500)  
        }
    },
  dataUrl() {
    console.log('dataUrl: ', this.dataUrl)
    this.togglePlay()
    // if (this.modelType && this.modelId) {
    this.submitRecording()
			// }
		}
  },
  computed: {
    ...mapGetters('items', ['items', 'arrayOfItems','lessonItems', 'getItemByName', 'dueItems']),
    ...mapState('items', ['items']),

    progress: function() {
      
      let status = (this.itemIndex)/this.numberOfItemsToReview
      if (status == 0 ) {
        return 0.05
      } else {
        return status
      }
    },
    sessionItems : {
      get() {
        console.log('moment : ', moment())
        console.log('is it due? ', moment(this.lessonItems[0][1].date) <= moment())
        console.log('sessionItems', this.lessonItems.filter(item => item[1].selected || moment(item[1].date) <= moment()))  
             var i
             for (i = 0; i < this.lessonItems.length; i++) {
              this.lessonItems[i][1].review_index = i
              console.log("lessonItems[i][1].review_index : ", this.lessonItems[i][1].review_index)
             }
        return this.lessonItems.filter(item => item[1].selected)
      }
    },
    itemToRepeat: {
      get() {
        console.log('lessonItems: ', this.lessonItems)
        console.log('arrayOfItems: ', this.arrayOfItems)
        console.log('itemToRepeat: ', this.arrayOfItems.filter(item => item[1].selected)[0][1])
        return this.sessionItems[0][1]
				}
    },
    itemToRepeatID: {
          get(){
            console.log('this.arrayOfItems.filter(item => item[1].selected)[itemIndex][0] : ',this.arrayOfItems.filter(item => item[1].selected)[0][0])
            return this.arrayOfItems.filter(item => item[1].selected)[0][0]
          }
        },
    wordsPrompt:  {
      get() {
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
    ...mapActions('items', ['updateItem', 'increaseIndex', 'selectDueItems']),
    ...mapActions('srs', ['increaseInterval','log', 'schedule']),
    showAnswer() {
      this.Answer = this.itemToRepeat.fr
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
      if (this.itemIndex < length) {
        this.incrementIndex()
        //this.itemIndex += 1
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
    startSpeechRecognition: function() {

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = this.recognitionLang;
      console.log(recognition.lang);
      console.log(recognition);
      this.toggle = true;

      recognition.onresult = event => {
        let interimTranscript = "";
        for (
          let i = event.resultIndex, len = event.results.length;
          i < len;
          i++
        ) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        this.Answer = interimTranscript.toLowerCase();
      };
      console.log('recognition started: ', recognition.continuous)
        recognition.start();
    },
    endSpeechRecognition: function() {
      recognition.stop();
      console.log('end speech recognition')
      this.toggle = false;
    },
    start: function() {
      this.startSpeechRecognition();
    },
    read: function() {
      console.log(this.voice);
      return new Promise(resolve => {
        responsiveVoice.cancel();
        console.log(this.voice + this.currentSentence.fr);
        responsiveVoice.speak(this.currentSentence.fr, this.voice);
      });
    },
    startRecording() {
      this.isRecording = true
      this.recordingData = []
      this.dataUrl = ''
      console.log('dataUrl: ', this.dataUrl)
      var that = this;
      console.log('nav: ', navigator)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia;
      navigator.getUserMedia({
        audio: true,
        video: false
      }, function (stream) {
        // that.stream = stream;
        that.audioRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
          // audioBitsPerSecond: 96000
        });
        that.audioRecorder.ondataavailable = function(event) {
          that.recordingData.push(event.data);
          console.log('event.data: ', event.data)
        }
        that.audioRecorder.onstop = function(event) {
          console.log('Media recorder stopped');
          console.log('that.recordingData: ', that.recordingData)
          var blob = new Blob(that.recordingData, { type: 'audio/webm'});
          console.log('blob: ', this.blob)
          that.dataUrl = window.URL.createObjectURL(blob);
          console.log('dataUrl: ', this.dataUrl)
        }
        that.audioRecorder.start();
        // console.log('Media recorder started');
      }, (error) => {
        // console.log(error)
        this.isRecording = false
      });
    },
    endRecording() {
      this.isRecording = false
      if (this.audioRecorder) {
        this.audioRecorder.stop();
      }
    },
    togglePlay() {
      var audio = new Audio();
      audio.src = this.dataUrl
      if (audio.paused === false) {
        audio.pause();
      } else {
        audio.play();
      }
    },
    audioPlay(url) {
      var audio = new Audio();
      audio.src = url
      if (audio.paused === false) {
        audio.pause();
      } else {
        audio.play();
      }
    },
        async submitRecording() {
        console.log("submit Recording")
        var blob = new Blob(this.recordingData , { type: 'audio/webm'});
        console.log('blob: ',{blob});
        console.log('itemToRepeat.student_audio_urlr: ',this.itemToRepeat.student_audio_url)
        let fileName = Date.now();
        console.log('fileName: ', fileName)
        const storageRef = firebase.storage().ref().child(`${fileName}`).put(blob)
        console.log('storageRef: ',storageRef)
        // storageRef = storageRef.put(blob)
        // console.log('storageRef.put(blob): ', storageRef)

        storageRef.on(`state_changed`,snapshot=>{
            this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          }, error=>{console.log('error: ',error.message)},
          ()=>{
            this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url)=>{ 
              this.itemToRepeat.student_audio_url = url;
              console.log('this.itemToRepeat.student_audio_url : ',this.itemToRepeat.student_audio_url)
              this.$emit('update:this.itemToRepeat.student_audio_url', url) // this.audio_url
              console.log('url: ', url)
            });
          }
      )
    },
  },
  mounted: function () {
    this.numberOfItemsToReview = this.arrayOfItems.filter(item => item[1].selected).length
  }
}

</script>
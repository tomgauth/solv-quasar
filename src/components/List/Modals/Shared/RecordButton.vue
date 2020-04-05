<template>
              <q-btn 
			  		 push
			  		 color="red" label="record" 
                     @mousedown="startRecording"
                     @mouseup="endRecording"
                     ></q-btn>
					 
</template>

<script>
const { detect } = require('detect-browser');
const browser = detect();
import { mapActions, mapGetters } from 'vuex'
import firebase from 'firebase';

export default {
	props: ['audio_url'],
    data () {
		return {
			browser,
			isRecording: false,
			audioRecorder: null,
			recordingData: [],
			dataUrl: '',
			uploadValue: 0,
		}
	},
	watch: {
		dataUrl() {
			console.log('dataUrl: ', this.dataUrl)
			this.togglePlay()
			// if (this.modelType && this.modelId) {
			this.submitRecording()
			// }
		}
	},
	methods: {
    startRecording() {
      this.isRecording = true
      this.recordingData = []
      this.dataUrl = ''
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
        }
        that.audioRecorder.onstop = function(event) {
          // console.log('Media recorder stopped');
          var blob = new Blob(that.recordingData, { type: 'audio/webm'});
          that.dataUrl = window.URL.createObjectURL(blob);
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
    removeRecording() {
    },
    togglePlay() {
      var audio = new Audio();
      audio.src = this.dataUrl
      if (audio.paused === false) {
        audio.pause();
      } else {
        audio.play();
      }
      // var audioElement = this.$refs.audio
      // if (audioElement.paused === false) {
      //   audioElement.pause();
      // } else {
      //   audioElement.play();
      // }
    },
    audioPlay() {
      var audio = new Audio();
      audio.src = this.dataUrl
      if (audio.paused === false) {
        audio.pause();
      } else {
        audio.play();
      }
    },
    async submitRecording() {
	  var blob = new Blob(this.recordingData , { type: 'audio/webm'});
    console.log({blob});
    console.log('this.audio_ulr: ',this.audio_url)
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
		  this.audio_url = url;
		  this.$emit('update:audio_url', url) // this.audio_url
		  console.log('url: ', url)
        });
      }
      );
      // formData.append('audio[file]', blob);
      // formData.append('audio[duration]', duration);
      // formData.append(this.modelType.toLowerCase(), this.modelId);
      // formData.append('audio[filename]', (this.text || 'file').toLowerCase().replace(/[\s?!'"]+/g, '_'));
      //this.$http.post(`/audios`, formData).then( (res) => {
      //  this.$emit('audio-created', res.body.data.attributes)
      //})
    },
    downloadWithVueResource() {
      this.$http({
        method: 'get',
        url: this.dataUrl,
        responseType: 'arraybuffer'
      })
        .then(response => {
        this.forceFileDownload(response)  
      })
        .catch(() => console.log('error occured'))

    },
    forceFileDownload(response){
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'recording.webm') //or any other extension
      document.body.appendChild(link)
      link.click()
    }

		},
    components:{ 
    },
    mounted() {
    }
}
</script>

<style>
</style>
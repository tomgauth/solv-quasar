<template>
  <div>
    <div >
      <p>Upload an audio to Firebase:</p>
      <input type="file" @change="previewAudio" accept="audio/*" >
    </div>
    <div>
      <!-- <p>Progress: {{uploadValue.toFixed()+"%"}}
      <progress id="progress" :value="uploadValue" max="100" ></progress>  </p> -->
    </div>
    <div v-if="audioData!=null">
        <img class="preview" :src="picture">
        <br>
      <button @click="onUpload">Upload</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import { firebaseStorage } from './boot/firebase'

export default {
  name: 'Upload',
  data(){
	return{
      audioData: null,
      picture: null,
      uploadValue: 0
	}
  },
  methods:{
    previewAudio(event) {
      this.uploadValue = 0;
      this.picture = null;
      this.audioData = event.target.files[0];
    },

    onUpload(){
      this.picture=null;
      const storageRef = firebaseStorage.ref(`${this.audioData.name}`).put(this.audioData);
      storageRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error=>{console.log(error.message)},
      ()=>{this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url)=>{
          this.picture =url;
        });
      }
      );
    }

  }
}
</script>

<style>

</style>
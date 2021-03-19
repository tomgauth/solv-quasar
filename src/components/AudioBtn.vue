<template>
     <q-btn :size="size" @click="togglePlay" round color="black" :disable="buffering" :icon="!playing ? 'play_arrow' : 'stop'" />
</template>
<script>
import tts from '../store/services/googleTTS.service'
import { googleTTSVoicesConfig } from '../app.constants'

export default {
    data(){
        return{
            playing:false,
            audio:new Audio(),
            buffering:false
        }
    },
    methods:{
        async togglePlay(){

            if(!this.audio.src){
                
                this.buffering = true;
                if(!this.audioUrl.synthetic){
                var blob = await this.$axios.get(this.audioUrl.src,{ responseType:'blob' });
                 this.audio.src = await URL.createObjectURL(blob.data);
                } 
                else {
                //  this.audio.src = await URL.createObjectURL(this.audioUrl.src);
                //add french google TTS audio
                var resp = await tts.getAudio(this.french,googleTTSVoicesConfig.french);
                const base64resp = await fetch(`data:audio/mp3;base64,${resp.data.audioContent}`);
                const src = await base64resp.blob();
                const uri = URL.createObjectURL(src);
                this.audio.src = uri;
                }
                this.buffering = false;
            }
            this.playing ? this.audio.pause() : this.audio.play();
        }
    },
    props:{
        audioUrl:{
            type:Object,
            required:true
        },
        size:{
            type:String
        },
        french:{
            required:true
        }
    },
    mounted(){
            this.audio.addEventListener('playing',() => this.playing = true);
            this.audio.addEventListener('ended',() => this.playing = false);
            this.audio.addEventListener('pause',() => this.playing = false);
    }
}
</script>

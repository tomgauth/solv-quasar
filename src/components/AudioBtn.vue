<template>
     <q-btn :size="size" @click="togglePlay" round color="black" :disable="buffering" :icon="!playing ? 'play_arrow' : 'stop'" />
</template>
<script>
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
                var blob = await this.$axios.get(this.audioUrl,{ responseType:'blob' });
                this.audio.src = await URL.createObjectURL(blob.data);
                this.buffering = false;
            }
            this.playing ? this.audio.pause() : this.audio.play();
        }
    },
    props:{
        audioUrl:{
            type:String,
            required:true
        },
        size:{
            type:String
        }
    },
    mounted(){
            this.audio.addEventListener('playing',() => this.playing = true);
            this.audio.addEventListener('ended',() => this.playing = false);
            this.audio.addEventListener('pause',() => this.playing = false);
    }
}
</script>

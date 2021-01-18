<template>
  <q-page padding class="row justify-center items-center">
    <q-card class="q-pa-lg learn-card column">
      <q-card-section style="margin:auto 0" class="row items-center justify-center">
        <div class="col-12 text-center">
          <span class="text-h4">{{ totalPhrasesPlayed }}<span class="text-h4">/</span>{{ playlistLength }}</span>
        </div>
        <div class="col-12 q-my-lg">
          <q-linear-progress stripe :query="querying" rounded size="10px" color="primary" track-color="tertiary" :value="progressVal" class="q-mt-md" />
        </div>
        <div class="col-12 ">
          <q-tabs
            v-model="tab"
            no-caps
            narrow-indicator
            align="justify"
            class="text-primary "
          >
            <q-tab name="fr" label="French" />
            <q-tab name="en" label="English" />
          </q-tabs>
          <div class="text-center q-pt-md row ">
            <div class="col-6 q-pa-sm">
              <span :class="{'text-subtitle2':true,'text-grey':tab != 'fr'}">{{ frPhrase }}</span>
            </div>
            <div class="col-6 q-pa-sm">
              <span :class="{'text-subtitle2':true,'text-grey':tab != 'en'}">{{ enPhrase }}</span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="text-center q-gutter-sm btn-container">
        <div v-if="playing && (totalPhrasesPlayed != playlistLength)">
          <q-btn @click="pause" :disable="querying" round color="black" class="q-pa-sm" text-color="white" unelevated  icon="pause" />
        </div>
        <div class="q-gutter-sm" v-if="!playing">
          <q-btn @click="play()"  round color="black" class="q-pa-sm" text-color="white" unelevated  icon="play_arrow" />
          <q-btn  @click="abort()" round color="black" class="q-pa-sm" text-color="white" unelevated  icon="stop" />
        </div>
        <div v-if="totalPhrasesPlayed == playlistLength">
          <q-btn @click="replayPlaylist()" round color="black" class="q-pa-sm" text-color="white" unelevated  icon="replay" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { firebaseStorage } from '../../src/boot/firebase';
import { mapState, mapActions, mapGetters } from 'vuex';
import { interTypeEnum,audioStatusEnum } from '../app.constants';

export default {
  // name: 'PageName',
  data(){
    return {
      querying: false,
      playing: true,
      audio: new Audio(),
      tab:"fr",
      frPhrase:"French Phrase",
      enPhrase:"English Translation"
    }
  },
  methods:{
    ...mapActions('playlist', ['setAudioStatus','setCurrentActive','setStatusPendingAll']),
    async initializePlaylist(){
      this.querying = true;
      await this.$store.dispatch("playlist/populateCurrentQueue");
      this.querying = false;
      this.playPlaylist();
    },
    replayPlaylist(){
      this.setStatusPendingAll();
      this.playPlaylist();
    },
    async playPlaylist(){
      var currentActiveIndex = this.currentQueue.findIndex(phrase => {
        console.log(phrase[0] == this.currentActiveId);
        return phrase[0] == this.currentActiveId;
      });
      currentActiveIndex = (currentActiveIndex == -1) || (currentActiveIndex == null) ? 0 : currentActiveIndex;
      for (let index = currentActiveIndex; index < this.currentQueue.length; index++) {
        const phrase = this.currentQueue[index];
        this.setCurrentActive(phrase[0]);
        this.setAudioStatus({ phraseId:phrase[0],status:audioStatusEnum.playing });
        await this.playPhrase(phrase);
        this.setAudioStatus({ phraseId:phrase[0],status:audioStatusEnum.played });
        this.setCurrentActive(null);
        //gap delay
        await new Promise(resolve => setTimeout(resolve,2000));
      }
    },
    async playPhrase(phrase){
      // depending on mode of playing
      return new Promise(async (resolve,reject) => {
        // french phrase
        this.tab="fr";
        this.frPhrase = phrase[1].fr;
        await this.playSubPhrase(phrase[1].mergedSequence.frAudioURL);
        // intermediate
        var interSettings = this.getIntermediateSettings;
        if ( interSettings.type == interTypeEnum.pause)
        await new Promise(resolve => setTimeout(resolve,interSettings.pauseSeconds * 1000));
        // english phrase
        this.tab = "en";
        this.enPhrase = phrase[1].en;
        await this.playSubPhrase(phrase[1].mergedSequence.frAudioURL);
        resolve();
      });
    },
    async playSubPhrase(audioURL){
      if(this.audio == null)
      return;
      this.audio.src = audioURL;
      return new Promise((resolve,reject)=>{
      this.audio.addEventListener('ended',() => resolve());
      this.audio.play();
      });
    },
    pause(){
      this.audio.pause();
      this.playing = false;
    },
    play(){
      this.playing = true;
      this.audio.play();
    },
    abort(){
      this.$router.push("/");
    }
  },
  computed:{
    ...mapGetters('items', ['items', 'arrayOfItems', 'getItemByName', 'dueItems']),
    ...mapGetters('playlist', ['getPlayedPhrases','getIntermediateSettings']),
    ...mapState('playlist', ['currentQueue','currentActiveId']),
    progressVal(){
      var playlistLength = this.currentQueue.length;
      var playedPhrasesLength = this.getPlayedPhrases.length;
      return playlistLength == 0 || playedPhrasesLength == 0 ? 0 : playedPhrasesLength / playlistLength;
    },
    totalPhrasesPlayed(){
      return this.getPlayedPhrases.length;
    },
    playlistLength(){
      return this.currentQueue.length;
    }
  },
  mounted(){
    this.currentActiveId == null ? this.initializePlaylist() : this.playPlaylist();
  },
  beforeDestroy(){
    this.audio = null;
  }
}
</script>

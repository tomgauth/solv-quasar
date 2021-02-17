<template>
  <q-page class="flex flex-center">
      <q-card class="q-pa-lg learn-card column">
        <q-card-section class="row justify-center">
          <h6 class="text-h5 q-my-lg">Settings</h6>
        </q-card-section>
        <q-card-section class="row items-center ">
          <div class="col-4">
            <span class="text-subtitle2">
              Pause Time
            </span>
          </div>
          <div class="col-8 row justify-between items-center">
            <div class="col-7 q-mx-md">
              <q-slider @change="pauseTimeUpdate" v-model="pauseTime" :min="0" :max="5"/>
            </div>
            <div class="col text-center">
              <span class="text-subtitle2">
              {{ settings ? settings.pauseSeconds : 0 }} secs
              </span>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row items-center ">
          <div class="col-4">
            <span class="text-subtitle2">
              French repetitions
            </span>
          </div>
          <div class="col-8 row justify-between items-center">
            <div class="col-7 q-mx-md">
              <q-slider @change="frRepUpdate"  v-model="frReps" :min="0" :max="5"/>
            </div>
            <div class="col text-center">
              <span class="text-subtitle2">
              {{ settings ? settings.frenchRepetitions : 0 }}x
              </span>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row items-center ">
          <div class="col-4">
            <span class="text-subtitle2">
              English repetitions
            </span>
          </div>
          <div class="col-8 row justify-between items-center">
            <div class="col-7 q-mx-md">
              <q-slider @change="enRepUpdate"  v-model="enReps" :min="0" :max="5"/>
            </div>
            <div class="col text-center">
              <span class="text-subtitle2">
              {{ settings ? settings.englishRepetitions : 0 }}x
              </span>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row items-center">
          <div class="col-4">
            <span class="text-subtitle2">
              Learning mode
            </span>
          </div>
          <div class="col row ">
              <q-option-group
                :options="options"
                label="Learning mode"
                type="radio"
                v-model="mode"
                @input="modeSelect"
              />
          </div>
        </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import { learningMode, repetitionType } from '../app.constants'
import { mapGetters,mapActions } from 'vuex'

export default {
  data(){
    return{
      pauseTime:null,
      settings:null,
      frReps:null,
      enReps:null,
      mode:null,
      options: [
        { label: 'Comprehension', value: learningMode.comprehension },
        { label: 'Recall', value: learningMode.recall },
        { label: 'Listen & Repeat', value: learningMode.listenRepeat }
      ]
    }
  },
  methods:{
    ...mapActions('playlist', ['setRepetitions','setPauseTime','setMode','setInterTrackPause']),
    modeSelect(val){
      this.setMode(val);
    },
    pauseTimeUpdate(val){
      this.setPauseTime(val);
    },
    frRepUpdate(val){
      this.setRepetitions({ type: repetitionType.french ,value: val });
    },
    enRepUpdate(val){
      this.setRepetitions({ type: repetitionType.english ,value: val });
    }
  },
  computed:{
    ...mapGetters('playlist', ['getSettings']),
  },
  mounted(){
    this.settings = this.getSettings;

    this.mode = this.settings.learningMode;
    this.pauseTime = this.settings.pauseSeconds;
    this.frReps = this.settings.frenchRepetitions;
    this.enReps = this.settings.englishRepetitions;
  }
}
</script>

<style lang="sass" scoped>
</style>
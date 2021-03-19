import axios from 'axios';
import tts from './services/googleTTS.service'
import { audioStatusEnum,interTypeEnum,learningMode,repetitionType,googleTTSVoicesConfig } from '../app.constants';


const state = {
    lessonStarted:false,
    currentQueue:[],
    currentActiveId:null,
    settings:{
            type:interTypeEnum.pause,
            pauseSeconds:1,
            interTrackPauseSeconds:0.5,
            learningMode: learningMode.comprehension,
            interTrackURL:null,
            frenchRepetitions:1,
            englishRepetitions:1
    }
}

const mutations = {
    currentQueuePopulated(state,payload)
    {
        state.currentQueue = payload;
    },
    audioStatusSet(state,{ phraseId,status }){
        var phrase = state.currentQueue.find(phrase =>  phrase.id == phraseId );
        phrase.fields.status = status;
    },
    currentActiveSet(state,payload){
        state.currentActiveId = payload;
    },
    statusPendingAll(state){
        state.currentQueue.forEach(phrase => {
            phrase.fields.status = audioStatusEnum.pending;
        });
    },
    lessonStatusChanged(state,payload){
        state.lessonStarted = payload;
    },
    currentQueueCleared(){
        state.currentQueue = [];
    },
    repetitionSet(state,payload){
        if(payload.type == repetitionType.english)
            state.settings.englishRepetitions = payload.value;
        else if(payload.type == repetitionType.french)
            state.settings.frenchRepetitions = payload.value;
    },
    pauseTimeSet(state,payload){
        state.settings.pauseSeconds = payload;
    },
    interTrackPauseTimeSet(state,payload){
        state.settings.interTrackPauseSeconds = payload;
    },
    modeSet(state,payload){
        state.settings.learningMode = payload;
    }
}

const actions = {
  setCurrentActive({ commit },payload){
        commit('currentActiveSet',payload);
  },
  setAudioStatus({ commit },payload ){
        commit('audioStatusSet',payload);
    },
  setStatusPendingAll({ commit }){
        commit('statusPendingAll');
  },
  lessonStatusChange({ commit },payload){    
        commit('lessonStatusChanged',payload);
  },
  resetActiveIndex({ commit }){
    commit('currentActiveSet',null);
  },
  setRepetitions({ commit },payload){
    commit('repetitionSet',payload);
  },
  setPauseTime({ commit },payload){
    commit('pauseTimeSet',payload);
  },
  setInterTrackPauseTime({ commit },payload){
    commit('interTrackPauseTimeSet',payload);
  },
  setMode({ commit },payload){
    commit('modeSet',payload);
  },
  clearCurrentQueue({ commit }){
    commit('currentQueueCleared');
  },
  async populateCurrentQueue({ dispatch, commit, getters, rootGetters },payload)
    {
        
       var selectedPhrases = JSON.parse(JSON.stringify(rootGetters['items/getKeyPhrasesList'].filter(phrase => phrase.fields.selected)));
       for (const phrase of selectedPhrases) {
        //    var downUrl = await firebaseStorage.refFromURL(phrase.fields.audioUrl[0]).getDownloadURL();
           var downUrl = phrase.fields.audioUrl[0];
           //check if downUrl actually exists
           var frblob = '';
           if(!downUrl.synthetic){
               frblob = await axios.get(downUrl.src,{ responseType:'blob' });
               frblob = frblob.data;
           }
           else{          					//add french google TTS audio
                var resp = await tts.getAudio(phrase.fields.French,googleTTSVoicesConfig.french);
                const base64resp = await fetch(`data:audio/mp3;base64,${resp.data.audioContent}`);
                frblob = await base64resp.blob();
           }
           var frAudioURL =  URL.createObjectURL(frblob);
           //dummy fetch enblob
           var enDownUrl = phrase.fields["English Audio"];
           var enblob = '';
           if(!enDownUrl.synthetic){
            enblob = await axios.get(enDownUrl.src,{ responseType:'blob' });
            enblob = enblob.data;
           }
           else{          					//add french google TTS audio
            var resp = await tts.getAudio(phrase.fields.English,googleTTSVoicesConfig.english);
            const base64resp = await fetch(`data:audio/mp3;base64,${resp.data.audioContent}`);
            enblob = await base64resp.blob();
           }
           
           var enAudioURL = URL.createObjectURL(enblob);
           // merge policy pause for now, option for intermediate track in future
           var settings = getters.getSettings;
           if ( settings.type == interTypeEnum.pause )
           {
                    phrase.fields.mergedSequence = {
                        frAudioURL,
                        enAudioURL,
                        settings
                    };
           }
           phrase.fields.status = audioStatusEnum.pending;
       }
       commit('currentQueuePopulated',selectedPhrases);
    } 
}

const getters = {
    getPlayedPhrases(state){
        return state.currentQueue.filter((phrase) => phrase.fields.status == audioStatusEnum.played);
    },
    getSettings(state){
        return state.settings;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
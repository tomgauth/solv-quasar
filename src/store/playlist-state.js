import axios from 'axios';
import { audioStatusEnum,interTypeEnum } from '../app.constants';
import { firebaseStorage } from '../boot/firebase';

const state = {
    lessonStarted:false,
    currentQueue:[],
    currentActiveId:null,
    settings:{
        intermediate:{
            type:interTypeEnum.pause,
            pauseSeconds:1,
            interTrackURL:null
        }
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
    }
}

const actions = {
  setCurrentActive({ commit },payload){
        commit('currentActiveSet',payload);
  },
  setAudioStatus({ commit },payload ){
        commit('audioStatusSet',payload);
    },
  setStatusPendingAll({commit}){
        commit('statusPendingAll');
  },
  lessonStatusChange({commit},payload){    
        commit('lessonStatusChanged',payload);
  },
  async populateCurrentQueue({ dispatch, commit, getters, rootGetters },payload)
    {
       var selectedPhrases = JSON.parse(JSON.stringify(rootGetters['items/getKeyPhrasesList'].filter(phrase => phrase.fields.selected)));
       for (const phrase of selectedPhrases) {

        //    var downUrl = await firebaseStorage.refFromURL(phrase.fields.audioUrl[0]).getDownloadURL();
           var downUrl = phrase.fields.audioUrl[0];
           var frblob = await axios.get(downUrl,{ responseType:'blob' });
           var frAudioURL =  URL.createObjectURL(frblob.data);
           //dummy fetch enblob
           var enblob = await axios.get(downUrl,{ responseType:'blob' });
           var enAudioURL = URL.createObjectURL(enblob.data);
           // merge policy pause for now, option for intermediate track in future
           var interSettings = getters.getIntermediateSettings;
           if ( interSettings.type == interTypeEnum.pause )
           {
                    phrase.fields.mergedSequence = {
                        frAudioURL,
                        enAudioURL,
                        interSettings
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
    getIntermediateSettings(state){
        return state.settings.intermediate;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
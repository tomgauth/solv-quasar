import axios from 'axios';
import { audioStatusEnum,interTypeEnum } from '../app.constants';
import { firebaseStorage } from '../boot/firebase';

const state = {

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
        var phrase = state.currentQueue.find(phrase =>  phrase[0] == phraseId );
        phrase[1].status = status;
    },
    currentActiveSet(state,payload){
        state.currentActiveId = payload;
    },
    statusPendingAll(state){
        state.currentQueue.forEach(phrase => {
                phrase[1].status = audioStatusEnum.pending;
        });
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
  async populateCurrentQueue({ dispatch, commit, getters, rootGetters },payload)
    {
       var selectedPhrases = JSON.parse(JSON.stringify(rootGetters['items/arrayOfItems'].filter(item => item[1].selected)));
       for (const phrase of selectedPhrases) {

           var downUrl = await firebaseStorage.refFromURL(phrase[1].audio_url).getDownloadURL();
           var frblob = await axios.get(downUrl,{ responseType:'blob' });
           var frAudioURL =  URL.createObjectURL(frblob.data);
           //dummy fetch enblob
           var enblob = await axios.get(downUrl,{ responseType:'blob' });
           var enAudioURL = URL.createObjectURL(enblob.data);
           // merge policy pause for now, option for intermediate track in future
           var interSettings = getters.getIntermediateSettings;
           if ( interSettings.type == interTypeEnum.pause )
           {
                phrase[1].mergedSequence = {
                        frAudioURL,
                        enAudioURL,
                        interSettings
                    };
           }
           phrase[1].status = audioStatusEnum.pending;
       }
       commit('currentQueuePopulated',selectedPhrases);
    }
}

const getters = {
    getPlayedPhrases(state){
        return state.currentQueue.filter((phrase) => phrase[1].status == audioStatusEnum.played);
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


const state = {
    currentItem:null,
    currentQueue:[],
    currentActiveIndex:0,
    settings:{

    }
}

const mutations = {
    currentQueuePopulated(state)
    {

    }
}

const actions = {
    populateCurrentQueue({ dispatch, commit, getters, rootGetters },payload)
    {
       var selectedPhrases = rootGetters['items/arrayOfItems'].filter(item => item[1].selected);
       for (const phrase of selectedPhrases) {
            phrase[1].audio_url;
       }
    }
}

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
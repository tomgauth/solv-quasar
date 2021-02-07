import { firebaseAuth } from "../boot/firebase"
import { LocalStorage, Loading,QSpinnerFacebook } from 'quasar'

const state = {
    loggedIn: false
}

const mutations = {
    setLoggedIn(state, value) {
        state.loggedIn = value
    }
}

const actions = {
    async registerUser({}, payload) {
        Loading.show({
            backgroundColor:"black",
            spinner:QSpinnerFacebook
        });
        await firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password);
    },
    async loginUser({}, payload) {
        Loading.show({
            backgroundColor:"black",
            spinner:QSpinnerFacebook
        });
        await firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password);
    },
    logoutUser({}, payload) {
        firebaseAuth.signOut()
    },
    async handleAuthStateChange( { commit, dispatch } ) {
		firebaseAuth.onAuthStateChanged(async (user) => {
		  if (user) {
		    commit('setLoggedIn', true)
            LocalStorage.set('loggedIn', true)
            //dispatch('lessons/fbReadData', null, { root: true })
            await dispatch('items/populateKeyPhrases', null, { root: true });
            this.$router.push('/').catch(err => {});
            Loading.hide();
		  }
		  else {
		  	commit('setLoggedIn', false)
		  	LocalStorage.set('loggedIn', false)
		  	this.$router.replace('/auth').catch(err => {})
		  }
		})
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
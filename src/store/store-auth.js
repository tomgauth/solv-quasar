import { firebaseAuth } from "../boot/firebase"
import { LocalStorage, Loading } from 'quasar'

const state = {
    loggedIn: false
}

const mutations = {
    setLoggedIn(state, value) {
        state.loggedIn = value
    }
}

const actions = {
    registerUser({}, payload) {
        Loading.show()
        firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
        })
        .catch(error => {
            
        })
    },
    loginUser({}, payload) {
        Loading.show()
        firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password) 
        .then(response => {
        })
        .catch(error => {
            
            Loading.hide()
        })
    },
    logoutUser({}, payload) {
        firebaseAuth.signOut()
    },
    handleAuthStateChange( { commit, dispatch } ) {
		firebaseAuth.onAuthStateChanged(user => {
			Loading.hide()
		  if (user) {
		    commit('setLoggedIn', true)
            LocalStorage.set('loggedIn', true)
            //dispatch('lessons/fbReadData', null, { root: true })
            this.$router.push('/').catch(err => {})
            dispatch('items/fbReadData', null, { root: true })
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
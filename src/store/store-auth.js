import { firebaseAuth, firebaseDb } from "../boot/firebase"
import { LocalStorage, Loading } from 'quasar'
import { showErrorMessage } from '../functions/function-show-error-message'

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
            console.log('response:', response)
        })
        .catch(error => {
            showErrorMessage(error.message)
        })
    },
    loginUser({}, payload) {
        Loading.show()
        firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password) 
        .then(response => {
            console.log('response:', response)
        })
        .catch(error => {
            showErrorMessage(error.message)
            Loading.hide()
        })
    },
    logoutUser({}, payload) {
        console.log('firebaseAuth.signout fired')
        firebaseAuth.signOut()
    },
    handleAuthStateChange( { commit, dispatch } ) {
        console.log('handleAuthStateChange')
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
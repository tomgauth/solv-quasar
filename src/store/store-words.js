import { firebaseDb, firebaseAuth } from 'boot/firebase'
import Vue from 'vue'
import { uid } from 'quasar'
// import { longStackSupport } from 'q'

const state = {
    words: {
		'je': {fr: 'je', difficulty: 'pronounciation'}
	},
	search: '',
	wordIndex: 0
}


const mutations = {
	updateWord(state, payload) {
		Object.assign(state.words[payload.id], payload.updates)
	},
	deleteWord(state, id) {
		Vue.delete(state.words, id)
	},
	addWord(state, payload) {
		Vue.set(state.words, payload.id, payload.word)
	},
	setSearch(state, value) {
		state.search = value
	},
	setSort(state, value) {
		state.sort = value
	},
	incrementIndex(state) {
		console.log("state.wordIndex: ", state.wordIndex)
		state.wordIndex += 1
	}
}


const actions = {
	updateWord({ dispatch }, payload) {
		dispatch('fbUpdateWord', payload)
	},
	deleteWord({ dispatch }, id) {
		dispatch('fbDeleteWord', id)
	},
	addWord({ dispatch }, word) {
		let wordId = uid()
		let payload = {
			id: wordId,
			word: word
		}
		dispatch('fbAddWord', payload)
	},
	setSearch({ commit }, value) {
		commit('setSearch', value)
	},
	setSort({ commit }, value) {
		commit('setSort', value)
	},
	incrementIndex({ commit }) {
		commit('incrementIndex')
	}, 
    fbReadData({ commit }) {
        console.log("start reading data from firebase")
        let userId = firebaseAuth.currentUser.uid
        let userWords = firebaseDb.ref('words/'+userId)
        // console.log(userWords)

        // child added
		userWords.on('child_added', snapshot => {
            console.log('snapshot: ', snapshot)
			let word = snapshot.val()
			let payload = {
				id: snapshot.key,
				word: word
			}
			commit('addWord', payload)
		})

		// child changed
		userWords.on('child_changed', snapshot => {
			let word = snapshot.val()
			let payload = {
				id: snapshot.key,
				updates: word
			}
			commit('updateWord', payload)
		})

		// child removed
		userWords.on('child_removed', snapshot => {
			let wordId = snapshot.key
			commit('deleteWord', wordId)
		})
    },
    fbAddWord({}, payload) {
		let userId = firebaseAuth.currentUser.uid
		let wordRef = firebaseDb.ref('words/' + userId + '/' + payload.id)
		wordRef.set(payload.word)
	},
	fbUpdateWord({}, payload) {
		let userId = firebaseAuth.currentUser.uid
		let wordRef = firebaseDb.ref('words/' + userId + '/' + payload.id)
		wordRef.update(payload.updates)
	},
	fbDeleteWord({}, wordId) {
		let userId = firebaseAuth.currentUser.uid
		let wordRef = firebaseDb.ref('words/' + userId + '/' + wordId)
		wordRef.remove()
	},
	fbIncrementIndex({}) {
		let userId = firebaseAuth.currentUser.uid
		let wordIndexRef = firebaseDb.ref('words/'+userId+'/'+ wordIndex)
		wordIndexRef.incrementIndex()
	}
}

const getters = {
	arrayOfWords: (state) => {
		console.log(Object.entries(state.words))
		return Object.entries(state.words)
	},
	getWordByName: state => name => {
		console.log(Object.values(state.words).find(word => word.name === name))
		return Object.values(state.words).find(word => word.name === name)
	}, 
    wordsFiltered: (state) => {
		let wordsFiltered = {}
		if (state.search) {
			Object.keys(state.words).forEach(function(key) {
				let word = state.words[key],
						wordFrLowerCase = word.fr.toLowerCase(),
						searchLowerCase = state.search.toLowerCase()
				if (wordFrLowerCase.includes(searchLowerCase)) {
					wordsFiltered[key] = word
				}
			})
			return wordsFiltered		
		}
		return state.words
	},
    words: (state, getters) => {
		let wordsFiltered = getters.wordsFiltered
		let words = {}
		Object.keys(wordsFiltered).forEach(function(key) {
			let word = wordsFiltered[key]
			if (!word.completed) {
				words[key] = word
			}
		})
		return words
    },
    
	// words: () => {
	//      return wordsFiltered // change to "return words" 
    //},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
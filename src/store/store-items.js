import { firebaseDb, firebaseAuth } from 'boot/firebase'
import Vue from 'vue'
import { uid } from 'quasar'
// import { longStackSupport } from 'q'

const state = {
    items: {

        // 'IDL001QNA001': {selected:false, day:"001", type:"QNA", block_number:"001", name:"L001QNA001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"]},
        // 'IDL001MIP001': {selected:false, day:"001", type:"MIP", block_number:"001", name:"L001MIP001", fr: "ça va", en: "It’s okay", words: ["ça", "va"]},
        // 'IDL001MIP002': {selected:true, day:"001", type:"MIP", block_number:"002", name:"L001MIP002", fr: "comment", en: "how", words: ["comment"]},
        // 'IDL001MIP003': {selected:false, day:"001", type:"MIP", block_number:"003", name:"L001MIP003", fr: "très bien", en: "very good", words: ["très", "bien"]},
        // 'IDL001MIP004': {selected:true, day:"001", type:"MIP", block_number:"004", name:"L001MIP004", fr: "je vais", en: "I go", words: ["je", "vais"]},
        // 'IDL001MIP005': {selected:false, day:"001", type:"MIP", block_number:"005", name:"L001MIP005", fr: "pas", en: "not", words: ["pas"]},
        // 'IDL001COM001': {selected:false, day:"001", type:"COM", block_number:"001", name:"L001COM001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"]},
        // 'IDL001COM002': {selected:false, day:"001", type:"COM", block_number:"002", name:"L001COM002", fr: "Je vais très bien", en: "I am doing very well", words: ["je", "vais", "très", "bien"]},
        // 'IDL001COM003': {selected:false, day:"001", type:"COM", block_number:"003", name:"L001COM003", fr: "Ça va pas très bien", en: "It’s not going very well", words: ["ça", "va", "pas", "très", "bien"]},
        // 'IDL001COM004': {selected:false, day:"001", type:"COM", block_number:"004", name:"L001COM004", fr: "Comment je vais ? Très bien .", en: "How am I doing ? Very well .", words: ["comment", "je", "vais", "très", "bien"]},
        // 'IDL001COM005': {selected:false, day:"001", type:"COM", block_number:"005", name:"L001COM005", fr: "Ça va bien ?", en: "Is it going well ?", words: ["ça", "va", "bien"]},
        // 'IDL002QNA001': {selected:false, day:"002", type:"QNA", block_number:"001", name:"L002QNA001", fr: "Est-ce que tu parles français ?", en: "Do you speak French ?", words: ["est", "ce", "que", "tu", "parles", "français"]},
        // 'IDL002MIP001': {selected:false, day:"002", type:"MIP", block_number:"001", name:"L002MIP001", fr: "Je parle français", en: "I speak French", words: ["je", "parle", "français"]},
        // 'IDL002MIP002': {selected:false, day:"002", type:"MIP", block_number:"002", name:"L002MIP002", fr: "Tu parles", en: "You speak", words: ["tu", "parles"]},
        // 'IDL002MIP003': {selected:false, day:"002", type:"MIP", block_number:"003", name:"L002MIP003", fr: "un peu", en: "a little", words: ["un", "peu"]},
        // 'IDL002MIP004': {selected:false, day:"002", type:"MIP", block_number:"004", name:"L002MIP004", fr: "et toi", en: "and you", words: ["et", "toi"]},
        // 'IDL002MIP005': {selected:false, day:"002", type:"MIP", block_number:"005", name:"L002MIP005", fr: "mais", en: "but", words: ["mais"]}
    
    },
    search: ''
}


const mutations = {
	updateItem(state, payload) {
		Object.assign(state.items[payload.id], payload.updates)
	},
	deleteItem(state, id) {
		Vue.delete(state.items, id)
	},
	addItem(state, payload) {
		Vue.set(state.items, payload.id, payload.item)
	},
	setSearch(state, value) {
		state.search = value
	},
	setSort(state, value) {
		state.sort = value
	}
}


const actions = {
	updateItem({ dispatch }, payload) {
		dispatch('fbUpdateItem', payload)
	},
	deleteItem({ dispatch }, id) {
		dispatch('fbDeleteItem', id)
	},
	addItem({ dispatch }, item) {
		let itemId = uid()
		let payload = {
			id: itemId,
			item: item
		}
		dispatch('fbAddItem', payload)
	},
	setSearch({ commit }, value) {
		commit('setSearch', value)
	},
	setSort({ commit }, value) {
		commit('setSort', value)
	},

    fbReadData({ commit }) {
        console.log("start reading data from firebase")
        let userId = firebaseAuth.currentUser.uid
        let userItems = firebaseDb.ref('items/'+userId)
        // console.log(userItems)

        // child added
		userItems.on('child_added', snapshot => {
            console.log('snapshot: ', snapshot)
			let item = snapshot.val()
			let payload = {
				id: snapshot.key,
				item: item
			}
			commit('addItem', payload)
		})

		// child changed
		userItems.on('child_changed', snapshot => {
			let item = snapshot.val()
			let payload = {
				id: snapshot.key,
				updates: item
			}
			commit('updateItem', payload)
		})

		// child removed
		userItems.on('child_removed', snapshot => {
			let itemId = snapshot.key
			commit('deleteItem', itemId)
		})
    },
    fbAddItem({}, payload) {
		let userId = firebaseAuth.currentUser.uid
		let itemRef = firebaseDb.ref('items/' + userId + '/' + payload.id)
		itemRef.set(payload.item)
	},
	fbUpdateItem({}, payload) {
		let userId = firebaseAuth.currentUser.uid
		let itemRef = firebaseDb.ref('items/' + userId + '/' + payload.id)
		itemRef.update(payload.updates)
	},
	fbDeleteItem({}, itemId) {
		let userId = firebaseAuth.currentUser.uid
		let itemRef = firebaseDb.ref('items/' + userId + '/' + itemId)
		itemRef.remove()
	}
}

const getters = {
    itemsFiltered: (state) => {
		let itemsFiltered = {}
		if (state.search) {
			Object.keys(state.items).forEach(function(key) {
				let item = state.items[key],
						itemFrLowerCase = item.fr.toLowerCase(),
						searchLowerCase = state.search.toLowerCase()
				if (itemFrLowerCase.includes(searchLowerCase)) {
					itemsFiltered[key] = item
				}
			})
			return itemsFiltered		
		}
		return state.items
	},
    items: (state, getters) => {
		let itemsFiltered = getters.itemsFiltered
		let items = {}
		Object.keys(itemsFiltered).forEach(function(key) {
			let item = itemsFiltered[key]
			if (!item.completed) {
				items[key] = item
			}
		})
		return items
    },
    
	// items: () => {
	//      return itemsFiltered // change to "return items" 
    //},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
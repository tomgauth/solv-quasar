import { firebaseDb, firebaseAuth } from 'boot/firebase'
import Vue from 'vue'
import { uid } from 'quasar'
import moment from 'moment'
import airtableService from './services/airtable.service';
import { AirParams } from './services/airtableconstants';
// import { longStackSupport } from 'q'

const state = {
    items: {

	},
	search: '',
	itemIndex: 0
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
	},
	incrementIndex(state) {
		state.itemIndex += 1
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
	incrementIndex({ commit }) {
		commit('incrementIndex')
	}, 
	selectDueItems({ dispatch }, originalPayload) {
		let arrayDueItems = getters.dueItems(state)
		let updates = {selected:''}
		let itemPayload = {id:'', updates}
		Object.entries(arrayDueItems).forEach(dueItem => {
			itemPayload.id = dueItem[0]
			itemPayload.updates.selected = originalPayload
			dispatch('fbUpdateItem', itemPayload)
			//Object.assign(state.items[itemPayload.id], itemPayload.updates)
		});


	},
	populateItems( {commit, dispatch} ) {

		let initialData = firebaseDb.ref('initial_data')


		initialData.on('child_added', snapshot => {
			let item = snapshot.val()
			let payload = {
				id: snapshot.key,
				item: item
			}

			dispatch('addItem', item)
		})

		//state.items = firebaseDb.ref('initial_data')
	},
    fbReadData({ commit }) {
		airtableService.getKeyPhrasesList({ [AirParams.view]:"Atom" }).then(resp=>console.log(resp));
        let userId = firebaseAuth.currentUser.uid
        let userItems = firebaseDb.ref('items/'+userId)
        // child added
		userItems.on('child_added', snapshot => {
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
	},
	fbIncrementIndex({}) {
		let userId = firebaseAuth.currentUser.uid
		let itemIndexRef = firebaseDb.ref('items/'+userId+'/'+ itemIndex)
		itemIndexRef.incrementIndex()
	}
}

const getters = {
	dueItems: (state) => {
		let dueItems = []
		Object.keys(state.items).forEach(function(key) {
			let item = state.items[key],
				today = moment()
			if (moment(item.date) <= today) {
				dueItems[key] = item
			}
		})
		return dueItems	
		
	},
	arrayOfItems: (state) => {
		return Object.entries(state.items)
	},
	getItemByName: state => name => {
		return Object.values(state.items).find(item => item.name === name)
	}, 
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
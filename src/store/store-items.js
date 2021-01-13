import { firebaseDb, firebaseAuth } from 'boot/firebase'
import Vue from 'vue'
import { uid } from 'quasar'
import moment, { relativeTimeRounding } from 'moment'

const state = {
    items: {

	},
	lessonItems: [],
	search: '',
	itemIndex: 0,
	reviewDueItems: 'false'
}


const mutations = {
	updateItem(state, payload) {
		console.log('mutation updateItem payload : ', payload)
		Object.assign(state.items[payload.id], payload.updates)
	},
	deleteItem(state, id) {
		Vue.delete(state.items, id)
	},
	addItem(state, payload) {
		console.log('payload in mutation addItem: ', payload)
		Vue.set(state.items, payload.id, payload.item)
	},
	setSearch(state, value) {
		state.search = value
	},
	setSort(state, value) {
		state.sort = value
	},
	incrementIndex(state) {
		console.log("state.itemIndex: ", state.itemIndex)
		state.itemIndex += 1
	},
	selectDueItems(state, value) {
		state.reviewDueItems = value
	},
	increaseIndex(state) {
		// this function will move the item if it's still scheduled for the day
		function arraymove(arr, fromIndex, toIndex) {
			var element = arr[fromIndex];
			arr.splice(fromIndex, 1);
			arr.splice(toIndex, 0, element);
			return arr
		}

		let updatedLessonItems = arraymove(state.lessonItems, 0, 3)
		state.lessonItems = updatedLessonItems
		console.log('updatedLessonItems :', updatedLessonItems)

	}, 
}


const actions = {
	increaseIndex( { dispatch }) {
		dispatch('increaseIndex')
	},
	updateItem({ dispatch }, payload) {
		console.log('actions / update Item triggered : ', payload)
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
		console.log('actions / addItem triggered item : ', item)
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
	selectDueItems({ dispatch, commit }, originalPayload) {		
		console.log("selectDueItems value : ", originalPayload)
		console.log("getters.dueItems : ", getters.dueItems(state))
		let arrayDueItems = getters.dueItems(state)
		let updates = {selected:''}
		let itemPayload = {id:'', updates}
		Object.entries(arrayDueItems).forEach(dueItem => {
			console.log('item[1].selected :',dueItem[1].selected)
			itemPayload.id = dueItem[0]
			console.log('value :', originalPayload)
			itemPayload.updates.selected = originalPayload
			console.log('itemPayload :', itemPayload)
			dispatch('fbUpdateItem', itemPayload)
			//Object.assign(state.items[itemPayload.id], itemPayload.updates)
		});
		commit('selectDueItems', originalPayload)


	},
	populateItems( {commit, dispatch} ) {

		let initialData = firebaseDb.ref('initial_data')


		initialData.on('child_added', snapshot => {
			let item = snapshot.val()
			console.log('item : ', item)
			let payload = {
				id: snapshot.key,
				item: item
			}

			dispatch('addItem', item)
		})

		//state.items = firebaseDb.ref('initial_data')
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
			console.log('child_changed! payload: ', payload)
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
		console.log('actions / fbUpdateItem payload.updates : ', payload.updates, 'itemRef : ', itemRef)
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

	lessonItems: () => {
		console.log('lessonItems in store-items / get : ', Object.entries(state.items).filter(item => item[1].selected))
		return Object.entries(state.items).filter(item => item[1].selected)
	},

	arrayOfItems: (state) => {
		console.log('arrayOfItems:',Object.entries(state.items))
		return Object.entries(state.items)
	},
	getItemByName: state => name => {
		console.log(Object.values(state.items).find(item => item.name === name))
		return Object.values(state.items).find(item => item.name === name)
	}, 
    itemsFiltered: (state) => {
		let itemsFiltered = {}
		if (state.search) {
			Object.keys(state.items).forEach(function(key) {
				let item = state.items[key],
						itemFrLowerCase = item.fr.toLowerCase(),
						searchLowerCase = state.search.toLowerCase()
				console.log("items : ", items)
				console.log("item : ", item)
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
import { firebaseDb, firebaseAuth } from 'boot/firebase'
import Vue from 'vue'
import { uid } from 'quasar'
// import { longStackSupport } from 'q'

const state = {
    items: {
		// "L001QNA001" : {selected:false, day:"001", type:"QNA", status:"ok", block_number:"001", name:"L001QNA001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"], concepts: ["present tense","question"]},
		// "L001MIP001" : {selected:false, day:"001", type:"MIP", status:"ok", block_number:"001", name:"L001MIP001", fr: "ça va", en: "It’s okay", words: ["ça", "va"], concepts: ["present tense"]},
		// "L001MIP002" : {selected:true,  day:"001", type:"MIP", status:"ok", block_number:"002", name:"L001MIP002", fr: "comment", en: "how", words: ["comment"], concepts: ["present tense"]},
		// "L001MIP003" : {selected:false, day:"001", type:"MIP", status:"ok", block_number:"003", name:"L001MIP003", fr: "très bien", en: "very good", words: ["très", "bien"], concepts: ["present tense"]},
		// "L001MIP004" : {selected:true,  day:"001", type:"MIP", status:"ok", block_number:"004", name:"L001MIP004", fr: "je vais", en: "I go", words: ["je", "vais"], concepts: ["present tense"]},
		// "L001MIP005" : {selected:false, day:"001", type:"MIP", status:"ok", block_number:"005", name:"L001MIP005", fr: "pas", en: "not", words: ["pas"], concepts: ["present tense"]},
		// "L001COM002" : {selected:false, day:"001", type:"COM", status:"ok", block_number:"002", name:"L001COM002", fr: "Je vais très bien", en: "I am doing very well", words: ["je", "vais", "très", "bien"], concepts: ["present tense"]},
		// "L001COM003" : {selected:false, day:"001", type:"COM", status:"ok", block_number:"003", name:"L001COM003", fr: "Ça va pas très bien", en: "It’s not going very well", words: ["ça", "va", "pas", "très", "bien"], concepts: ["present tense"]},
		// "L001COM004" : {selected:false, day:"001", type:"COM", status:"ok", block_number:"004", name:"L001COM004", fr: "Comment je vais ? Très bien .", en: "How am I doing ? Very well .", words: ["comment", "je", "vais", "très", "bien"], concepts: ["present tense"]},
		// "L001COM005" : {selected:false, day:"001", type:"COM", status:"ok", block_number:"005", name:"L001COM005", fr: "Ça va bien ?", en: "Is it going well ?", words: ["ça", "va", "bien"], concepts: ["present tense"]},
		// "L002QNA001" : {selected:false, day:"002", type:"QNA", status:"ok", block_number:"001", name:"L002QNA001", fr: "Est-ce que tu parles français ?", en: "Do you speak French ?", words: ["est", "ce", "que", "tu", "parles", "français"], concepts: ["present tense","question"]},
		// "L002MIP001" : {selected:false, day:"002", type:"MIP", status:"ok", block_number:"001", name:"L002MIP001", fr: "Je parle français", en: "I speak French", words: ["je", "parle", "français"], concepts: ["present tense"]},
		// "L002MIP002" : {selected:false, day:"002", type:"MIP", status:"ok", block_number:"002", name:"L002MIP002", fr: "Tu parles", en: "You speak", words: ["tu", "parles"], concepts: ["present tense"]},
		// "L002MIP003" : {selected:false, day:"002", type:"MIP", status:"ok", block_number:"003", name:"L002MIP003", fr: "un peu", en: "a little", words: ["un", "peu"], concepts: ["present tense"]},
		// "L002MIP004" : {selected:false, day:"002", type:"MIP", status:"ok", block_number:"004", name:"L002MIP004", fr: "et toi", en: "and you", words: ["et", "toi"], concepts: ["present tense"]},
		// "L002MIP005" : {selected:false, day:"002", type:"MIP", status:"ok", block_number:"005", name:"L002MIP005", fr: "mais", en: "but", words: ["mais"]},
		// "L001COM008" : {selected:false, day:"001", type:"COM", status:"ok", block_number:"005", name:"L001COM008", fr: "je vais", en: "I go", words: ["je", "vais"], concepts: ["present"]},
		// "L002QNA028" : {selected:true,  day:"002", type:"QNA", status:"ok", block_number:"001", name:"L002QNA028", fr: "je vais aller", en: "I will go", words: ["je","vais","aller"], concepts: ["futur proche"]},
		// "L002MIP038" : {selected:true,  day:"002", type:"MIP", status:"ok", block_number:"001", name:"L002MIP038", fr: "je vais y aller", en: "I will go there", words: ["je","vais","y","aller"], concepts: ["futur proche", "y"]},
		// "L002MIP048" : {selected:false, day:"002", type:"MIP", status:"ok", block_number:"002", name:"L002MIP048", fr: "je suis allé", en: "I went", words: ["je", "suis","allé"], concepts: ["passé composé", "auxiliaire être"]},
		// "L002MIP058" : {selected:true,  day:"002", type:"MIP", status:"ok", block_number:"003", name:"L002MIP058", fr: "j’y suis allé", en: "I went there", words: ["je","y","suis","aller"], concepts: ["passé composé", "auxiliaire être", "y"]},
		// "L002MIP068" : {selected:false, day:"002", type:"MIP", status:"ok", block_number:"004", name:"L002MIP068", fr: "j’y suis pas allé", en: "I haven’t been there", words: ["je","y","suis","pas","aller"], concepts: ["passé composé", "auxiliaire être", "y", "adverbe"]},
		// "L002MIP078" : {selected:false, day:"002", type:"MIP", status:"ok", block_number:"005", name:"L002MIP078", fr: "j’y suis pas encore allé", en: "I haven’t been there yet", words: ["je","y","suis","pas","encore","aller"], concepts: ["passé composé", "auxiliaire être", "y", "adverbe"]}
		
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
		console.log("state.itemIndex: ", state.itemIndex)
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
	},
	fbIncrementIndex({}) {
		let userId = firebaseAuth.currentUser.uid
		let itemIndexRef = firebaseDb.ref('items/'+userId+'/'+ itemIndex)
		itemIndexRef.incrementIndex()
	}
}

const getters = {
	arrayOfItems: (state) => {
		console.log(Object.entries(state.items))
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
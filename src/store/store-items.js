import { firebaseDb, firebaseAuth } from 'boot/firebase'
import Vue from 'vue'
import { uid } from 'quasar'
// import { longStackSupport } from 'q'

const state = {
    items: {

        'IDL001QNA001': {selected:false, day:"001", type:"QNA", block_number:"001", name:"L001QNA001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"]},
        'IDL001MIP001': {selected:false, day:"001", type:"MIP", block_number:"001", name:"L001MIP001", fr: "ça va", en: "It’s okay", words: ["ça", "va"]},
        'IDL001MIP002': {selected:true, day:"001", type:"MIP", block_number:"002", name:"L001MIP002", fr: "comment", en: "how", words: ["comment"]},
        'IDL001MIP003': {selected:false, day:"001", type:"MIP", block_number:"003", name:"L001MIP003", fr: "très bien", en: "very good", words: ["très", "bien"]},
        'IDL001MIP004': {selected:true, day:"001", type:"MIP", block_number:"004", name:"L001MIP004", fr: "je vais", en: "I go", words: ["je", "vais"]},
        'IDL001MIP005': {selected:false, day:"001", type:"MIP", block_number:"005", name:"L001MIP005", fr: "pas", en: "not", words: ["pas"]},
        'IDL001COM001': {selected:false, day:"001", type:"COM", block_number:"001", name:"L001COM001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"]},
        'IDL001COM002': {selected:false, day:"001", type:"COM", block_number:"002", name:"L001COM002", fr: "Je vais très bien", en: "I am doing very well", words: ["je", "vais", "très", "bien"]},
        'IDL001COM003': {selected:false, day:"001", type:"COM", block_number:"003", name:"L001COM003", fr: "Ça va pas très bien", en: "It’s not going very well", words: ["ça", "va", "pas", "très", "bien"]},
        'IDL001COM004': {selected:false, day:"001", type:"COM", block_number:"004", name:"L001COM004", fr: "Comment je vais ? Très bien .", en: "How am I doing ? Very well .", words: ["comment", "je", "vais", "très", "bien"]},
        'IDL001COM005': {selected:false, day:"001", type:"COM", block_number:"005", name:"L001COM005", fr: "Ça va bien ?", en: "Is it going well ?", words: ["ça", "va", "bien"]},
        'IDL002QNA001': {selected:false, day:"002", type:"QNA", block_number:"001", name:"L002QNA001", fr: "Est-ce que tu parles français ?", en: "Do you speak French ?", words: ["est", "ce", "que", "tu", "parles", "français"]},
        'IDL002MIP001': {selected:false, day:"002", type:"MIP", block_number:"001", name:"L002MIP001", fr: "Je parle français", en: "I speak French", words: ["je", "parle", "français"]},
        'IDL002MIP002': {selected:false, day:"002", type:"MIP", block_number:"002", name:"L002MIP002", fr: "Tu parles", en: "You speak", words: ["tu", "parles"]},
        'IDL002MIP003': {selected:false, day:"002", type:"MIP", block_number:"003", name:"L002MIP003", fr: "un peu", en: "a little", words: ["un", "peu"]},
        'IDL002MIP004': {selected:false, day:"002", type:"MIP", block_number:"004", name:"L002MIP004", fr: "et toi", en: "and you", words: ["et", "toi"]},
        'IDL002MIP005': {selected:false, day:"002", type:"MIP", block_number:"005", name:"L002MIP005", fr: "mais", en: "but", words: ["mais"]}
    
    }
}


const mutations = {
    updateItem(state, payload) {
        console.log(state.items[payload.id]) // this is the undefined
        //console.log(payload.id)
        Object.assign(state.items[payload.id], payload.updates)        
    },
    deleteItem(state, id) {
        console.log('id: ', id)
        Vue.delete(state.items, id)
    },
    addItem(state, payload) {
        Vue.set(state.items, payload.id, payload.item)
    }
}


const actions = {
    updateItem({ commit }, payload) {
        commit('updateItem', payload)
    },
    deleteItem({ commit }, id){
        commit('deleteItem', id)
        
    },
    addItem({ commit }, item){
        let itemId = uid()
        let payload = {
            id: itemId,
            item: item
        }
        commit('addItem', payload)
    },

    fbReadData({ commit }) {
        console.log("start reading data from firebase")
        let userId = firebaseAuth.currentUser.uid
        let userItems = firebaseDb.ref('items/'+userId)

        // child added
        userItems.on('child_added', snapshot => {
            console.log('snapshot:' ,snapshot)
            let item = snapshot.val()
            console.log('item: ' + item)
        })
    }
}

const getters = {
	items: (state) => {
		return state.items
	}
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
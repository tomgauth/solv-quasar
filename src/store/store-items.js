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
	itemIndex: 0,
	keyPhrases:[]
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
	},
	keyPhrasesPopulated(state,payload){
		var filtered = payload.filter(rec => !rec.fields.audioUrl[0].hasOwnProperty("error"));
		state.keyPhrases = filtered;
	}
}


const actions = {

	async populateKeyPhrases({ commit }){
		const response = await airtableService.getKeyPhrasesList({ 
			[AirParams.view]:"Atom"
		 });
		 //adding selected field
		 response.records.forEach(rec => rec.fields.selected = true);
		 //
		commit('keyPhrasesPopulated',response.records);
	}
}

const getters = {

	getKeyPhrasesList(state){
		return state.keyPhrases;
	}
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
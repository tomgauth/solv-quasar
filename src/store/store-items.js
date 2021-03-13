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
	keyPhrases:[],
	Levels:[
		{
			id:'-1',
			fields:{
				Name:'Not Specified'
			}
		}
	],
	Tags:{
		Tenses:[],
		Registres:[],
		Forms:[],
		Moods:[],
		Voices:[]
	}
}


const mutations = {

	keyPhrasesPopulated(state,payload){
		console.log(payload);
		// var filtered = payload.filter(rec => !rec.fields.audioUrl[0].hasOwnProperty("error"));
		// state.keyPhrases = filtered;
		state.keyPhrases = payload;
	},
	keyPhrasesDetailsPopulated(state,payload){
        Object.assign(state.keyPhrases)
	},
	levelsPopulated(state,payload){
		var uniqueLevels = [...new Set([...state.Levels,...payload.records])];
		Vue.set(state,'Levels',[...uniqueLevels]);
	},
	tensesPopulated(state,payload){
		var uniqueTenses = [...new Set([...state.Tags.Tenses,...payload])];
		Vue.set(state.Tags,'Tenses',[...uniqueTenses]);
	},
	moodsPopulated(state,payload){
		var uniqueMoods = [...new Set([...state.Tags.Moods,...payload])];
		Vue.set(state.Tags,'Moods',[...uniqueMoods]);
	},
	formsPopulated(state,payload){
		var uniqueForms = [...new Set([...state.Tags.Forms,...payload])];
		Vue.set(state.Tags,'Forms',[...uniqueForms]);
	},
	registresPopulated(state,payload){
		var uniqueRegistres = [...new Set([...state.Tags.Registres,...payload])];
		Vue.set(state.Tags,'Registres',[...uniqueRegistres]);
	},
	voicesPopulated(state,payload){
		var uniqueVoices = [...new Set([...state.Tags.Voices,...payload])];
		Vue.set(state.Tags,'Voices',[...uniqueVoices]);
	},
	selectionToggled(state,payload){
		payload.keys.forEach(key => {	
			var mutatedPhrase = state.keyPhrases.find(phrase => phrase.id == key);
			mutatedPhrase.fields.selected = payload["added"] ? true : false;
		})
	}
}


const actions = {

	toggleSelection({commit},payload){
		commit('selectionToggled',payload);
	},
	async populateKeyPhrases({ commit }){

		return new Promise(async (resolve) => {
			const response = await airtableService.getKeyPhrasesList({ 
				[AirParams.view]:"Atom"
			 });
			 //adding selected field
			 response.records.forEach(rec => rec.fields.selected = true);
			 //
			commit('keyPhrasesPopulated',response.records);
			resolve();
		});
	},
	async populateAllKeyPhrasesDetails({ getters,dispatch },payload){
		var keys = getters.getAllKeyPhrasesKeys;
		await dispatch('populateKeyPhrasesDetails',keys);
	},
	async populateKeyPhrasesDetails({ state,dispatch,getters,commit },payload){
		
		var keyPhrases = state.keyPhrases;
		var filteredPhrases = keyPhrases.filter(phrase => payload.includes(phrase.id));
		//Populate Associated Levels
		var levelsIds = filteredPhrases.map(val => val.fields.Level ? val.fields.Level[0] : 'Not Specified');
		var uniqueLevelsIds = [...new Set(levelsIds)];
		await dispatch('populateLevels',uniqueLevelsIds);

		//Populate Associated tags
		
		//Populate Tenses
		var tenses = filteredPhrases.map(phrase => phrase.fields.Tense[0]);
		var uniqueTenses = [...new Set(tenses)];
		commit('tensesPopulated',uniqueTenses);

		// Populate Mood
		var moods = filteredPhrases.map(phrase => phrase.fields.Mood)
		var uniqueMoods = [...new Set(moods)];
		commit('moodsPopulated',uniqueMoods);

		// Populate Voice
		var voices = filteredPhrases.map(phrase => phrase.fields.Voice)
		var uniqueVoices = [...new Set(voices)];
		commit('voicesPopulated',uniqueVoices);

		// Populate Forms
		var forms = filteredPhrases.map(phrase => phrase.fields.Form);
		var uniqueForms = [...new Set(forms)];
		commit("formsPopulated",uniqueForms);

		// Populate Registre
		var registre = filteredPhrases.map(phrase => phrase.fields.Registre[0]);
		var uniqueRegistre = [...new Set(registre)];
		commit("registresPopulated",uniqueRegistre);
	},
	async populateLevels({ dispatch,getters,commit },payload){
		var levelFormula = `SEARCH(RECORD_ID(), "${payload.join(",")}") != ""`;
		var levels = await airtableService.getLevelsList({ [AirParams.filterByFormula]:levelFormula });
		commit('levelsPopulated',levels);
	},
	async populateTenses({ dispatch,getters,commit },payload){
		//if fetched for airtable
	},
	async populateRegistre({ dispatch,getters,commit },payload){
		//if fetched for airtable
	},
	async populateForms({ dispatch },payload){
		//if fetched for airtable
	},
	async populateMoods({ dispatch },payload){
		//if fetched for airtable
	}

}

const getters = {

	getAllTagsValues(){
		var temp=[];
		for (const key in state.Tags) {
			if (Object.hasOwnProperty.call(state.Tags, key)) {
				const tag = state.Tags[key];
				temp.push(...tag);
			}
		}
		return temp;
	},
	getKeyPhrasesList(state){
		return state.keyPhrases;
	},
	getAllKeyPhrasesKeys(state){
		return state.keyPhrases.map(phrase => phrase.id);
	},
	getTableData(state){
		var keyPhrases = state.keyPhrases;
		var data = [];
		for (const key in keyPhrases) {
			if (Object.hasOwnProperty.call(keyPhrases, key)) {
				const phrase = keyPhrases[key].fields;
				var projected = Object.assign({},{
					'Record ID' : phrase['Record ID'],
					'English' : phrase.English,
					'French' : phrase.French, 
					'Level' : state.Levels.find(level => level.id == (phrase.Level ? phrase.Level[0] : '-1')).fields.Name,
					'audioUrl' : phrase.audioUrl[0],
					'selected' : phrase.selected,
					'Tags': {
						Tense:phrase.Tense[0],
						Voice:phrase.Voice,
						Registre:phrase.Registre[0],
						Form:phrase.Form,
						Mood:phrase.Mood
					}
				 });
				 data.push(projected);
			}
		}
		return data;
	}
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
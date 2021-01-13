import SpacedRepetition from 'spaced-repetition'

const config = {
  'bad': '5 minutes',
  'new': 300000, // in milliseconds (5 minutes)
  'fresh': '1 day',
  'average': '5 days',
  'old': '14 days'
}



const actions = {
	log() {
		console.log('word : ', word.good())
		console.log('record : ', record)
		console.log('updatedRecord : ', updatedRecord)

	},
	schedule({dispatch}, originPayload){
		console.log('config :', config)
		console.log('originPayload :', originPayload)

		// checking if date is not null

		function checkDate (date) {
			if (date) {
				return new Date(date)
			} else {
				return new Date() // using now as the first valu
			}
		}

		let date = checkDate(originPayload.updates.date)
		
		console.log('date : ', date)
		let state = originPayload.updates.state
		console.log( 'state : ', state)
		let itemToSchedule = new SpacedRepetition(date, state, config)
		console.log( 'date.getTime() : ', date.getTime())

		switch(originPayload.updates.grade) {
			case 'good':				
				itemToSchedule.good()
			break
			case 'ok':
				itemToSchedule.ok()
			break
			case 'bad':
				itemToSchedule.bad()
			break
		}
		
		console.log('itemToSchedule final : ', itemToSchedule)
		let payload = {
			id: originPayload.id,
			updates : {
				state: itemToSchedule.state,
				date: itemToSchedule.date,
				review_index: itemNextReview
			}
		}
		dispatch('items/fbUpdateItem', payload, {root:true})
		
	},

	increaseInterval({ dispatch }, originPayload) {

		// change the payload here to a fixed value
		let s = originPayload.updates.scoreToProgress
		console.log('originPayload : ',originPayload)
		let progress = originPayload.updates.progress
		console.log('progress: ', progress)
		let payload = { 
			id : originPayload.id,
			updates : {}}

		payload.updates = ms.calculate(s, { progress }, today)

		dispatch('items/fbUpdateItem', payload, {root:true})
		
	}
}

export default {
    namespaced: true,
	actions
}

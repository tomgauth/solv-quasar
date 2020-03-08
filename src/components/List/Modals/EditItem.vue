<template>
	<q-card>
    
    <modal-header>Edit Item</modal-header>

		<form @submit.prevent="submitForm">
	    <q-card-section>
	    	
	    	<modal-item-fr 
	    		:fr.sync="itemToSubmit.fr"
	    		ref="modalItemFrench" />
	    	<modal-item-en 
	    		:en.sync="itemToSubmit.en"
	    		ref="modalItemEnglish" />

		    <p> {{itemToSubmit.name}} </p>
			<p> {{itemToSubmit.audio_url}} </p>
		
			<!-- <modal-upload></modal-upload> -->
			<record-button
			  :audio_url.sync="itemToSubmit.audio_url"
			  ref="RecordButton"></record-button>

	    </q-card-section>

			<modal-buttons></modal-buttons>	    

		</form>



  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { firebaseStorage } from '../../../boot/firebase'

export default {
	props: ['item', 'id'],
    data () {
        return {
			itemToSubmit: {},
			storageRef: firebaseStorage.ref(),
			gsReference: firebaseStorage.refFromURL('gs://solv-quasar-french.appspot.com/IDL001COM001.mp3')
			// audioData : event.target.files[0]			
        }
    },
		methods: {
			...mapActions('items', ['updateItem']),
			// onUpload() {
			// 	const storageRef = firebaseStorage.ref(`${this.audioData.name}`).put(this.audioData);
			// },
			submitForm() {
				this.$refs.modalItemFrench.$refs.fr.validate()
				if (!this.$refs.modalItemFrench.$refs.fr.hasError) {
					this.submitItem()
				}
			},
			submitItem() {
				this.updateItem({
					id: this.id,
					updates: this.itemToSubmit
				})
				this.$emit('close')
			}
		},
    components:{
        'modal-header': require('components/List/Modals/Shared/ModalHeader').default,
        'modal-item-fr': require('components/List/Modals/Shared/ModalItemFrench').default,
        'modal-item-en': require('components/List/Modals/Shared/ModalItemEnglish').default,
		'modal-buttons': require('components/List/Modals/Shared/ModalButtons').default,
		'modal-upload': require('components/List/Modals/Shared/ModalUpload').default,
		'record-button': require('components/List/Modals/Shared/RecordButton').default
    },
    mounted() {
        this.itemToSubmit = Object.assign({}, this.item)
    }
}
</script>

<style>
</style>
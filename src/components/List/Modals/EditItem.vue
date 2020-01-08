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
			
			<button @click.prevent="downloadUrl(itemToSubmit.name)">download</button>
			<button @click.prevent="playSound('https://firebasestorage.googleapis.com/v0/b/solv-quasar-french.appspot.com/o/6af9e11e-2841-e96f-6cf4-91b694d60e96.mp3?alt=media&token=d0e47386-309c-43e2-943a-854a2325b9f0')">play</button>

	    </q-card-section>

			<modal-buttons></modal-buttons>	    

		</form>

		<!-- <q-uploader :firebase-storage="storageRef"/>  -->
		<!-- <button @click="onUpload">Upload</button> -->

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
			downloadUrl (itemID) {
				this.storageRef.child('ID'+itemID+'.mp3').getDownloadURL().then(function(url) {
					// `url` is the download URL for 'images/stars.jpg'
					console.log(url)
					var audio = new Audio(url)
					audio.play()
					}).catch(function(error) {
				// Handle any errors
				});
			},
			playSound (sound) {
				console.log(this.storageRef.child('IDL001COM001.mp3'))
				console.log('gsReference: ', this.gsReference)
				this.gsReference.getDownloadURL()
				if(sound) {
					var audio = new Audio(sound);
					audio.play();
				}
			},
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
        'modal-buttons': require('components/List/Modals/Shared/ModalButtons').default
    },
    mounted() {
        this.itemToSubmit = Object.assign({}, this.item)
    }
}
</script>

<style>
</style>
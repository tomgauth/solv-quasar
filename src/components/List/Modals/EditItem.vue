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

	    </q-card-section>

			<modal-buttons></modal-buttons>	    

		</form>

  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    props: ['item', 'id'],
    data () {
        return {
            itemToSubmit: {}
        }
    },
		methods: {
			...mapActions('items', ['updateItem']),
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
<template>
    <q-card>
    <modal-header>Add Item</modal-header>
    <q-form 
        @submit="submitForm">
        <q-card-section>
            <modal-item-fr 
            :fr.sync="itemToSubmit.fr"
            ref="modalItemName"/>
            <modal-item-en :en.sync="itemToSubmit.en"/>
        </q-card-section>
        <modal-buttons/>
        <pre>{{ itemToSubmit }}</pre>
    </q-form>
        </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data () {
        return {
            itemToSubmit: {
                day:"", 
                type:"", 
                block_number:"", 
                name:"", 
                fr: "", 
                en: "", 
                words: [],
                selected:false
            }
        }
    },
    methods:{
        ...mapActions('items', ['addItem']),
        submitForm(){
            console.log('submit form')
            this.$refs.modalItemName.$refs.fr.validate() //gets the $refs.fr inside the fr modal part
            console.log(this.$refs.fr)
            if (!this.$refs.modalItemName.$refs.fr.hasError) {
                this.submitItem()
            }
        },
        submitItem(){
            console.log('submit item')
            this.addItem(this.itemToSubmit)
            this.$emit('close')
        }
    },
    components:{
        'modal-header': require('components/List/Modals/Shared/ModalHeader').default,
        'modal-item-fr': require('components/List/Modals/Shared/ModalItemFrench').default,
        'modal-item-en': require('components/List/Modals/Shared/ModalItemEnglish').default,
        'modal-buttons': require('components/List/Modals/Shared/ModalButtons').default
    }
}
</script>

<style>
</style>
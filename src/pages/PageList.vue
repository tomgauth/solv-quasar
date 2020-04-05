<template>
  <q-page padding class="flex-center">
    <q-btn 
      @click="showAddItem = true"
      color="primary" 
      icon="add" 
      label="Add a sentence" />

      <q-btn 
      @click="populateItems"
      color="red" 
      icon="arrow_upwards" 
      label="populate items" />
    <list-table/>
    
    <q-dialog v-model="showAddItem">
      <add-item @close="showAddItem = false" />
    </q-dialog> 
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data () {
    return {
      showAddItem: false
    }
  },
  components: {
      'list' : require('components/List/List.vue').default,
      'add-item' : require('components/List/Modals/AddItem.vue').default,
      'list-table' : require('components/List/Table.vue').default
  },
  methods: {
    ...mapActions('items', ['populateItems']),
    ...mapActions('srs', ['log', 'calculate'])
  }

}
</script>

<style lang="sass" scoped>
</style>
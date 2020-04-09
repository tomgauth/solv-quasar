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
      
      <q-toggle 
      color="yellow"
      val="lg"
      label="select sentences to review"
      v-model="dueItemsSelected"      
      />
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
      showAddItem: false,
      dueItemsSelected: false
    }
  },
  components: {
      'list' : require('components/List/List.vue').default,
      'add-item' : require('components/List/Modals/AddItem.vue').default,
      'list-table' : require('components/List/Table.vue').default
  },
  watch: {
    dueItemsSelected: function(value, oldValue) {
      this.selectDueItems(value)
    }
  },
  methods: {
    ...mapActions('items', ['populateItems', 'selectDueItems']),
    ...mapActions('srs', ['log', 'calculate']),
  }

}
</script>

<style lang="sass" scoped>
</style>
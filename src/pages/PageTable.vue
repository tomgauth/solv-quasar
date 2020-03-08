<template>
  <q-page padding class="flex-center">
    <qlist/>
    <q-btn 
      @click="showAddItem = true"
      color="primary" 
      icon="add" 
      label="Add a sentence" />
    <q-dialog v-model="showAddItem">
      <add-item @close="showAddItem = false" />
    </q-dialog> 
  </q-page>
</template>

<script>
//import { mapActions } from 'vuex'
export default {
    data () {
    return {
      showAddItem: false
    }
  },
  components: {
      'qtable' : require('components/List/Table.vue').default,
      'add-item' : require('components/List/Modals/AddItem.vue').default
  }

}
</script>

<style lang="sass" scoped>
</style>
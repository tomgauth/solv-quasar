<template>
  <q-page class="q-pa-md">
		<q-list
      v-if="Object.keys(items).length"
			separator
			bordered>
      
      <item
      v-for="(item, key) in items"
      :key="key"
      :item="item"
      :id="key"></item>



		</q-list>
    <q-dialog v-model="showAddItem">
      <add-item @close="showAddItem = false"/>
    </q-dialog>
  </q-page>
</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {
  data(){
    return {
      showAddItem: false
    }
  },

  computed: {
      ...mapState('items', ['items']) // ,
  },
  components: {
    'item' : require('components/List/Item.vue').default,
    'add-item' : require('components/List/Modals/AddItem.vue').default
  }
}
</script>


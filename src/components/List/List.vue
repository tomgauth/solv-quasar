<template>
  <q-page class="q-pa-md">
    <search />
		<q-list
      v-if="Object.keys(items).length"
			separator
			bordered>

		  <no-items
			v-if="!Object.keys(items).length && !search"></no-items>

      <p v-if="search && !Object.keys(items).length">No search results.</p>

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
      ...mapState('items', ['items', 'search']),
      ...mapGetters('items', ['items'])
  },
  components: {
    'item' : require('components/List/Item.vue').default,
    'add-item' : require('components/List/Modals/AddItem.vue').default,
    'search' : require('components/List/Tools/Search.vue').default,
    'no-items' : require('components/List/NoItems.vue').default
  }
}
</script>


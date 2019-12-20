<template>
  <q-page class="q-pa-md">
		<q-list
			separator
			bordered>
      <item
      v-for="(item, key) in items"
      :key="key"
      :item="item"
      :id="key"></item>



		</q-list>
  </q-page>
</template>

<script>

import { mapGetters } from 'vuex'

export default {

  computed: {
      ...mapGetters('items', ['items']) // ,
  },
  components: {
    'item' : require('components/List/Item.vue').default
  }
}
</script>


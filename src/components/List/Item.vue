<template>
    <div>
		  <q-item 
		  	@click="updateItem({ id: id, updates: { selected: !item.selected } } )"
		  	:class="!item.selected ? 'bg-white-1' : 'bg-green-1'"
		  	clickable
		  	v-ripple>
		    <q-item-section side top>
		      <q-checkbox
          :value="item.selected"
          class="no-pointer-events" />
		    </q-item-section>

		    <q-item-section>
		      <q-item-label>
		      	{{ item.fr }} {{id}}
		      </q-item-label>
		    </q-item-section>

		    <q-item-section>
		          <q-item-label
		          	caption>
		          	<small>{{ item.en }}</small>
		          </q-item-label>
        </q-item-section>

        <q-item-section>
		      <q-item-label>
		      	{{ item.name }}
		      </q-item-label>
		    </q-item-section>
		  </q-item>
    </div>
</template>


<script>
import { mapActions } from 'vuex'

export default {
    props: ['item', 'id'],
    methods: {
      ...mapActions('items', ['updateItem'])
    }
}
</script>


<style scoped>

</style>
<template>
	<q-banner class="bg-grey-3">
    <template v-slot:avatar>
      <q-icon name="check" color="primary" />
    </template>
    No Items to do today!
    <template v-slot:action>
      <q-btn
        @click="$root.$emit('showAddItem')"
      	flat
      	color="primary"
      	label="Add Item" />
    </template>
  </q-banner>
</template>

<script>
	export default {
	
	}
</script>
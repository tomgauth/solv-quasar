<template>
    <div class="row q-mb-sm">
        <q-input 
        @input="$emit('update:fr', $event)"
        autofocus
        outlined 
        ref="fr"
        :value="fr" 
        :rules="[val => !!val || 'required']"
        label="Sentence in French" />
    </div>
</template>

<script>
export default {
    props:['fr']

}
</script>

<style>

</style>
<template>
    <div class="row q-mb-sm">
        <q-input 
        @input="$emit('update:en', $event)"
        autofocus
        outlined 
        ref="en"
        :value="en" 
        :rules="[val => !!val || 'required']"
        label="Sentence in English" />
    </div>
</template>

<script>
export default {
    props:['en']
}
</script>

<style>

</style>
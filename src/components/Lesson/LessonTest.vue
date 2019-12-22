<template>
    <q-card class="my-card" align="center">
      <q-card-section>
        {{ sentenceToRepeat }}
      </q-card-section>
      <a v-for="(word, key) in wordsPrompt"
        :key="key">
        <q-chip
        v-if="wordsAnswer.includes(word)"
          class="ma-2"
          color="green"
          text-color="white">
          {{word}}
        </q-chip>
        <q-chip v-else-if="!wordsAnswer.includes(word)"
        class="ma-2">...</q-chip>
      </a>
      <q-card-section class="q-pa-md">

      <div class="q-gutter-md" style="max-width: 300px">
        <q-input v-model="Answer" label="Answer" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">
             
            </div>
          </template>
        </q-input>
      </div>
      </q-card-section>
      <q-card-actions align="around" >
        <q-btn color="amber" @click="nextSentence()"  label="Next Sentence" />
      </q-card-actions>
    </q-card>

</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'lesson-test',
  data: () => ({
    activeClass: "green--text",
    sentences: {'IDL001QNA001': {selected:false, day:"001", type:"QNA", block_number:"001", name:"L001QNA001", fr: "Comment ça va ?", en: "How is it going ?", words: ["comment", "ça", "va"]},
        'IDL001MIP001': {selected:false, day:"001", type:"MIP", block_number:"001", name:"L001MIP001", fr: "ça va", en: "It’s okay", words: ["ça", "va"]},
        },
    sentenceIndex: 0,
    Answer: "",
    sourceLanguage: "",
    recognitionLang: "fr-FR",
    targetLanguage: "fr",
    toggle: false,
    voice: "French Female"
  }),
  watch: {
        Answer: function () {
        if ((JSON.stringify(this.wordsPrompt) === JSON.stringify(this.wordsAnswer))) {   
          // show all words in green, then success
          setTimeout(this.success, 500)  
          
        }
    }
  },
  computed: {
    ...mapGetters('items', ['items']),
    sentenceToRepeat: function () {
        return this.sentences[this.sentenceIndex].en
    },
    wordsPrompt: function () {
      return this.sentences[this.sentenceIndex].fr.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\_`~()]/g,"").replace(/\s+/g, " ").split(' ').filter(String)
    },
    wordsAnswer: function () {
      return this.Answer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"").replace(/\s+/g, " ").split(' ')
    }
  },
  methods: {
    nextSentence: function () {
      //if no nextSentence, session is done
      console.log(this.sentences.length)
      console.log(this.sentenceIndex)
      if (this.sentenceIndex < this.sentences.length - 1) {
        this.sentenceIndex = this.sentenceIndex + 1
        } else {
          this.sentenceIndex = 0
          this.$q.dialog({
            title: "confirm",
            message: "You're done for today!",
            cancel: true,
            persistent: true,
            }).onOk(() => {
              console.log('>>>> OK')
              // todo: redirect to pick sentences page

            })
          // implement a modal / alert to say that the session is done
        }
    },
    success: function () {
      // show success
      this.$q.notify({
        message: 'Correct answer',
        color: 'secondary'
      })
    }
  }

}

</script>
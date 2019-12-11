<template>
    <q-card class="my-card" align="center">
      <q-card-section>
        {{ sentenceToRepeat }}
      </q-card-section>
      <a v-for="word in wordsPrompt">
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
      <q-field label="Type the answer here" stack-label>
        <template v-slot:control>

            <div class="q-pa-md" style="max-width: 300px">
              <q-input
                v-model="Answer"
                filled
                autogrow
              />
            </div>

        </template>
      </q-field>
      <q-card-actions align="around" >
        <q-btn color="primary" label="confirm" />
        <q-btn color="amber" @click="nextSentence()"  label="Next Sentence" />
      </q-card-actions>
    </q-card>

</template>
<script>


export default {
  name: 'lesson-test',
  data: () => ({
    activeClass: "green--text",
    sentences: [
      {fr: "Demain, c'est la révolution!", en: "Tomorrow is revolution"},
      {fr: "le gros pigeon", en: "the fat pigeon"},
      {fr: "Dans la cave", en: "in the basement"}
    ],
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
          this.success()
        }
    }
  },
  computed: {
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
          // implement a modal / alert to say that the session is done
        }
    },
    success: function () {
      // show success
      this.nextSentence()
    }
  }

}

</script>
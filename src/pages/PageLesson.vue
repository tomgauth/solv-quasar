<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        {{ prompt }}
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
      <q-field outlined label="Type here if you can't talk"  stack-label>
        <template v-slot:control>
          <template>
          <div class="q-pa-md" style="max-width: 300px">
            <q-input
              v-model="Answer"
              filled
              autogrow
            />
          </div>
        </template>
        </template>
      </q-field>
      <q-card-actions align="around" >
        <q-btn color="primary" @click="read();" glossy label="Play" />
        <q-btn color="deep-orange" @mousedown="start();" @mouseup="endSpeechRecognition()" glossy label="Record" />
        <q-btn color="amber" glossy label="Next Sentence" />
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>

let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = SpeechRecognition ? new SpeechRecognition() : false;


export default {
  data: () => ({
    activeClass: "green--text",
    sentences: ["le gros pigeon","bonjour", "Dans la cave", "Demain, c'est la révolution!"],
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
          this.read()          
        }
    }
  },
  computed: {
    sentenceToRepeat: function () {
      return this.sentences[this.sentenceIndex]
    },
    wordsPrompt: function () {

      return this.sentenceToRepeat.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\_`~()]/g,"").replace(/\s+/g, " ").split(' ').filter(String)
    },
    wordsAnswer: function () {
      return this.Answer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"").replace(/\s+/g, " ").split(' ')
    }
  },
  methods: {
    startSpeechRecognition: function() {
      final_transcript = "";

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = this.recognitionLang;
      console.log(recognition.lang);
      console.log(recognition);
      this.toggle = true;

      recognition.onresult = event => {
        let interimTranscript = "";
        for (
          let i = event.resultIndex, len = event.results.length;
          i < len;
          i++
        ) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        this.Answer = interimTranscript.toLowerCase();
      };
      recognition.start();
    },
    endSpeechRecognition: function() {
      recognition.stop();
      this.toggle = false;
    },
    read: function() {
      console.log(this.voice);
      return new Promise(resolve => {
        responsiveVoice.cancel();
        console.log(this.voice + this.sentenceToRepeat);
        responsiveVoice.speak(this.sentenceToRepeat, this.voice);
      });
    },
    start: function() {
      this.startSpeechRecognition();
    },
    nextSentence: function () {
      return this.Answer = ''
      (this.sentenceIndex = this.sentenceIndex + 1).then(
      this.read())
    }
  }
  // name: 'PageIndex'
  // TODO: implement tts recogniser https://codepen.io/tomgauth/pen/PMygER
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>
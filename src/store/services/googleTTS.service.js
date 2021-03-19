import axios from 'axios';

const key = 'AIzaSyC7OHWbeIffr0FVNdWKs0xNDusXpU-ERAs';

async function getAudio(text,voiceConfig){
    return axios.post('https://texttospeech.googleapis.com/v1/text:synthesize',{
        "input":{
          "text": text
        },
        "voice":voiceConfig,
        "audioConfig":{
          "audioEncoding":"LINEAR16"
        }
      },{
          params:{
              key
          }
        });
}

export default { getAudio }
// status constant
export const audioStatusEnum = Object.freeze({
    "pending":1,
    "playing":2,
    "paused":3,
    "played":4
});
// intermediate sound type
export const interTypeEnum = Object.freeze({
    "pause":1,
    "track":2,
});
// Learning mode
export const learningMode = Object.freeze({
    "comprehension":1,
    "recall":2,
    "listenRepeat":3
});
// Repetition Type
export const repetitionType = Object.freeze({
    "english":1,
    "french":2
});

export const googleTTSVoicesConfig = Object.freeze({
    "french":{
        languageCode : "fr-CA",
        name : "fr-CA-Wavenet-D",
        ssmlGender : "MALE"
    },
    "english":{
        languageCode : "en-US",
        name : "en-US-Wavenet-I",
        ssmlGender : "MALE"
    },
});
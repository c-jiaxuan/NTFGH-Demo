// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3.

Purpose:
This file handles the transcription of speech to text using AWS Transcribe

*/
// snippet-start:[transcribeClient.JavaScript.streaming.createclientv3]
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import * as awsID from "./awsID.js";

/** @type {MicrophoneStream} */
const MicrophoneStreamImpl = MicrophoneStream.default;

const SAMPLE_RATE = 44100;
/** @type {MicrophoneStream | undefined} */
let microphoneStream = undefined;
/** @type {TranscribeStreamingClient | undefined} */
let transcribeClient = undefined;
let streamingActive = false;

export const startRecording = async (language, callback) => {
  if (!language) {
    return false;
  }
  if (microphoneStream || transcribeClient) {
    stopRecording();
  }
  createTranscribeClient();
  try {
    await createMicrophoneStream(); // Wait for this to finish successfully
  } catch (err) {
    console.error("Failed to initialize mic:", err.message);
    throw err; // Or notify UI with a friendly message
  }

  await startStreaming(language, callback);
};

export const stopRecording = function () {
  streamingActive = false;

  if (microphoneStream) {
    microphoneStream.stop();
    microphoneStream.destroy();
    microphoneStream = undefined;
  }

  if (transcribeClient) {
    transcribeClient.destroy(); // closes WebSocket
    transcribeClient = undefined;
  }
};

const createTranscribeClient = () => {
  transcribeClient = new TranscribeStreamingClient({
    region: awsID.REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: awsID.REGION }),
      identityPoolId: awsID.IDENTITY_POOL_ID,
    }),
  });
};

// const createMicrophoneStream = async () => {
//   microphoneStream = new MicrophoneStreamImpl();
//   microphoneStream.setStream(
//     await window.navigator.mediaDevices.getUserMedia({
//       video: false,
//       audio: true,
//     }),
//   );
// };

const createMicrophoneStream = async () => {
  try {
    const userMedia = await window.navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    microphoneStream = new MicrophoneStreamImpl();
    microphoneStream.setStream(userMedia);
  } catch (error) {
    handleMicrophoneError(error);
  }
};

const handleMicrophoneError = (error) => {
  console.error("Microphone access error:", error);

  // Example: you can show an in-app notification or return an error flag
  // or call a callback to notify the user in the UI
  // e.g., displayMicrophoneError("Please enable microphone access in your browser settings.");

  // Or propagate the error upward if needed
  throw new Error("Microphone permission denied or not available.");
};

const startStreaming = async (language, callback) => {
  if (!microphoneStream) {
    throw new Error("Cannot get audio stream. Microphone not initialized.");
  }

  const command = new StartStreamTranscriptionCommand({
    LanguageCode: language,
    MediaEncoding: "pcm",
    MediaSampleRateHertz: SAMPLE_RATE,
    AudioStream: getAudioStream(),
  });
  
  streamingActive = true;

  const data = await transcribeClient.send(command);
  // for await (const event of data.TranscriptResultStream) {
  //   for (const result of event.TranscriptEvent.Transcript.Results || []) {
  //     if (result.IsPartial === false) {
  //       const noOfResults = result.Alternatives[0].Items.length;
  //       for (let i = 0; i < noOfResults; i++) {
  //         console.log(result.Alternatives[0].Items[i].Content);
  //         callback(result.Alternatives[0].Items[i].Content + " ");
  //       }
  //     }
  //   }
  // }
  for await (const event of data.TranscriptResultStream) {
    for (const result of event.TranscriptEvent.Transcript.Results || []) {
      const transcript = result.Alternatives[0]?.Transcript || "";
      if (transcript) {
        callback(transcript, result.IsPartial); // Pass transcript and whether it's partial
      }
    }
  }
};

const getAudioStream = async function* () {
  if (!microphoneStream) {
    throw new Error(
      "Cannot get audio stream. microphoneStream is not initialized.",
    );
  }

  for await (const chunk of microphoneStream) {
    if (!streamingActive) break; // Stop if user called stopRecording()
    if (chunk.length <= SAMPLE_RATE) {
      yield {
        AudioEvent: {
          AudioChunk: encodePCMChunk(chunk),
        },
      };
    }
  }
};

const encodePCMChunk = (chunk) => {
  /** @type {Float32Array} */
  const input = MicrophoneStreamImpl.toRaw(chunk);
  let offset = 0;
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return Buffer.from(buffer);
};

// snippet-end:[transcribeClient.JavaScript.streaming.createclientv3]

// app/api/openai/route.ts
import { streamText } from "ai";

import Hedra from 'hedra-node';
import axios from "axios";
import FormData from "form-data";
import fs from 'fs'
import path from 'path';
import OpenAI from "openai";


// export const runtime = "edge";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

const blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return theBlob as File;
}

function sleep(ms: Number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function POST(req: Request) {
    try {


        const input_txt_data = await req.json();
        const chatText = input_txt_data.text

        const api_key = process.env.NEXT_PUBLIC_Hedra_API_KEY || "";

        const baseUrl = "https://api.hedra.com/web-app/public"

        const headers = {
            'X-Api-Key': api_key,
            "Content-Type": "application/json"
        }

        // Image assets create and upload 
        const uploadImg = {
            "name": '001.png',
            "type": 'image'
        }
        const uploadImageData = await axios.post(baseUrl + '/assets', uploadImg, { headers: headers });

        const imgFilePath = path.join(process.cwd(), 'public', 'assets', '001.png');
        const img = fs.readFileSync(imgFilePath);

        const formDataForImage = new FormData();
        formDataForImage.append('file', img, '001.png');

        const multiFormHeader = {
            'X-Api-Key': api_key,
            "Content-Type": "multipart/form-data",
        }
        const imageId = uploadImageData.data.id;
        const rlt = await axios.post(baseUrl + `/assets/${imageId}/upload`, formDataForImage, { headers: multiFormHeader })

        const modelId = "d1dd37a3-e39a-4854-a298-6510289f9cf2"


        // Text to speech and create assets and upload 
        const currentTime = new Date()
        const audioFileName = '001-' + currentTime.getTime() + '.wav';

        const speechFile = path.join(process.cwd(), 'public', 'assets', audioFileName);

        const mp3 = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: "coral",
            input: chatText,
            instructions: "Speak in a cheerful and feminie.",
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);

        const uploadAudio = {
            "name": audioFileName,
            "type": 'audio'
        }
        const uploadAudioData = await axios.post(baseUrl + '/assets', uploadAudio, { headers: headers });

        const audio = fs.readFileSync(speechFile);
        const formDataForAudio = new FormData();
        formDataForAudio.append('file', audio, audioFileName);
        const audioId = uploadAudioData.data.id;
        const audioResult = await axios.post(baseUrl + `/assets/${uploadAudioData.data.id}/upload`, formDataForAudio, { headers: multiFormHeader })

        const generationRequestData = {
            "type": "video",
            "ai_model_id": modelId,
            "start_keyframe_id": imageId,
            "audio_id": audioId,
            "generated_video_inputs": {
                "text_prompt": "feminine assistance",
                "resolution": '540p',
                "aspect_ratio": '16:9',
            },
        }
        const generateVideo = await axios.post(baseUrl + '/generations', generationRequestData, { headers: headers })

        const generatedVideoId = generateVideo.data.id
        let status = ''
        let finalUrl = ''
        while (1) {
            const generateVideo = await axios.get(baseUrl + `/generations/${generatedVideoId}/status`, { headers: headers })
            console.log('Status => ', generateVideo.data.status)
            status = generateVideo.data.status;
            await sleep(10000);

            if (status == 'complete' || status == 'error') {
                finalUrl = status == 'complete' ? generateVideo.data.url : 'Video generation failed:';
                break;
            }
        }
        return new Response(
            JSON.stringify(finalUrl)
        );

    } catch (error) {
        console.log('Hedra server is not working', error)
        return new Response(
            JSON.stringify({ error: error }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
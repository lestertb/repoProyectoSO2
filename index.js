require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const {AZURE_ENDPOINT, AZURE_FACE_KEY1} = process.env;

const imageData = fs.readFileSync('./images/faceEjemplo.png');


async function main() {

    const response = await axios.post(`${AZURE_ENDPOINT}face/v1.0/detect?returnFaceAttributes=age,gender,smile,hair,emotion&returnFaceId=false&recognitionModel=recognition_03&faceIdTimeToLive=60`, imageData, {
        headers: {
            "Ocp-Apim-Subscription-Key": AZURE_FACE_KEY1,
            "Content-Type": "application/octet-stream",
        },
    });
    console.log("response: ", response.data[0]);
}

main();
const fs    = require('fs');
const http  = require('axios');

const VALID_EXTENSION = [ 'png','jpeg','jpg','gif','bmp'];
const IMAGES_FOLDER = './images';
const {
    AZURE_FACE_ENDPOINT, 
    AZURE_FACE_KEY1, 
    AZURE_ACTION_ENDPOINT,
    AZURE_ACTION_KEY1
} = process.env;

// se usa para extraer la extension de la imagen;
const getExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
}

// trae todas las imagenes con extension valida dentro del folder de imagenes
exports.getFiles = () => {
    const files = fs.readdirSync(IMAGES_FOLDER);
    var result = [];

    for(let file of files){
        let extension = getExtension(file);
        if(VALID_EXTENSION.indexOf(extension) != -1){
            result.push(file);
        }
    }

    return result;
}

// realiza la peticion necesaria para analyzar el restro de la imagen
exports.analyzeFace = async (filename) => {
    const image = fs.readFileSync(`${IMAGES_FOLDER}/${filename}`);

    const result = await http({ // realiza la peticion al servicio de face
        method: 'post',
        url:`${AZURE_FACE_ENDPOINT}face/v1.0/detect`,
        data:image,
        params:{
            returnFaceAttributes:'age,gender,smile,hair,emotion',
            returnFaceId:false,
            recognitionModel:'recognition_03',
            faceIdTimeToLive:60
        },
        headers:{
            "Ocp-Apim-Subscription-Key": AZURE_FACE_KEY1,
            "Content-Type": "application/octet-stream"
        }
    });

    return result.data
}


// realiza la peticion necesaria para analyzar las acciones de la imagen
exports.analyzeAction = async (filename) => {
    const image = fs.readFileSync(`${IMAGES_FOLDER}/${filename}`);

    const result = await http({ // realiza la peticion al servicio de video
        method: 'post',
        url:`${AZURE_ACTION_ENDPOINT}vision/v3.2/analyze`,
        data:image,
        params:{
            visualFeatures:'Adult,Description,Objects,Faces',
            language:'es'
            
        },
        headers:{
            "Ocp-Apim-Subscription-Key": AZURE_ACTION_KEY1,
            "Content-Type": "application/octet-stream"
        }
    });

    return result.data
}

// de un objeto json devuelve el valor más alto del objeto
exports.getMaxValue = (json) => {
    var keyMax = null,valueMax = 0;
    for(var key in json){
        if(json[key] > valueMax){
            keyMax = key;
        }
    }
    return keyMax;
}

module.exports;
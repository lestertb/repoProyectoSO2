const fs    = require('fs');
const http  = require('axios');
const spawn = require("child_process").spawn;

const VALID_EXTENSION = [ 'png','jpg','gif','bmp'];
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

exports.analyzeStatistics = (results = [] ) => {
    
    const statistics = { // estas son estadisticas en general
        adultContent:0,
        goreContent:0,
        racyContent:0,
        emotions:{
            anger:0,
            contempt:0,
            disgust:0,
            fear:0,
            happiness:0,
            neutral:0,
            sadness:0,
            surprise:0,
        },
        genders:{
            male:0,
            female:0
        },
        objects:[],
        actions:[]
    }

    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        
        for(face of result.faces ){
            const element = face.faceAttributes;
            if(element.gender == 'female'){
                statistics.genders.female += 1;
            }

            if(element.gender == 'male'){
                statistics.genders.male += 1;
            }

            var key = this.getMaxValue(element.emotion);
            if(key){
                statistics.emotions[key] +=1;
            }
        }

        if(result.adult.isAdultContent ){
            statistics.adultContent +=1;
        }

        if(result.adult.isRacyContent ){
            statistics.racyContent+=1;
        }

        if(result.adult.isGoryContent){
            statistics.goreContent+=1;
        }

        statistics.objects= statistics.objects.concat(result.objects);
        if( result.description.captions[0] ){
            statistics.actions.push( result.description.captions[0].text );
        }
    }

    console.log(statistics);
    return statistics;
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

exports.analyzePython = async (files) => {
    const pythonProcess = spawn('python',["analyze.py", files, AZURE_FACE_ENDPOINT, AZURE_FACE_KEY1, AZURE_ACTION_ENDPOINT, AZURE_ACTION_KEY1]);
    console.log("Empezo")
    return new Promise( (resolve, reject) => {
        pythonProcess.stdout.on('data', (data) => {
            try {
                var parsedData = JSON.parse(data.toString());
                var statistics = this.analyzeStatistics(parsedData.response)
                resolve(statistics);     
            } catch (error) {}         
        }); 
        pythonProcess.on('error', (error) => {
            console.log(error)
            reject()
        }) 
    });
}

module.exports;
require('dotenv').config();
const axios = require('axios');
const util = require('./util');

const files = util.getFiles();

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


async function analyze(files){
    // Tal vez aqui hacer el multiprocesamiento. NodeJS tiene algo llamado "cluster" para la invocacion de subprocesos.
    for( let file of files){
        console.log("Analizando ",file)
        const action = await util.analyzeAction(file); // contiene la iformacion total de la escena
        
        if(action.faces.length > 0){ // tiene caras en la imagen

            const faces = await util.analyzeFace(file);
            action.faces = faces;// remplazo la variable con el analisis detallado

            for(face of faces ){
                const element = face.faceAttributes;
                if(element.gender == 'female'){
                    statistics.genders.female += 1;
                }

                if(element.gender == 'male'){
                    statistics.genders.male += 1;
                }

                var key = util.getMaxValue(element.emotion);
                if(key){
                    statistics.emotions[key] +=1;
                }
            }

        }
    
        if(action.adult.isAdultContent ){
            statistics.adultContent +=1;
        }

        if(action.adult.isRacyContent ){
            statistics.racyContent+=1;
        }

        if(action.adult.isGoryContent){
            statistics.goreContent+=1;
        }

        statistics.objects= statistics.objects.concat(action.objects);
        if( action.description.captions[0] ){
            statistics.actions.push( action.description.captions[0].text );
        }
    }
}

analyze(files).then( result => {
    console.log(statistics);
});


module.exports;





        
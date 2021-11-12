/**
 * Importaciones del sistema
 */
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const util = require('./util');
const app = express();
const logger = require('morgan');


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


//Configuracion del servidor
app.set('port', process.env.PORT || process.env.APP_PORT || 8081);

app.use(logger('dev'));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin); //cambia esto 
    res.header("Access-Control-Allow-Headers", "x-requested-with, content-type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.static(__dirname + '/public'));

app.get('/api/analyze', (req,res,next) => {
    const files = util.getFiles();

    // meter multicore aquí 
    analyze(files).then( response => {
        console.log(statistics);
        res.status(200).json({success:true, data:statistics});
    })
});


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

app.listen(app.get('port'),() => {
    console.log(`server running in http://localhost:${app.get('port')}`);
});

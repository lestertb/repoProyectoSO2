/**
 * Importaciones del sistema
 */
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const util = require('./util');
const app = express();
const logger = require('morgan');

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
        const statistics= util.analyzeStatistics(response)
    
        res.status(200).json({success:true, data: statistics });
    })
});

app.get('/api/python', (req,res,next) => {
    const files = util.getFiles();

    util.analyzePython(files).then( result => {
        console.log("Respuesta")
        res.status(200).json({success:true, data:result});
    },error => {
        res.status(200).json({success:false, data:null});
    });
});


async function analyze(files){
    var result = []
    for( let file of files){
        console.log("Analizando ",file)
        const action = await util.analyzeAction(file); // contiene la iformacion total de la escena
        
        if(action.faces.length > 0){ // tiene caras en la imagen

            const faces = await util.analyzeFace(file);
            action.faces = faces;// remplazo la variable con el analisis detallado

        }

        result.push(action)
    }
    return result
}

app.listen(app.get('port'),() => {
    console.log(`server running in http://localhost:${app.get('port')}`);
});

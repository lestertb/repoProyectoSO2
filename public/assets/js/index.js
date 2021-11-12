var miCanvas ,miCanvas2, miCanvas3,charst,loadingAlert, timerTotal;

function load(){
    miCanvas =  document.getElementById("MiGrafico").getContext("2d");
    miCanvas2 = document.getElementById("MiGrafico2").getContext("2d");
    miCanvas3 = document.getElementById("MiGrafico3").getContext("2d");
    charst = document.getElementById('charts');
    loadingAlert = document.getElementById('loading');
    timerTotal = document.getElementById('timer');
} 

function normal(){
    loadingAlert.style.visibility = "visible";
    var begin=Date.now();
    axios.get('/api/analyze')
    .then(response => {
        var end= Date.now();
        var timeSpent=(end-begin)/1000+"secs";
        const data = response.data.data;
        loadingAlert.style.visibility = "hidden";
        charst.style.visibility = "visible";
        createChart1(data);
        createChart2(data);
        createChart3(data);
        timerTotal.innerHTML = 'Duración: ' + timeSpent;
    })
    .catch(error => console.error(error));

}


function multiprocessing(){
    loadingAlert.style.visibility = "visible";
    var begin=Date.now();
    axios.get('/api/python')
    .then(response => {
        var end= Date.now();
        var timeSpent=((end-begin)-1000)/1000+"secs";
        const data = response.data.data;
        loadingAlert.style.visibility = "hidden";
        charst.style.visibility = "visible";
        createChart1(data);
        createChart2(data);
        createChart3(data);
        timerTotal.innerHTML = 'Duración: ' + timeSpent;
    })
    .catch(error => console.error(error));
}

function createChart1(dataTest){
    const myChart = new Chart(miCanvas, {
        type:"bar",
        data: {
                labels: ['adultContent', 'goreContent', 'racyContent'],
                datasets:[
                    {
                        label:"Type of content",
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1,
                        data:[dataTest.adultContent,dataTest.goreContent,dataTest.racyContent]
                    }
                ]
            },
        options: {
            scales: {
                y: {
                    max: 10,
                    min: 0,
                    ticks: {
                        stepSize: 0.5
                    }
                }
            }
        }
    });
}


function createChart2(dataTest){
    console.log(dataTest, dataTest.emotions);
    const myChart2 = new Chart(miCanvas2, {
        type:"bar",
        data: {
                labels: ['anger', 'contempt', 'disgust' , 'fear', 'happiness', 'neutral', 'sadness', 'surprise'],
                datasets:[
                    {
                        label:"Type of emotions",
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgb(0,0,0)',
                            'rgb(220,220,220)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgb(0,0,0)',
                            'rgb(220,220,220)'
                        ],
                        borderWidth: 1,
                        data:[dataTest.emotions.anger, dataTest.emotions.contempt,
                            dataTest.emotions.disgust, dataTest.emotions.fear,
                            dataTest.emotions.happiness, dataTest.emotions.neutral,
                            dataTest.emotions.sadness, dataTest.emotions.surprise]
                    }
                ]
            },
        options: {
            scales: {
                y: {
                    max: 10,
                    min: 0,
                    ticks: {
                        stepSize: 0.5
                    }
                }
            }
        }
    });
}


function createChart3(dataTest){
    const myChart3 = new Chart(miCanvas3, {
        type:"pie",
        data: {
                labels: ['male', 'female'],
                datasets:[
                    {
                        label:"Type of emotions",
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 99, 132, 0.8)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 1,
                        data:[dataTest.genders.male, dataTest.genders.female]
                    }
                ]
            },
    });
}
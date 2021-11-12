let miCanvas = document.getElementById("MiGrafico").getContext("2d");

dataTest = {
    adultContent: 0,
    goreContent: 1, 
    racyContent: 1, 
    emotions: {     
      anger: 0,     
      contempt: 0,  
      disgust: 0,   
      fear: 0,
      happiness: 0,
      neutral: 2,
      sadness: 0,
      surprise: 1
    },
    genders: { male: 1, female: 2 },
    objects: [
      {
        rectangle: [Object],
        object: 'car',
        confidence: 0.588,
        parent: [Object]
      },
      {
        rectangle: [Object],
        object: 'Van',
        confidence: 0.522,
        parent: [Object]
      },
      { rectangle: [Object], object: 'person', confidence: 0.77 },
      {
        rectangle: [Object],
        object: 'Lipstick',
        confidence: 0.744,
        parent: [Object]
      },
      { rectangle: [Object], object: 'person', confidence: 0.718 },
      { rectangle: [Object], object: 'person', confidence: 0.76 },
      { rectangle: [Object], object: 'person', confidence: 0.736 }
    ],
    actions: [
      'una mujer y un niño sentados en el suelo',
      'la cara de una mujer',
      'un hombre con un niño en bicicleta',
      'hombre con tatuaje en el brazo'
    ]
  }

//chart 1
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
                max: 5,
                min: 0,
                ticks: {
                    stepSize: 0.5
                }
            }
        }
    }
});

//chart 2
let miCanvas2 = document.getElementById("MiGrafico2").getContext("2d");

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
                max: 5,
                min: 0,
                ticks: {
                    stepSize: 0.5
                }
            }
        }
    }
});


//chart 3
let miCanvas3 = document.getElementById("MiGrafico3").getContext("2d");

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
    options: {
        scales: {
            y: {
                max: 5,
                min: 0,
                ticks: {
                    stepSize: 0.5
                }
            }
        }
    }
});

//chart 4

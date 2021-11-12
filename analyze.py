import sys
from multiprocessing import Pool 
import json
import os
import requests
from dotenv import load_dotenv
from requests.models import Response
load_dotenv()


def chunks(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def analyze(data):

    ACTION_URL = os.getenv('AZURE_ACTION_ENDPOINT') + 'vision/v3.2/analyze'
    ACTION_KEY = os.getenv('AZURE_ACTION_KEY1')

    FACE_KEY = os.getenv('AZURE_FACE_KEY1')
    FACE_URL = os.getenv('AZURE_FACE_ENDPOINT') + 'face/v1.0/detect'

    headers_dict = {
        "Ocp-Apim-Subscription-Key": ACTION_KEY, 
        "Content-Type": "application/octet-stream"
    }

    headers_dict2 = {
        "Ocp-Apim-Subscription-Key": FACE_KEY, 
        "Content-Type": "application/octet-stream"
    }

    params_dict = {
        "visualFeatures": "Adult,Description,Objects,Faces",
        "language":"es"
    }

    params_dict2 = {
        "returnFaceAttributes": "age,gender,smile,hair,emotion",
        "returnFaceId":False,
        "recognitionModel":"recognition_03",
        "faceIdTimeToLive":"60"
    }
    responseData = []    
    for image in data:
        with open("images/"+image, 'rb') as file:
            data = file.read()
            response = requests.post(url = ACTION_URL, headers=headers_dict,params = params_dict, data=data)
            response = response.json()
            if(len(response['faces']) > 0):
                faces = requests.post(url = FACE_URL, headers=headers_dict2,params = params_dict2, data=data)
                
                response['faces'] = faces.json()

            responseData.append(response)
    return responseData



if __name__ == '__main__':
    files = sys.argv[1].split(',')
    lotes = list(chunks(files,10))

    with Pool(4) as subProcess:
        result = subProcess.map(analyze,lotes)
        responseArray = []
        for item in result:
            for item2 in item:
                responseArray.append(item2)
        print(json.dumps({'response':responseArray}))

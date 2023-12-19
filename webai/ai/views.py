from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from pydub import AudioSegment
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import io
import base64
from django.views.decorators.csrf import csrf_exempt
import numpy as np
import librosa
import librosa.display
import shutil
from django.conf import settings
import os
from . import predict
from . import predict2
from .predict_image import convert_and_classify
from .predict_image_gradcam import grad_cam_predict
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"




statuss='_'

def say_hello(request):
    return render(request, 'hello.html')
def trangchu(request):
    return render(request, 'index.html')
@csrf_exempt
def get_waveform_image(request):
    if request.method == 'POST':
        print("hji")
        audio_file = request.FILES['audio_file']
        print('Audio File:', audio_file.name)
        # Xử lý tệp âm thanh với pydub
        y, sr = librosa.load(audio_file, sr=None)

        # Tạo Mel spectrogram
        mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sr)

        # Chuyển Mel spectrogram thành dB
        mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)
        
        # Hiển thị Mel spectrogram
        # plt.figure(figsize=(10, 4)
        plt.clf()
        librosa.display.specshow(mel_spectrogram_db, x_axis='time', y_axis='mel')
        plt.colorbar(format='%+2.0f dB')
        plt.title('Mel Spectrogram')
        print("in bieu do")
        # Chuyển Mel spectrogram thành hình ảnh
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        image_name = 'mel_spectrogram.png'  # Tên hình ảnh bạn muốn sử dụng
        image_path = os.path.join(settings.STATICFILES_DIRS[0], 'images', image_name)
        if os.path.exists(image_path):
            os.remove(image_path)
        plt.savefig(image_path, format='png')
        buf.seek(0)

        # Chuyển hình ảnh thành dạng base64
        # mel_spectrogram_image = base64.b64encode(buf.read()).decode('utf-8')
        # print("in bieu do2")
        converted=True
        return JsonResponse({'converted': converted})

    return JsonResponse({'error': 'Không thể tạo biểu đồ waveform.'})
@csrf_exempt
def get_predict(request):
    if request.method == 'POST':
        print("hji2")
        audio_file = request.FILES['audio_file']
        print('Audio File:', audio_file.name)
        # Xử lý tệp âm thanh với pydub
    
        ketqua=predict.predict(audio_file)
        print('ketqua ', ketqua)
        # Tạo Mel spectrogram
        if ketqua == 'bonfide':
            statuss='bonfide'
            converted=True
        else:
        # Chuyển hình ảnh thành dạng base64
        # mel_spectrogram_image = base64.b64encode(buf.read()).decode('utf-8')
        # print("in bieu do2")
            statuss='spoof'
            converted=False
        return JsonResponse({'converted': converted})

    return JsonResponse({'error': 'Không thể tạo biểu đồ waveform.'})


def get_waveform_image_hi(audio_file):
        print("hji3")
        
        print('Audio File:', audio_file.name)
        # Xử lý tệp âm thanh với pydub
        y, sr = librosa.load(audio_file, sr=None)

        # Tạo Mel spectrogram
        mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sr)

        # Chuyển Mel spectrogram thành dB
        mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)
        
        # Hiển thị Mel spectrogram
        # plt.figure(figsize=(10, 4)
        plt.clf()
        librosa.display.specshow(mel_spectrogram_db, x_axis='time', y_axis='mel')
        plt.colorbar(format='%+2.0f dB')
        plt.title('Mel Spectrogram')
        print("in bieu do")
        # Chuyển Mel spectrogram thành hình ảnh
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        image_name = 'mel_spectrogram.png'  # Tên hình ảnh bạn muốn sử dụng
        image_path = os.path.join(settings.STATICFILES_DIRS[0], 'images', image_name)
        if os.path.exists(image_path):
            os.remove(image_path)
        plt.savefig(image_path, format='png')
        buf.seek(0)

        # Chuyển hình ảnh thành dạng base64
        # mel_spectrogram_image = base64.b64encode(buf.read()).decode('utf-8')
        # print("in bieu do2")
        converted=True
    
@csrf_exempt
def downaudio(request):
    if request.method == 'POST':
        print("hji2")
        audio_file = request.FILES['audio_file']
        key_name= request.POST['key_name']
        print('Audio File:', audio_file.name)
        ketqua=predict2.predict(audio_file)
        if(ketqua=='bonfide'):
            ketqua=1
        else:
            ketqua=0
        if (key_name=='1'):
            key_name=ketqua
        else:
            key_name=1-ketqua
        # Xử lý tệp âm thanh với pydub
        audio_path = os.path.join(settings.STATICFILES_DIRS[0], 'audio', audio_file.name)
        with open('data.txt', 'a') as file:  # Mở file data.txt để ghi thông tin
            file.write(f"{audio_file.name} {key_name}\n")  # Ghi thông tin vào file
        with open(audio_path, 'wb') as destination:
            for chunk in audio_file.chunks():
                destination.write(chunk)
        print('Audio File saved at:', audio_path)
        # Tạo Mel spectrogram
        converted=True
        return JsonResponse({'converted': converted})

    return JsonResponse({'error': 'Không thể tạo biểu đồ waveform.'})
@csrf_exempt
def get_predict2(request):
    if request.method == 'POST':
        print("hji2")
        audio_file = request.FILES['audio_file']
        print('Audio File:', audio_file.name)
        # Xử lý tệp âm thanh với pydub
    
        ketqua=predict2.predict(audio_file)
        print('ketqua ', ketqua)
        # Tạo Mel spectrogram
        if ketqua == 'bonfide':
            statuss='bonfide'
            converted=True
        else:
        # Chuyển hình ảnh thành dạng base64
        # mel_spectrogram_image = base64.b64encode(buf.read()).decode('utf-8')
        # print("in bieu do2")
            statuss='spoof'
            converted=False
        return JsonResponse({'converted': converted})

    return JsonResponse({'error': 'Không thể tạo biểu đồ waveform.'})

@csrf_exempt
def predict_image(request): 
    if request.method == 'POST' : 
        print(request.FILES)
        # Check if image is sent
        if 'image' in request.FILES : 
            uploaded_image = request.FILES['image'] 
            
            print(uploaded_image)
            prediction, result_image = convert_and_classify(uploaded_image, 150)

            return JsonResponse({'prediction' : prediction, 'result_image' : result_image})
        else : 
            return JsonResponse({'error': 'No image file received'}, status=400) 
    else :
        return JsonResponse({'error': 'Invalid request method'},status=400) 
    
@csrf_exempt
def predict_image_gradcam(request): 
    if request.method == 'POST' : 
        print(request.FILES)
        # Check if image is sent
        if 'image' in request.FILES : 
            uploaded_image = request.FILES['image'] 
            
            print(uploaded_image)
            prediction, confidence, result_image = grad_cam_predict(uploaded_image)
            # confidence = float("{:.4f}".format(confidence))
            confidence = float(confidence)
            print(confidence)

            return JsonResponse({'prediction' : prediction, 'confidence': confidence ,'result_image' : result_image})
        else : 
            return JsonResponse({'error': 'No image file received'}, status=400) 
    else :
        return JsonResponse({'error': 'Invalid request method'},status=400) 
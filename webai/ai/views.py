from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import io
from django.views.decorators.csrf import csrf_exempt
import numpy as np
from django.conf import settings
import os
from . import predict
from . import predict2
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"




statuss='_'

def say_hello(request):
    return render(request, 'hello.html')
def trangchu(request):
    return render(request, 'index.html')


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

    return JsonResponse({'error': 'Không thể thực hiện.'})


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

    return JsonResponse({'error': 'Không thể thực hiện.'})
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
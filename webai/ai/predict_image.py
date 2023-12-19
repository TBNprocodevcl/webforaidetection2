import cv2
import os
import numpy as np
from tensorflow.keras.models import load_model, Model
import scipy as sp 
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import tensorflow as tf
from django.core.files.uploadedfile import InMemoryUploadedFile
import tempfile
from matplotlib import image as mimg

# # load model
loaded_model = load_model('ai/models/best_model_e23_acc91_128dense.h5')

cam_model = Model(inputs=loaded_model.input, outputs=(loaded_model.get_layer('conv2d_7').output, loaded_model.layers[-1].output))

gap_weights = loaded_model.layers[-1].get_weights()[0] 

def get_result_image(image_value, features, results) : 
    
    features_for_img = features[0] 
    prediction = results[0] 
    
    class_activation_weights = gap_weights[:,0]
    
    class_activation_features = sp.ndimage.zoom(features_for_img, (150/10, 150/10, 1), order=2) 
    
    cam_output = np.dot(class_activation_features, class_activation_weights)
    
    print(f'sigmoid output: {results}')
    print(f"prediction: {'Normal' if round(results[0][0]) else 'Pneumonia'}")
    
    fig, ax = plt.subplots(figsize=(6,6)) 
    ax.imshow(cam_output, cmap='jet', alpha=0.5) 
    ax.imshow(tf.squeeze(image_value), alpha=0.5) 
    
    ax.axis('off')
    
    img_buffer = BytesIO() 
    plt.savefig(img_buffer, format='png', transparent=True, bbox_inches='tight', pad_inches=0)
    img_buffer.seek(0) 
    
    image_base64 = base64.b64encode(img_buffer.read()).decode('utf-8')
    
    # image_array = ax.get_images()[0].get_array()
    
    
    
    # image_stream = BytesIO() 
    # ax.get_images()[0].write_png(image_stream) 
    
    # image_base64 = base64.b64encode(image_stream.getvalue()).decode('utf-8')
    
    prediction = 'Normal' if round(results[0][0]) else 'Pneumonia'
    
    return prediction, image_base64

def save_uploaded_image(image) : 
    temp_file = tempfile.NamedTemporaryFile(delete=False) 
    
    try : 
        for chunk in image.chunks() : 
            temp_file.write(chunk) 
        
        return temp_file.name
    finally : 
        temp_file.close()
        

def convert_and_classify(image, img_size) :
    image_path = save_uploaded_image(image) 
    
    img_arr = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE) 
    # print(img_arr)
    
    # preprocess the image before feeding it to the model 
    resized_arr = cv2.resize(img_arr, (img_size, img_size)) 
    normalized_arr = np.array(resized_arr) / 255 
    reshaped_arr = resized_arr.reshape(-1, img_size, img_size, 1) 
    
    features, results = cam_model.predict(reshaped_arr)
    
    prediction, result_image = get_result_image(reshaped_arr, features, results) 
    
    return prediction, result_image
    
    
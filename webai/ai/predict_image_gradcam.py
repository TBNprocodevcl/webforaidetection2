import cv2
import numpy as np
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import tempfile
import tensorflow as tf
import keras
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from io import BytesIO
import base64

# load model
model = load_model('ai/models/model-good-water-1_v18')
last_conv = "conv2d_9"
classifier_layers = ["max_pooling2d_9","flatten_1","dense_5","dense_6","dense_7","dense_8","dense_9"]

def get_img_array(img_path, size):
    # Load and resize the image
    img = load_img(img_path, target_size=size)

    # Convert the image to a float32 Numpy array
    array = img_to_array(img)

    # Add a dimension to transform the array into a "batch" of size (1, height, width, channels)
    array = np.expand_dims(array, axis=0)

    # Normalize the pixel values to be in the range [0, 1]
    array = array / 255.0

    return array

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, classifier_layer_names) : 
    # First, we create a model that maps the input image to the activations
    # of the last conv layer
    last_conv_layer = model.get_layer(last_conv_layer_name)
    last_conv_layer_model = keras.Model(model.inputs, last_conv_layer.output)

    # Second, we create a model that maps the activations of the last conv
    # layer to the final class predictions
    classifier_input = keras.Input(shape=last_conv_layer.output.shape[1:])
    x = classifier_input
    for layer_name in classifier_layer_names:
        x = model.get_layer(layer_name)(x)
    classifier_model = keras.Model(classifier_input, x)

    # Then, we compute the gradient of the top predicted class for our input image
    # with respect to the activations of the last conv layer
    with tf.GradientTape() as tape:
        # Compute activations of the last conv layer and make the tape watch it
        last_conv_layer_output = last_conv_layer_model(img_array)
        tape.watch(last_conv_layer_output)
        # Compute class predictions
        preds = classifier_model(last_conv_layer_output)
        top_pred_index = tf.argmax(preds[0])
        top_class_channel = preds[:, top_pred_index]

    # This is the gradient of the top predicted class with regard to
    # the output feature map of the last conv layer
    grads = tape.gradient(top_class_channel, last_conv_layer_output)

    # This is a vector where each entry is the mean intensity of the gradient
    # over a specific feature map channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # We multiply each channel in the feature map array
    # by "how important this channel is" with regard to the top predicted class
    last_conv_layer_output = last_conv_layer_output.numpy()[0]
    pooled_grads = pooled_grads.numpy()
    for i in range(pooled_grads.shape[-1]):
        last_conv_layer_output[:, :, i] *= pooled_grads[i]

    # The channel-wise mean of the resulting feature map
    # is our heatmap of class activation
    heatmap = np.mean(last_conv_layer_output, axis=-1)

    # For visualization purpose, we will also normalize the heatmap between 0 & 1
    heatmap = np.maximum(heatmap, 0) / np.max(heatmap)
    
    return heatmap

def get_GradCam_Img(heatmap, img_path) : 
    # We load the original image
    img = keras.preprocessing.image.load_img(img_path,target_size=(256,256))
    img = keras.preprocessing.image.img_to_array(img)

    # We rescale heatmap to a range 0-255
    heatmap = np.uint8(255 * heatmap)

    # We use jet colormap to colorize heatmap
    jet = cm.get_cmap("jet")

    # We use RGB values of the colormap
    jet_colors = jet(np.arange(256))[:, :3]
    jet_heatmap = jet_colors[heatmap]

    # We create an image with RGB colorized heatmap
    jet_heatmap = keras.preprocessing.image.array_to_img(jet_heatmap)
    jet_heatmap = jet_heatmap.resize((img.shape[1], img.shape[0]))
    jet_heatmap = keras.preprocessing.image.img_to_array(jet_heatmap)

    # Superimpose the heatmap on original image
    superimposed_img = jet_heatmap * 0.51 + img
    superimposed_img = keras.preprocessing.image.array_to_img(superimposed_img)

    return superimposed_img

def get_heatmap_image(classified_images) : 
    plt.imshow(classified_images) 
    plt.axis('off')
    img_buffer = BytesIO() 
    plt.savefig(img_buffer, format='png', transparent=True, bbox_inches='tight', pad_inches=0)
    img_buffer.seek(0) 
    
    image_base64 = base64.b64encode(img_buffer.read()).decode('utf-8')
    return image_base64

def save_uploaded_image(image) : 
    temp_file = tempfile.NamedTemporaryFile(delete=False) 
    
    try : 
        for chunk in image.chunks() : 
            temp_file.write(chunk) 
        
        return temp_file.name
    finally : 
        temp_file.close()

def grad_cam_predict(image) : 
    image_path = save_uploaded_image(image)
    
    img_array = get_img_array(image_path, (256,256)) 
    pred = model.predict(img_array) 
    pred_label = '' 
    pred_confidence = 0
    
    if pred >= 0.5 : 
        pred_label = 'PNEUMONIA' 
        pred_confidence = pred
    else :
        pred_label = 'Normal' 
        pred_confidence = 1 - pred
    
    heatmap = make_gradcam_heatmap(img_array, model, last_conv, classifier_layers)
    gradcam = get_GradCam_Img(heatmap, image_path) 
    
    heatmap_image = get_heatmap_image(gradcam) 
    
    return pred_label, pred_confidence[0][0], heatmap_image

import os
import librosa
import base64
import numpy as np
from pydub import AudioSegment
from flask import Flask,request,flash,redirect,jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
import librosa.display
import wave 

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = "./temp_files/"
ALLOWED_EXTENSIONS = {'mp4', 'mp3', "wav" }

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload_sound" , methods=["POST"])
def sound_upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return{"error": "No file part"}, 401
        file = request.files['file']
        filename = file.filename
        if file and allowed_file(filename):
            filename_secure = secure_filename(filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename_secure)
            file.save(path)
            data = spectrogram_creation(path)
            return jsonify(data),200
        else:
            return{"errors": ["Image format must be .mp4, .mp3, or .wav"]}, 422
        

def mp3_wav_convert():
    pass

def mp4_wav_convert():
    pass

def spectrogram_creation(sound_path):
    # creating the tuple of time and sampling_rate = frequency at each point in time 
    array_time, sampling_frequency  = librosa.load(sound_path)
    n_fft = 2048 

    # DATA for spectrogram  
    #applying the Short-Time Fourier Transform making a spectrogram
    D = librosa.stft(array_time)
    # changes the units to db 
    STFT_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)

    # get data for the kelidoscope 
    chroma_stft = librosa.feature.chroma_stft(y=array_time, sr=sampling_frequency, n_fft=n_fft)
    mfcc = librosa.feature.mfcc(y=array_time, sr=sampling_frequency ,n_fft=n_fft)
    spectral_centroid = librosa.feature.spectral_centroid(y=array_time, sr=sampling_frequency, n_fft=n_fft)



    t = spectral_centroid.shape[1]  # number of frames
    frame_indices = np.arange(t) 
    times = librosa.frames_to_time(frame_indices, sr=sampling_frequency, hop_length=512)

    return {"Chroma": chroma_stft.tolist(), "MFCC": mfcc.tolist(), "Centroid": spectral_centroid.tolist(), "STFT": STFT_db.tolist(), "Time": times.tolist(), "SamplingFrequency": sampling_frequency}







def delete_file(filename_path):
    if os.path.exists(filename_path):
        os.remove(filename_path)
    else:
        print("The file does not exist")
        





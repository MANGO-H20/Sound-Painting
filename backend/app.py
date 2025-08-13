import os
from flask import Flask,request,flash,redirect
from flask_cors import CORS
from werkzeug.utils import secure_filename

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
            delete_file(filename)
            filename_secure = secure_filename(filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename_secure)
            file.save(path)
            return {"name": filename, "status": "success"}
        else:
            return{"errors": ["Image format must be .mp4, .mp3, or .wav"]}, 422


def delete_file(filename_path):
    if os.path.exists(filename_path):
        os.remove(filename_path)
    else:
        print("The file does not exist")
        
def spectrogram(sound_file_path):
    pass





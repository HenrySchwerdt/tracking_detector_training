from contextlib import redirect_stdout
import io
import os
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import funker
import gzip
import shutil
import pandas as pd
import numpy as np
import tensorflowjs as tfjs
from minio import Minio
from tqdm import tqdm
import polars as pl
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import confusion_matrix
import tensorflow as tf
# from sklearn.model_selection import KFold

MINIO_ACCESS_KEY = os.environ['MINIO_ACCESS_KEY']
MINIO_SECRET_KEY = os.environ['MINIO_PRIVATE_KEY']
DATA_BUCKET_NAME = os.environ['TRAINING_DATA_BUCKET_NAME']
MODEL_BUCKET_NAME = os.environ['MODEL_BUCKET_NAME']
OBJECT_NAME = "training-data.csv.gz"


def extract_data(training_data_filename):
    minioClient = Minio('minio:9000',
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
    )

    response = minioClient.get_object(DATA_BUCKET_NAME, training_data_filename)
    with open('training-data.csv.gz', 'wb') as file_data:
        for d in response.stream(32*1024):
            file_data.write(d)
    with gzip.open('training-data.csv.gz', 'rb') as compressed_file:
        with open('training-data.csv', 'wb') as uncompressed_file:
            shutil.copyfileobj(compressed_file, uncompressed_file)
    response.close()
    response.release_conn()
    print("Finsihed extracting data")

def delete_temporary_files():
    os.remove('training-data.csv.gz')
    os.remove('training-data.csv')
    shutil.rmtree("./model")

def train_and_save_model(data_frame, model, batch_size, epochs):
    print("Started Training")
    X = data_frame.to_numpy()[:, 0:204]
    y = data_frame.to_numpy()[:, -1]
    model.fit(X, y, batch_size= batch_size, epochs=epochs)
    evaluation = model.evaluate(X,y)
    print('Model evaluation ', evaluation)
    tfjs.converters.save_keras_model(model, 'model')

def upload_model_to_bucket(application_name, model_storage_name):
    print("Starting upload")
    minioClient = Minio('minio:9000',
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
    )

    for root, _, files in os.walk("./model"):

        for file in files:
            file_path = os.path.join(root, file)
            minioClient.fput_object(MODEL_BUCKET_NAME, application_name+"/"+model_storage_name+"/"+file, file_path)


def handler(trainingDataFileName, applicationName, modelStorageName, batchSize, epochs, inputVectorDims, modelStructure):
    f = io.StringIO()
    with redirect_stdout(f):
        try:
            extract_data(trainingDataFileName)
            training_data = pd.concat([chunk for chunk in tqdm(pd.read_csv("training-data.csv", sep=",", chunksize=1000), desc='Loading data')]) 
            model = tf.keras.models.model_from_json(modelStructure)
            model.compile(loss='mse', optimizer=tf.keras.optimizers.RMSprop(learning_rate=1e-2), metrics=['accuracy'])
            print(model.summary())
            train_and_save_model(training_data, model, batchSize, epochs)
            upload_model_to_bucket(applicationName, modelStorageName)
            delete_temporary_files()
            return f.getvalue()
        except Exception as e:
            print(e)
            return f.getvalue()
   
 


if __name__ == '__main__':
    funker.handle(handler)

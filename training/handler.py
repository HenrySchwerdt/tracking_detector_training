import os
import funker
import gzip
import shutil
import pandas as pd
import numpy as np
import tensorflowjs as tfjs
from minio import Minio
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import confusion_matrix
import tensorflow as tf
# from sklearn.model_selection import KFold

MINIO_ACCESS_KEY = os.environ['MINIO_ACCESS_KEY']
MINIO_SECRET_KEY = os.environ['MINIO_PRIVATE_KEY']
DATA_BUCKET_NAME = os.environ['TRAINING_DATA_BUCKET_NAME']
MODEL_BUCKET_NAME = os.environ['MODEL_BUCKET_NAME']
OBJECT_NAME = "training-data.csv.gz"


def extract_data():
    minioClient = Minio('minio:9000',
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
    )

    response = minioClient.get_object(DATA_BUCKET_NAME, OBJECT_NAME)
    with open('training-data.csv.gz', 'wb') as file_data:
        for d in response.stream(32*1024):
            file_data.write(d)
    with gzip.open('training-data.csv.gz', 'rb') as compressed_file:
        with open('training-data.csv', 'wb') as uncompressed_file:
            shutil.copyfileobj(compressed_file, uncompressed_file)
    response.close()
    response.release_conn()


def delete_temporary_files():
    os.remove('training-data.csv.gz')
    os.remove('training-data.csv')
    shutil.rmtree("./model")

def create_model():
    model = tf.keras.models.Sequential()
    model.add(tf.keras.layers.Embedding(90, 32, input_length=204, mask_zero=True))
    model.add(tf.keras.layers.Flatten())
    model.add(tf.keras.layers.Dense(512, input_shape=(6528,)))
    model.add(tf.keras.layers.Dropout(0.5))
    model.add(tf.keras.layers.ReLU())
    model.add(tf.keras.layers.Dense(256, input_shape=(512,)))
    model.add(tf.keras.layers.Dropout(0.5))
    model.add(tf.keras.layers.ReLU())
    model.add(tf.keras.layers.Dense(128, input_shape=(256,)))
    model.add(tf.keras.layers.Dropout(0.5))
    model.add(tf.keras.layers.ReLU())
    model.add(tf.keras.layers.Dense(1, input_shape=(128,)))
    model.add(tf.keras.layers.Activation('sigmoid'))

    model.compile(loss='mse', optimizer=tf.keras.optimizers.RMSprop(learning_rate=1e-2), metrics=['accuracy'])
    return model

def train_and_save_model(data_frame):
    X = data_frame.to_numpy()[:, 0:204]
    y = data_frame.to_numpy()[:, -1]
    model = create_model()
    model.fit(X, y, batch_size= 1, epochs=10)
    evaluation = model.evaluate(X,y)
    print('Model evaluation ', evaluation)
    tfjs.converters.save_keras_model(model, 'model')

def upload_model_to_bucket():
    minioClient = Minio('minio:9000',
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
    )

    for root, _, files in os.walk("./model"):

        for file in files:
            file_path = os.path.join(root, file)
            object_name = file_path.replace("./model" + "/", "")
            minioClient.fput_object(MODEL_BUCKET_NAME, "model/"+file, file_path)


def handler(x, y):
    extract_data()
    training_data = pd.read_csv('training-data.csv', sep=',')
    train_and_save_model(training_data)
    upload_model_to_bucket()
    delete_temporary_files()
    return x + y


if __name__ == '__main__':
    funker.handle(handler)

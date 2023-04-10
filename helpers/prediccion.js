
const tf = require('@tensorflow/tfjs');
const Jimp = require('jimp');

const prediccion = async() =>{

// Path for image file to predict class
const IMAGE_FILE_PATH = "D:/lol/xd.jpg";

// const labels = require("../modelo_vgg16/model.json");
//Carga del modelo, debe estar alojado en un servidor al que se pueda acceder
const model = await tf.loadLayersModel("http://127.0.0.1:8014/modelo_vgg16/model.json");
// http://127.0.0.1:8014/model_prueba/model.json
// https://res.cloudinary.com/dvv34yqao/raw/upload/v1680010789/modelo_vgg16/model_hvrxnd.json 
//En cloudinary no deja subir los archivos .bin
model.summary();

const image = await Jimp.read(IMAGE_FILE_PATH);
image.cover(224, 224, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

const NUM_OF_CHANNELS = 3;
let values = new Float32Array(224 * 224 * NUM_OF_CHANNELS);

let i = 0;
image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
  const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
  pixel.r = pixel.r / 127.0 - 1;
  pixel.g = pixel.g / 127.0 - 1;
  pixel.b = pixel.b / 127.0 - 1;
  pixel.a = pixel.a / 127.0 - 1;
  values[i * NUM_OF_CHANNELS + 0] = pixel.r;
  values[i * NUM_OF_CHANNELS + 1] = pixel.g;
  values[i * NUM_OF_CHANNELS + 2] = pixel.b;
  i++;
});

const outShape = [224, 224, NUM_OF_CHANNELS];
let img_tensor = tf.tensor3d(values, outShape, 'float32');
img_tensor = img_tensor.expandDims(0);

const predictions = await model.predict(img_tensor).dataSync();

for (let i = 0; i < predictions.length; i++) {
  // const label = labels[i];
  const probability = predictions[i];
  // console.log(`${label}: ${probability}`);
  console.log(predictions[i]);
}
}

module.exports = { prediccion };
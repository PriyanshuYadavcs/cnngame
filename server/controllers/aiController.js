import * as tf from '@tensorflow/tfjs';
import { createCanvas, loadImage } from 'canvas';
import { categories } from '../data/category.js';
import axios from 'axios';
import fs from "fs";

let model;

export async function loadModel() {
  try {
    const modelURL = 'http://localhost:3001/model/model.json';
    model = await tf.loadLayersModel(modelURL);
    console.log('[MODEL] TensorFlow.js model loaded successfully');
  } catch (err) {
    console.error('[MODEL] Failed to load TensorFlow.js model:', err);
  }
}

export async function evaluateDrawing(correctWord, drawings) {
  if (!model) throw new Error('Model not loaded yet');
  const results = [];

  for (const drawing of drawings) {
    try {
      const { playerId, imageData } = drawing;
      console.log(imageData); 
     
  
      const response= await axios.post(
         "https://flaskserver-b4ys.onrender.com/predict",
         {imageData}
      );
      console.log(response.data);

      console.log(`[eval] player ${playerId}-top 3 predictions:`); 
      data.predictions.slice(0,3).forEach((p,i)=>
 console.log(`  ${i + 1}. ${p.label}: ${(p.prob * 100).toFixed(2)}%`)
      );

      const topPrediction= data.predictions[0]; 
      results.push({
        playerId,
        topPrediction: topPrediction.label, 
        top10: data.predicions.map((s)=>({
          label: s.label, 
          confidence: Number(s.prob.toFixed(4)),
        })),
      });


      // // Decode base64 → Canvas
      // const img = await loadImage(imageData);
      // const canvas = createCanvas(28, 28);
      // const ctx = canvas.getContext('2d');
      // ctx.drawImage(img, 0, 0, 28, 28);

      // // Convert to tensor
      // const tensor = tf.browser
      //   .fromPixels(canvas, 1)
      //   .toFloat()
      //   .div(255.0)
      //   .expandDims(0);

      // // Predict
      // const prediction = model.predict(tensor);
      // const probs = prediction.dataSync(); // all class probabilities
      // const sorted = Array.from(probs)
      //   .map((p, i) => ({ label: categories[i], confidence: p }))
      //   .sort((a, b) => b.confidence - a.confidence)
      //   .slice(0, 10);


      // console.log(`\n[EVAL] Player ${playerId} — Top 10 predictions:`);
      // sorted.forEach((p, i) =>
      //   console.log(`  ${i + 1}. ${p.label}: ${(p.confidence * 100).toFixed(2)}%`)
      // );

      // results.push({
      //   playerId,
      //   topPrediction: topPrediction.label,
      //   topConfidence: Number(topPrediction.confidence.toFixed(4)),
      //   top10: sorted.map((s) => ({
      //     label: s.label,
      //     confidence: Number(s.confidence.toFixed(4)),
      //   })),
      // });

    } catch (err) {
      console.error(`[EVAL] Error evaluating drawing for ${drawing.playerId}:`, err);
      results.push({
        playerId: drawing.playerId,
        topPrediction: 'Error',
        topConfidence: 0,
        top10: [],
      });
    }
  }

  // Determine winner = highest topConfidence
  const winner = results.reduce((a, b) =>
    a.topConfidence > b.topConfidence ? a : b
  ).playerId;

  return { results, winner };
}

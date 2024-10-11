import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ReactSketchCanvas } from "react-sketch-canvas";
import Spinner from "@/components/Spinner";

const Canvas = ({ predictions, userUploadedImage, onDraw }) => {
  const canvasRef = useRef(null);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const updatedPredictions = predictions.map((prediction) => {
      const lastImage = prediction.output
        ? prediction.output[prediction.output.length - 1]
        : null;
      return { ...prediction, lastImage };
    });

    const isPredicting = updatedPredictions.some(
      (prediction) => !prediction.output
    );
    setPredicting(isPredicting);

    if (updatedPredictions.length > 0) {
      setLastPrediction(updatedPredictions[updatedPredictions.length - 1]);
    }
  }, [predictions]);

  const handleChange = async () => {
    if (canvasRef.current) {
      const paths = await canvasRef.current.exportPaths();
      if (paths.length) {
        const data = await canvasRef.current.exportImage("svg");
        onDraw(data);
      }
    }
  };

  return (
    <div className="relative w-full aspect-square">
      {/* PREDICTION IMAGES */}
      {!userUploadedImage &&
        predictions
          .filter((prediction) => prediction.output)
          .map((prediction, index) => (
            <Image
              alt={"prediction" + index}
              key={"prediction" + index}
              layout="fill"
              className="absolute animate-in fade-in"
              style={{ zIndex: index }}
              src={prediction.lastImage}
            />
          ))}

      {/* USER UPLOADED IMAGE */}
      {userUploadedImage && (
        <Image
          src={URL.createObjectURL(userUploadedImage)}
          alt="preview image"
          layout="fill"
        />
      )}

      {/* SPINNER */}
      {predicting && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: predictions.length + 100 }}
        >
          <div className="p-4 w-40 bg-white text-center rounded-lg animate-in zoom-in">
            <Spinner />
            <p className="pt-3 opacity-30 text-center text-sm">
              {lastPrediction?.status}
            </p>
          </div>
        </div>
      )}

      {(predictions.length > 0 || userUploadedImage) && !predicting && (
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: predictions.length + 100 }}
        >
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={80}
            strokeColor="black"
            canvasColor="transparent"
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
};

export default Canvas;

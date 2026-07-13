import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FaCrop, FaTimes, FaCheck, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

/**
 * Utility: create a cropped image from canvas
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
}

/**
 * ImageCropper — Modal component for cropping images before upload.
 *
 * Props:
 * - imageSrc: string (data URL of the selected file)
 * - aspect: number (aspect ratio, e.g. 16/9 for slider, 3/4 for portrait)
 * - onCropDone: (croppedBlob: Blob) => void
 * - onCancel: () => void
 */
const ImageCropper = ({ imageSrc, aspect = 16 / 9, onCropDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedBlob);
    } catch (e) {
      console.error('Crop failed:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
            <FaCrop className="text-primary" />
            Crop Gambar
          </div>
          <button onClick={onCancel} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <FaTimes className="text-slate-500" />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full h-[400px] bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-5 py-3 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
          <FaSearchMinus className="text-slate-400 text-sm" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <FaSearchPlus className="text-slate-400 text-sm" />
          <span className="text-xs text-slate-500 font-mono w-10 text-right">{zoom.toFixed(1)}x</span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDone}
            disabled={isProcessing}
            className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Memproses...
              </>
            ) : (
              <>
                <FaCheck />
                Terapkan Crop
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;

// CropperModal.js
import React, { useState, useCallback } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus, faRedo, faUndo } from '@fortawesome/free-solid-svg-icons';

const CropperModal = ({ isOpen, onClose, src, onCrop }) => {
  const [cropper, setCropper] = useState(null);

  const handleCrop = useCallback(() => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          if (blob.size <= 60 * 1024) {
            onCrop(blob); // Send cropped blob back to parent component
            onClose(); // Close the modal after cropping
          } else {
            alert('The cropped image is still larger than 60KB. Please crop a smaller area or use a lower quality image.');
          }
        }, 'image/jpeg', 0.8);
      }
    }
  }, [cropper, onCrop, onClose]);

  if (!isOpen) return null;

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <Cropper
          style={cropperStyle}
          aspectRatio={3 / 4}
          src={src}
          viewMode={1}
          guides={true}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          checkOrientation={false}
          onInitialized={(instance) => setCropper(instance)}
        />
        <div style={cropperButtonContainer}>
          <button onClick={() => cropper.zoom(0.1)} style={cropperButtonStyle} title="Zoom In">
            <FontAwesomeIcon icon={faSearchPlus} />
          </button>
          <button onClick={() => cropper.zoom(-0.1)} style={cropperButtonStyle} title="Zoom Out">
            <FontAwesomeIcon icon={faSearchMinus} />
          </button>
          <button onClick={() => cropper.rotate(90)} style={cropperButtonStyle} title="Rotate Right">
            <FontAwesomeIcon icon={faRedo} />
          </button>
          <button onClick={() => cropper.rotate(-90)} style={cropperButtonStyle} title="Rotate Left">
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button onClick={handleCrop} style={cropperButtonStyle}>Crop</button>
          <button onClick={onClose} style={cropperButtonStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Styles for modal and cropper
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '90%',
  maxHeight: '90%',
  overflow: 'auto',
  position: 'relative',
  zIndex: 1001,
};

const cropperStyle = {
  width: '100%',
  maxWidth: '400px',
  height: 'auto',
};

const cropperButtonContainer = {
  marginTop: '10px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
};

const cropperButtonStyle = {
  padding: '8px 15px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default CropperModal;
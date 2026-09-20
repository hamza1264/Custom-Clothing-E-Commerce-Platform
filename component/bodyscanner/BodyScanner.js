'use client';

import React, { useState, useRef } from 'react';
import Script from 'next/script';
import styles from './BodyScanner.module.css';

export default function BodyScanner() {
  const [heightMode, setHeightMode] = useState('cm'); // 'cm', 'feet', ya 'average'
  const [userHeightCm, setUserHeightCm] = useState(170);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(7);

  // Custom Tailoring Preferences (User Choice)
  const [customKameezLength, setCustomKameezLength] = useState(38); // Standard 38 inches
  const [damanStyle, setDamanStyle] = useState('Straight'); // Straight ya A-Line

  const [loading, setLoading] = useState(false);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [measurements, setMeasurements] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);

  // Feet & Inches ko CM mein convert karne ka function
  const handleFeetInchesChange = (newFeet, newInches) => {
    setFeet(newFeet);
    setInches(newInches);
    const totalInches = newFeet * 12 + newInches;
    const calculatedCm = Math.round(totalInches * 2.54);
    setUserHeightCm(calculatedCm);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.URL ? URL.createObjectURL(file) : window.URL.createObjectURL(file);
      setImageSrc(url);
      setMeasurements(null);
    }
  };

  const processScanning = async () => {
    if (!imageRef.current) return;
    if (!window.poseDetection) {
      alert('AI Models abhi load ho rahe hain, thoda wait karein.');
      return;
    }

    setLoading(true);

    try {
      const model = window.poseDetection.SupportedModels.BlazePose;
      const detector = await window.poseDetection.createDetector(model, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
      });

      const poses = await detector.estimatePoses(imageRef.current);

      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;

        const nose = keypoints.find((k) => k.name === 'nose');
        const leftAnkle = keypoints.find((k) => k.name === 'left_ankle');
        const rightAnkle = keypoints.find((k) => k.name === 'right_ankle');
        const leftShoulder = keypoints.find((k) => k.name === 'left_shoulder');
        const rightShoulder = keypoints.find((k) => k.name === 'right_shoulder');
        const leftElbow = keypoints.find((k) => k.name === 'left_elbow');
        const leftWrist = keypoints.find((k) => k.name === 'left_wrist');
        const leftHip = keypoints.find((k) => k.name === 'left_hip');
        const rightHip = keypoints.find((k) => k.name === 'right_hip');

        if (leftShoulder && rightShoulder && leftHip && rightHip && nose) {
          const getDistance = (p1, p2) =>
            Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

          // Body height pixels calculation
          const ankleY = leftAnkle && rightAnkle ? (leftAnkle.y + rightAnkle.y) / 2 : leftHip.y * 1.8;
          const bodyPixelHeight = Math.abs(ankleY - nose.y);

          // Scaling Ratio (cm per pixel)
          const cmPerPixel = userHeightCm / bodyPixelHeight;

          // 1. Shoulder Width (Tira)
          const shoulderPixelWidth = getDistance(leftShoulder, rightShoulder);
          const shoulderWidthInches = ((shoulderPixelWidth * cmPerPixel) / 2.54).toFixed(1);

          // 2. Hip Width & Circumference
          const hipPixelWidth = getDistance(leftHip, rightHip);
          const hipWidthInches = ((hipPixelWidth * cmPerPixel * 2.2) / 2.54).toFixed(1);

          // 3. Chest & Waist Estimation
          const chestInches = (parseFloat(shoulderWidthInches) * 2.1).toFixed(1);
          const waistInches = (parseFloat(hipWidthInches) * 0.95).toFixed(1);

          // 4. Sleeve Length Auto-Detection (Shoulder -> Elbow -> Wrist)
          let sleeveLengthInches = '21.0'; // Default Fallback
          if (leftShoulder && leftElbow && leftWrist) {
            const upperArmPixels = getDistance(leftShoulder, leftElbow);
            const forearmPixels = getDistance(leftElbow, leftWrist);
            const totalSleevePixels = upperArmPixels + forearmPixels;
            sleeveLengthInches = ((totalSleevePixels * cmPerPixel) / 2.54).toFixed(1);
          }

          // 5. Calculated Daman (Ghera) Width
          const damanWidthInches =
            damanStyle === 'A-Line'
              ? (parseFloat(hipWidthInches) + 3).toFixed(1)
              : hipWidthInches;

          // 6. Recommended Standard Ready-made Size
          let recommendedSize = 'M';
          if (chestInches < 36) recommendedSize = 'S';
          else if (chestInches >= 36 && chestInches <= 40) recommendedSize = 'M';
          else if (chestInches > 40 && chestInches <= 44) recommendedSize = 'L';
          else if (chestInches > 44) recommendedSize = 'XL';

          setMeasurements({
            shoulder: shoulderWidthInches,
            chest: chestInches,
            waist: waistInches,
            hips: hipWidthInches,
            sleeves: sleeveLengthInches,
            kameezLength: customKameezLength,
            daman: damanWidthInches,
            suggestedSize: recommendedSize,
          });
        } else {
          alert('Full-body clear photo upload karein taake saare points detect ho sakein.');
        }
      } else {
        alert('Image me koi person detect nahi hua.');
      }
    } catch (error) {
      console.error('Scanning Error:', error);
      alert('Scanning ke waqt issue aaya, please image dobara upload karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose" strategy="beforeInteractive" />
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection"
        onLoad={() => setIsLibraryLoaded(true)}
      />

      <div className={styles.container}>
        <h2 className={styles.title}>AI Body & Stitching Measurement Scanner</h2>

        {/* Height Input Mode Selection */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Aapko Height Kis Tarah Enter Karni Hai?</label>
          <select
            value={heightMode}
            onChange={(e) => setHeightMode(e.target.value)}
            className={styles.inputNumber}
            style={{ marginBottom: '10px' }}
          >
            <option value="cm">Height in CM</option>
            <option value="feet">Height in Feet & Inches</option>
            <option value="average">Mujhe Height Nahi Pata (Estimate)</option>
          </select>
        </div>

        {/* Option 1: Direct CM */}
        {heightMode === 'cm' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Apni Height Enter Karein (cm):</label>
            <input
              type="number"
              value={userHeightCm}
              onChange={(e) => setUserHeightCm(Number(e.target.value))}
              className={styles.inputNumber}
              placeholder="e.g. 170"
            />
          </div>
        )}

        {/* Option 2: Feet & Inches */}
        {heightMode === 'feet' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Feet Aur Inches Select Karein:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={feet}
                onChange={(e) => handleFeetInchesChange(Number(e.target.value), inches)}
                className={styles.inputNumber}
              >
                {[4, 5, 6, 7].map((f) => (
                  <option key={f} value={f}>{f} Feet</option>
                ))}
              </select>
              <select
                value={inches}
                onChange={(e) => handleFeetInchesChange(feet, Number(e.target.value))}
                className={styles.inputNumber}
              >
                {[...Array(12).keys()].map((i) => (
                  <option key={i} value={i}>{i} Inches</option>
                ))}
              </select>
            </div>
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
              Converted: {userHeightCm} cm
            </small>
          </div>
        )}

        {/* Option 3: Average Presets */}
        {heightMode === 'average' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Average Body Type Select Karein:</label>
            <select
              onChange={(e) => setUserHeightCm(Number(e.target.value))}
              className={styles.inputNumber}
            >
              {/* <option value="172">Average Male (Approx 5ft 8in / 172cm)</option> */}
              <option value="160">Average Female (Approx 5ft 3in / 160cm)</option>
              {/* <option value="180">Tall Male (Approx 5ft 11in / 180cm)</option> */}
              <option value="168">Tall Female (Approx 5ft 6in / 168cm)</option>
            </select>
          </div>
        )}

        {/* Custom Tailoring Preference Inputs */}
        <div style={{ margin: '15px 0', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Kameez Custom Preference (Personal Choice)</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div className={styles.formGroup} style={{ flex: '1' }}>
              <label className={styles.label}>Kameez Length (Inches):</label>
              <input
                type="number"
                value={customKameezLength}
                onChange={(e) => setCustomKameezLength(Number(e.target.value))}
                className={styles.inputNumber}
              />
            </div>
            <div className={styles.formGroup} style={{ flex: '1' }}>
              <label className={styles.label}>Daman Style:</label>
              <select
                value={damanStyle}
                onChange={(e) => setDamanStyle(e.target.value)}
                className={styles.inputNumber}
              >
                <option value="Straight">Straight (Normal)</option>
                <option value="A-Line">A-Line (Khula Daman)</option>
              </select>
            </div>
          </div>
        </div>

        {/* File Upload & Scanner */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Body Photo Upload Karein:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.inputFile}
          />
        </div>

        {imageSrc && (
          <div className={styles.previewContainer}>
            <img
              ref={imageRef}
              src={imageSrc}
              alt="User preview"
              className={styles.previewImage}
              crossOrigin="anonymous"
            />
            <br />
            <button
              onClick={processScanning}
              disabled={loading || !isLibraryLoaded}
              className={styles.button}
            >
              {loading
                ? 'AI Body Scan Chal Raha Hai...'
                : !isLibraryLoaded
                ? 'AI Loading...'
                : 'Start Scan & Measure'}
            </button>
          </div>
        )}

        {measurements && (
          <div className={styles.resultsBox}>
            <h3 className={styles.resultsTitle}>Complete Tailoring Measurements (Inches):</h3>
            <ul className={styles.resultsList}>
              <li><strong>Shoulder Width (Tira):</strong> {measurements.shoulder} inches</li>
              <li><strong>Chest (Chaati):</strong> {measurements.chest} inches</li>
              <li><strong>Waist (Kamar):</strong> {measurements.waist} inches</li>
              <li><strong>Hips:</strong> {measurements.hips} inches</li>
              <li><strong>Sleeve Length (Aasteen):</strong> {measurements.sleeves} inches</li>
              <li><strong>Kameez Length (Lambai):</strong> {measurements.kameezLength} inches</li>
              <li><strong>Daman / Ghera:</strong> {measurements.daman} inches</li>
            </ul>

            <div className={styles.recommendationBox}>
              Recommended Standard Ready-made Size: <span className={styles.sizeBadge}>{measurements.suggestedSize}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 
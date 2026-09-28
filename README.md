# 🌾 AgriVision AI – Frontend

AgriVision AI is an AI-powered web application designed to assist farmers in identifying and analyzing weeds in crop fields using computer vision and deep learning.

This repository contains the **frontend interface** of the AgriVision AI system.

The frontend communicates with a Flask-based backend API that performs image processing and YOLO-based weed detection.

---

## 🚀 Project Overview

AgriVision AI allows users to upload crop-field images and receive AI-based analysis including:

- 🌱 Crop and weed detection
- 🎯 Detection confidence
- 🌿 Weed count
- 📊 Weed density
- ⚠️ Weed severity level
- 📍 Weed hotspot visualization
- 📈 Field analysis charts
- 🕘 Detection history
- 🔄 Before and after comparison
- 🤖 AI-assisted farming recommendations

---

## ✨ Features

### 📷 Image Upload
Users can upload field images in:

- JPG
- JPEG
- PNG

### 🌱 AI Detection
Uploaded images are processed by the backend AI model to identify:

- Crop
- Weed

Detected objects are displayed with bounding boxes and confidence information.

### 📊 Field Analysis

The dashboard provides:

- Crop count
- Weed count
- Weed density
- Severity level
- Detection statistics

### 🔥 Weed Hotspot

The system highlights areas where a higher concentration of weeds is detected.

### 📈 Interactive Analysis

Chart.js is used to visualize crop and weed detection results.

### 🔄 Before & After Comparison

Users can upload two field images and compare:

- Weed count
- Weed density
- Severity

### 🕘 Detection History

Previous analyses can be viewed through the detection history section.

### 🤖 AgriVision AI Assistant

The interface includes an AI assistant that provides basic farming-related recommendations based on the detected field condition.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | UI design and responsive layout |
| JavaScript | Frontend logic and API communication |
| Chart.js | Data visualization |
| Flask API | Backend communication |
| YOLO | Weed detection |
| OpenCV | Image processing |

---

## 📂 Project Structure

```text
AgriVision-AI-Frontend/
│
├── index.html
├── style.css
├── script.js
└── README.md

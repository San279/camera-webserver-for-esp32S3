# Esp32 image collection webserver for Edge Impulse
This project was intended to use for collecting images from Esp32S3 to train FOMO object detection model in Edge Impulse. Instead of saving images to the SD card like most Esp32 webserver projects, users can inspect each image from the camera and delete at will. Furthermore, users can manipulate Esp32S3 camera resolutions and sensors settings. Just download the files and place it inside the Arduino directory and you're good to go! 

## Project files descriptions

1. Collect_Images_Edge.ino - Containes Arduino codes for streaming camera images to the webserver.
2. index.html - Contains HTML elements for streaming.
3. index.js - Javascript functions for HTML element and streaming.
4. styles.css - makes webserver looks more lively.



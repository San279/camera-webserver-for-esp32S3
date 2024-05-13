# Esp32 image collection webserver for Edge Impulse
This project was intended to use for collecting images from Esp32S3 to train FOMO object detection model in Edge Impulse. Instead of saving images to the SD card like most Esp32 webserver projects, users can inspect each image from the camera and delete at will. Furthermore, users can manipulate Esp32S3 camera resolutions and sensors settings. Just download the files and place it inside the Arduino directory and you're good to go! 

## What you'll need
- Arduino IDE, preferably the latest ones, but older versions will still do the job.
- CORS web extensions for your targeted browser.

## Project files descriptions

1. Collect_Images_Edge.ino - Containes Arduino codes for streaming camera images to the webserver.
2. index.html - Contains HTML elements for streaming.
3. index.js - Javascript functions for HTML element and streaming.
4. styles.css - makes webserver looks more lively.


## How to Install and run the project

1. Download the project and placed it inside Arduino Directory on your PC
![Download the project and placed it inside Arduino Directory on your PC](/Images_for_readme/folder_directory.PNG)
3. Open Collect_Images_Edge.ino and edit your WIFI SSID and PASSWORD.
4. Under tools change your Board to "ESP32S3 Dev Module" and PSRAM to "OPI PSRAM".
5. Upload the code to your ESP32S3 and copy the IP address.
6. Enable CORS extension in your default browser.
7. Open index.html file, it should open your default browser and ask for the IP Address, paste it there.


## Webserver features
- Adjustable Resolutions
- Capture buttons will start capturing images from stream and display it in the gallery below.
- Set Interval for each capture, the webserver will capture images interval according to the given value. The interval cannot be less than 0.1.
- Set Instances for capture or the amount of images to capture.
- Camera Sensors settings, Some Esp32 camera settings do not mix together, only one settings can be used each time with the exception of mode.
- Download buttons will zip all captured images and start downloading, don't forget to add a name for it.
- Each captured images can be deleted.
- Clear buttons will delete all captured images in the gallery.

  ## Credit
  This project was aimed with WARP AIOT BOARD under WIRELESS SOLUTION ASIA CO.,LTD as an extension to Edge Impulse for the ESP32 microcontroller. 

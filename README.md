# Esp32 camera webserver for data collection
This project was intended to use for collecting images from Esp32S3 to train [FOMO object detection model](https://edge-impulse.gitbook.io/docs/edge-impulse-studio/learning-blocks/object-detection/fomo-object-detection-for-constrained-devices) in [Edge Impulse](https://edgeimpulse.com/). Instead of saving images to the SD card like most Esp32 webserver projects, users can download images to their computer directly. Furthermore, users can manipulate Esp32S3 camera resolutions and sensors settings. Just download the files and place it inside the Arduino directory and you're good to go! 

## What you'll need
- [Arduino IDE](https://www.arduino.cc/en/software), preferably the latest ones, but older versions will still do the job.
- [CORS](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en) web extensions for your targeted browser.

## Project files descriptions

1. Collect_Images_Edge.ino - Containes Arduino codes for streaming camera images to the webserver.
2. index.html - Contains HTML elements for streaming.
3. index.js - Javascript functions for HTML element and streaming.
4. styles.css - makes webserver looks more lively.


## How to Install and run the project

1. Download the project and placed it inside Arduino Directory on your PC. <br /><br />
![alt text](/Images_for_readme/folder_directory.PNG)
<br /><br /><br /><br />
2. Open Collect_Images_Edge.ino and enter WIFI SSID and PASSWORD.<br /><br />
![alt text](/Images_for_readme/ssidPassword.PNG)
<br /><br /><br /><br />
3. Under tools change your Board to "ESP32S3 Dev Module" and PSRAM to "OPI PSRAM".<br /><br />
![alt text](/Images_for_readme/IDE_configure.PNG)
<br /><br /><br /><br />
4. Upload the code to your ESP32S3 and copy the IP address. <br /><br />
![alt text](/Images_for_readme/ip_IDE.PNG)
<br /><br /><br /><br />
5. Enable CORS extension in your default browser.<br /><br />
![alt text](/Images_for_readme/CORS.PNG)
<br /><br /><br /><br />
6. Open index.html file, it should open your default browser and ask for the IP Address, paste it there.<br /><br />
![alt text](/Images_for_readme/ip_prompt.PNG)
<br /><br /><br /><br />
7. Done!!!
![alt text](/Images_for_readme/done.PNG)<br /><br />
<br /><br /><br /><br />
## Webserver features
- User can switch languages on the top right corner of the web.<br />
- Adjustable Camera Settings, to see more details about each setting does please visit.<br />
- User can hide the setting console by clicking on the setting icon above.<br /><br />
![alt text](/Images_for_readme/setting.PNG)
<br /><br /><br />
- Adjustable Resolutions. <br />
- Class labels will give each images an assigned name when downloaded, suitable for labeling images or organizing data collections.<br /><br />
![alt_text](/Images_for_readme/resolution_class.PNG)
<br /><br /><br />
- Capture button will start capturing images from stream and display it in the gallery below. <br />
- The webserver can capture each images in an interval according to the given value from user. The interval cannot be less than 0.1.  <br />
- Set Instances to limit the amount of images captured.<br /> <br />
![alt_text](/Images_for_readme/capture_console.PNG)
<br /><br /> <br />
- Download button located on top right of the gallery will zip all captured images into one file and download.<br />
- Clear buttons located on top left of the gallery will delete all captured images in the gallery.<br /> <br />
- User can delete each images in the gallery individually.<br /> <br />
![alt_text](/Images_for_readme/gallery_img.PNG)
<br /> <br /><br /> <br />
## Credit
This project was aimed to be used with WARP AIOT BOARD under [WIRELESS SOLUTION ASIA CO.,LTD](https://wirelesssolution.asia/) as an tool for data collection of the ESP32-S3. This project was inspired by [Eloquent Arduino](https://eloquentarduino.com/posts/esp32-cam-object-detection)

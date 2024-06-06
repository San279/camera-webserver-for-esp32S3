## เว็ปเซอร์กล้อง Esp32-S3
 For English please visit [Readme](https://github.com/San279/camera-webserver-for-esp32S3)
 <br/>
 <br/>
 โปรเจ็คนี้ถูกออกแบบมาใช้กับ [FOMO](https://docs.edgeimpulse.com/docs/edge-impulse-studio/learning-blocks/object-detection/fomo-object-detection-for-constrained-devices) AI ตรวจจับวัตถุ ในส่วนของการรวบรวมรูปภาพจากกล้อง Esp32 หรือ AIoT  บอร์ด เพื่อนำไปใช้ใน [Edge Impulse](https://edgeimpulse.com/) เพียงแค่ดาวน์โหลดไลบราลี่ลงเครื่องและแตกไฟล์ในแฟ้ม Arduino ก้เสร็จแล้ว
<br/>
## สิงที่ต้องมีสำหรับโปรเจ็ค
 - AIoT บอร์ด Esp32-S3 หรือ Esp32 ที่มี PSRAM
 - กล้อง OV 2640
 - [Arduino IDE](https://www.arduino.cc/en/software) อันเก่าหรือใหม่ก้ได้
<br/>
## โครงสร้าง
 1. camera-webserver-for-esp32S3.ino - c++ สำหรับสตรีมรูปภาพจากกล้อง Esp32 ขึ้นเว็ปเซอรเวอร์.
 2. index.html - html สำหรับส่วนหน้าบ้านของเว็บไซต์.
 3. index.js - javascript สำหรับฟังชั้นของการรับสรีมและส่วนหน้าบ้าน
 4. styles.css - css ทำให้เว็ปดูสวยงาม.
<br/>
## วิธีรันโปรเจ็ค
<strong> 1. ดาวน์โหลดไลบราลี่เป็น zip และแตกไฟล์ในแฟ้ม Arduino. </strong>
<br /><br />
![alt text](/Images_for_readme/folder_directory.PNG)
<br /><br /><br /><br />
<strong> 2. เปิดแฟ้มที่พึ่งแยก และเปิดไฟล์ camera-webserver-for-esp32S3.ino เปลี่ยนชื่อกับรหัส WIFI ในบรรทัด.  </strong>
<br /><br />
![alt text](/Images_for_readme/ssidPassword.PNG)
<br /><br /><br /><br />
<strong> 3. Under tools change your Board to "ESP32S3 Dev Module" and PSRAM to "OPI PSRAM".  </strong>
<br /><br />
![alt text](/Images_for_readme/IDE_configure.PNG)
<br /><br /><br /><br />
<strong> 4. Upload the code to your ESP32S3 and copy the IP address.  </strong>
<br /><br />
![alt text](/Images_for_readme/ip_IDE.PNG)
<br /><br /><br /><br />
<strong> 5. Open index.html file, and paste the IP Address obtained from previously.  </strong>
<br /><br />
![alt text](/Images_for_readme/ip_prompt.PNG)
<br /><br /><br /><br />
<strong> 6. Done!!!  </strong>
<br/> <br/>
<strong> - I've created repository to provide simple guide to training FOMO object detection model please visit [train-FOMO-object-detect-esp32](https://github.com/San279/train-FOMO-object-detect-esp32). </strong>
<br/> <br/>
![alt text](/Images_for_readme/done.PNG)
<br /><br /><br /><br />
## Webserver features
- User can switch languages on the top right corner of the web.<br />
- Adjustable Camera Settings, to see more details about each setting please visit [
https://heyrick.eu/blog/index.php?diary=20210418&keitai=0](https://heyrick.eu/blog/index.php?diary=20210418&keitai=0).<br />
- User can hide the setting console by clicking on the icon above.<br /><br />
![alt text](/Images_for_readme/setting.PNG)
<br /><br /><br />
- Adjustable Resolutions. <br />
- Class labels will give each image an assigned name when downloaded, suitable for labeling images or organizing data collections directories.<br /><br />
![alt_text](/Images_for_readme/resolution_class.PNG)
<br /><br /><br />
- Capture button will start capturing images from stream and display it in the gallery below. <br />
- The webserver can capture each images in an interval according to the input value. The interval cannot be less than 0.1.  <br />
- Set Instances to limit the amount of images captured.<br /> <br />
![alt_text](/Images_for_readme/capture_console.PNG)
<br /><br /> <br />
- Download button located on the top left will zip all captured images into a single file and download.<br />
- Clear buttons located on the top right will delete all captured images.<br />
- User can aslo delete each image individually.<br /><br />
![alt_text](/Images_for_readme/gallery_img.PNG)
<br /> <br /><br /> <br />
## Credit
Thanks to [WIRELESS SOLUTION ASIA CO.,LTD](https://wirelesssolution.asia/) for providing AIOT board to support this project. Also thanks to [RandomNerdTutorials]([RandomNerdTutorial](https://RandomNerdTutorials.com/esp32-cam-video-streaming-web-server-camera-home-assistant) for providing essential codes for streaming Esp32 camera to webserver.

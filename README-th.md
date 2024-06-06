## เว็ปเซอร์กล้อง Esp32-S3
 [For English version](https://github.com/San279/camera-webserver-for-esp32S3)
 <br/>
 <br/>
 โปรเจ็คนี้ถูกออกแบบมาใช้กับ [FOMO](https://docs.edgeimpulse.com/docs/edge-impulse-studio/learning-blocks/object-detection/fomo-object-detection-for-constrained-devices) AI ตรวจจับวัตถุ ในส่วนของการรวบรวมรูปภาพจากกล้อง Esp32 หรือ AIoT  บอร์ด เพื่อนำไปใช้ใน [Edge Impulse](https://edgeimpulse.com/) เพียงแค่ดาวน์โหลดไลบราลี่ลงเครื่องและแตกไฟล์ในแฟ้ม Arduino
<br/>
## สิงที่ต้องมี
 - [AIoT](https://wirelesssolution.asia/) บอร์ด Esp32-S3 หรือ Esp32 ที่มี PSRAM
 - กล้อง OV 2640
 - [Arduino IDE](https://www.arduino.cc/en/software) อันเก่าหรือใหม่ก้ได้
## โครงสร้าง
 1. camera-webserver-for-esp32S3.ino - c++ สำหรับสตรีมรูปภาพจากกล้อง Esp32 ขึ้นเว็ปเซอรเวอร์
 2. index.html - html สำหรับส่วนหน้าบ้านของเว็บไซต์
 3. index.js - javascript สำหรับฟังชั้นของการรับสรีมและส่วนหน้าบ้าน
 4. styles.css - css ทำให้เว็ปดูสวยงาม
## วิธีรันโปรเจ็ค
<strong> 1. ดาวน์โหลดไลบราลี่เป็น zip และแตกไฟล์ในแฟ้ม Arduino. </strong>
<br /><br />
![alt text](/Images_for_readme/folder_directory.PNG)
<br /><br /><br /><br />
<strong> 2. เปิดแฟ้มที่พึ่งแยก และเปิดไฟล์ camera-webserver-for-esp32S3.ino เปลี่ยนชื่อกับรหัส WIFI ในบรรทัด 24 กับ 25 ให้ใช้อันเดียวกับที่คอมพิวเตอร์เรา  </strong>
<br /><br />
![alt text](/Images_for_readme/ssidPassword.PNG)
<br /><br /><br /><br />
<strong> 3. กดไปที่ tools ตรงตัวเลือกด้านบนและเปลี่ยน Board เป็น "ESP32S3 Dev Module" และเปลี่ยน PSRAM เป็น "OPI PSRAM".  </strong>
<br /><br />
![alt text](/Images_for_readme/IDE_configure.PNG)
<br /><br /><br /><br />
<strong> 4. อัพโหลดโค้ดขึ้นบน ESP32-S3 เสร็จแล้วให้คัดลอก ip address.  </strong>
<br /><br />
![alt text](/Images_for_readme/ip_IDE.PNG)
<br /><br /><br /><br />
<strong> 5. เปิด index.html และนำ ip address ที่คัดลอกมาไปวางใว้ในกล่อง.  </strong>
<br /><br />
![alt text](/Images_for_readme/ip_prompt.PNG)
<br /><br /><br /><br />
<strong> 6. เสร็จสิ้น  </strong>
<br/> <br/>
<strong> - เราสามารถใช้ไลบรารี่นี้ ในส่วนของการรวบรวมรูปภาพสำหรับ [FOMO](https://github.com/San279/train-FOMO-object-detect-esp32) AI ตรวจจับวัตถุ </strong>
<br/> <br/>
![alt text](/Images_for_readme/done.PNG)
<br /><br /><br /><br />
## ฟีเจอร์ของเว็ปเซอร์
- ยูเซอร์สามารถเปลี่ยนภาษา ตรงด้านขวาบนของหน้าเว็ป <br />
- เปลี่ยนการตั้งค่าต่างๆ ของกล้องได้ ดูเพิ่มเติมได้ที่[
https://heyrick.eu/blog/index.php?diary=20210418&keitai=0](https://heyrick.eu/blog/index.php?diary=20210418&keitai=0).<br />
- ยูเซอร์เลือกที่จะแอบการตั้งค่าของกล้องได้ กดตรงปุ่ม icon ด้านบน<br /><br />
![alt text](/Images_for_readme/setting.PNG)
<br /><br /><br />
- เปลี่ยนความละเอียดหรือมิติกล้อง. <br />
- ยูเซอร์สามารถตั้งชื่อ Class ได้ เหมาะสำหรับการเรียบเรียงรุปภาพให้เป็นระเบียบพอดาวโหลด์ <br /><br />
![alt_text](/Images_for_readme/resolution_class.PNG)
<br /><br /><br />
- เมื่อกดปุ้มรูปกล้องจะเริ่มการบันทึกรูป <br />
- ยูเซอร์สามารถเซ็ทเวลาระหว่างการบึนทึกรูปได้ ต่ำสุด 0.1 วินาที<br />
- เซ็ทจำนวนรูปที่อยากบันทึกต่อครั้ง.<br /> <br />
![alt_text](/Images_for_readme/capture_console.PNG)
<br /><br /> <br />
- เมื่อกดปุ้ม Download ตรงซ้ายบนของ gallery จะรวมรูปภาพทั้งหมดใว้ในแฟ้มเดียวและดาวโหลดเป็น zip<br />
- ปุ้ม Clear ตรงขวาบนจะลบรูปที่บันทึกใว้ทั้งหมด<br />
- ยูเซอร์สามารถเลือกลบรูปที่ไม่ต้องการได้.<br /><br />
![alt_text](/Images_for_readme/gallery_img.PNG)
<br /> <br /><br /> <br />
## เครดิต
ต้องขอขอบคุณ [WIRELESS SOLUTION ASIA CO.,LTD](https://wirelesssolution.asia/) สำหรับการสนับสนุนโปรเจ็คนี้ และ [RandomNerdTutorials]([RandomNerdTutorial](https://RandomNerdTutorials.com/esp32-cam-video-streaming-web-server-camera-home-assistant) สำหรับโค้ดส่วนสตรีมรูปภาพขึ้นบนเว็ปเซอร์เวอร์

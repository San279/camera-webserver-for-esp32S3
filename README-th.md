## เว็ปเซอร์กล้อง Esp32-S3
 [For English version](https://github.com/San279/camera-webserver-for-esp32S3)
 <br/>
 <br/>
 โปรเจ็คนี้ถูกออกแบบมาให้ใช้กับ AI ตรวจจับวัตถุ[FOMO](https://docs.edgeimpulse.com/docs/edge-impulse-studio/learning-blocks/object-detection/fomo-object-detection-for-constrained-devices) ในส่วนของการรวบรวมรูปภาพจาก AIoT บอร์ด ขึ้นเว็ปเซอร์เวอร์ เพื่อนำไปใช้ใน [Edge Impulse](https://edgeimpulse.com/)
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
<strong> 3. กดไปที่ tools ตรงตัวเลือกด้านบนและเปลี่ยน Board เป็น "ESP32S3 Dev Module" และเปลี่ยน PSRAM เป็น "OPI PSRAM"  </strong>
<br /><br />
![alt text](/Images_for_readme/IDE_configure.PNG)
<br /><br /><br /><br />
<strong> 4. อัพโหลดโค้ดขึ้นบน ESP32-S3 เสร็จแล้วให้คัดลอก ip address  </strong>
<br /><br />
![alt text](/Images_for_readme/ip_IDE.PNG)
<br /><br /><br /><br />
<strong> 5. เปิด index.html และนำ ip address ที่คัดลอกมาวางใว้ในกล่องและกด ok </strong>
<br /><br />
![alt text](/Images_for_readme/ip_prompt.PNG)
<br /><br /><br /><br />
<strong> 6. เสร็จสิ้น  </strong>
<br/> <br/>
![alt text](/Images_for_readme/done.PNG)
<br /><br /><br /><br />
## ฟีเจอร์ของเว็ปเซอร์
- เมื่อกดปุ่มรูปกล้องจะเริ่มการบันทึกรูปภาพ<br />
- เราสามารถเซ็ทเวลาระหว่างการบึนทึกแต่ละรูป<br />
- เซ็ทจำนวนรูปที่อยากบันทึกต่อครั้ง<br /> <br />
![alt_text](/Images_for_readme/capture_console.PNG)
<br /><br /> <br />
- เมื่อเราบึนทึกรูปแล้ว เราสามารถดาวโหลดรูปถาพโดยการกดไปที่ปุ่มตรงซ้ายล้างของเว็ป<br />
- ลบรูปที่บันทึกใว้ทั้งหมดด้วยการกดปุ่มตรงด้านขวาล่าง<br />
![alt_text](/Images_for_readme/gallery_img.PNG)
- เปลี่ยนการตั้งค่าต่างๆ ของกล้องได้ แนะทำให้เซ็ทความอิ่มสีใว้ที่ 2 หรือ สามารถดูเพิ่มเติมได้ที่[https://heyrick.eu/blog/index.php?diary=20210418&keitai=0](https://heyrick.eu/blog/index.php?diary=20210418&keitai=0) <br />
- เปลี่ยนความละเอียดหรือมิติกล้อง <br />
- ยูเซอร์ควรตั้งชื่อของ Class หรือประเภทของวุตถุ เนื่องจาก Edge Impulse ไม่สามารถอัพโหลดรูปที่มีชื่อเหมือนกันได้ <br /><br />
![alt_text](/Images_for_readme/resolution_class.PNG)
<br /><br /><br />
<br /> <br /><br /> <br />
## เครดิต
ต้องขอขอบคุณ [WIRELESS SOLUTION ASIA CO.,LTD](https://wirelesssolution.asia/) สำหรับการสนับสนุนโปรเจ็คนี้ และ [RandomNerdTutorials]([RandomNerdTutorial](https://RandomNerdTutorials.com/esp32-cam-video-streaming-web-server-camera-home-assistant) สำหรับโค้ดส่วนสตรีมรูปภาพขึ้นบนเว็ปเซอร์เวอร์

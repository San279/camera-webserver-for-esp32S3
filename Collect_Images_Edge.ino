/*********
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp32-cam-video-streaming-web-server-camera-home-assistant/
  
  IMPORTANT!!! 
   - Select Board "AI Thinker ESP32-CAM"
   - GPIO 0 must be connected to GND to upload a sketch
   - After connecting GPIO 0 to GND, press the ESP32-CAM on-board RESET button to put your board in flashing mode
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*********/

#include "esp_camera.h"
#include <WiFi.h>
#include "esp_timer.h"
#include "img_converters.h"
#include "Arduino.h"
#include "fb_gfx.h"
#include "soc/soc.h"           //disable brownout problems
#include "soc/rtc_cntl_reg.h"  //disable brownout problems
#include "esp_http_server.h"
#include <string>

//Replace with your network credentials
const char *ssid = "****";
const char *password = "****";

#define PART_BOUNDARY "123456789000000000000987654321"

#define PWDN_GPIO_NUM -1
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 15
#define SIOD_GPIO_NUM 4
#define SIOC_GPIO_NUM 5

#define Y9_GPIO_NUM 16
#define Y8_GPIO_NUM 17
#define Y7_GPIO_NUM 18
#define Y6_GPIO_NUM 12
#define Y5_GPIO_NUM 10
#define Y4_GPIO_NUM 8
#define Y3_GPIO_NUM 9
#define Y2_GPIO_NUM 11
#define VSYNC_GPIO_NUM 6
#define HREF_GPIO_NUM 7
#define PCLK_GPIO_NUM 13


static const char *_STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char *_STREAM_BOUNDARY = "\r\n--" PART_BOUNDARY "\r\n";
static const char *_STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";
static const char *_STREAM_TYPE_TXT = "Content-Type: text/plain";


httpd_handle_t stream_httpd = NULL;

void cameraSetup(int resolution) {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  if (resolution == 160120) {
    config.frame_size = FRAMESIZE_QQVGA;
  } else if (resolution == 240240) {
    config.frame_size = FRAMESIZE_240X240;
  } else if (resolution == 320240) {
    config.frame_size = FRAMESIZE_QVGA;
  } else if (resolution == 640480) {
    config.frame_size = FRAMESIZE_VGA;
  } else if (resolution == 800600) {
    config.frame_size = FRAMESIZE_SVGA;
  } else if (resolution == 1024768) {
    config.frame_size = FRAMESIZE_XGA;
  } else if (resolution == 12801024) {
    config.frame_size = FRAMESIZE_SXGA;
  } else if (resolution == 16001200) {
    config.frame_size = FRAMESIZE_UXGA;
  }else{
    config.frame_size = FRAMESIZE_240X240;
  }
  config.jpeg_quality = 5;
  config.fb_count = 2;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
  }else{
    sensor_t *s = esp_camera_sensor_get();
    s->set_vflip(s, 1);
  }
}
static esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t *fb = NULL;
  esp_err_t res = ESP_OK;
  esp_err_t res2 = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t *_jpg_buf = NULL;
  char *part_buf[64];
  res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
  if (res != ESP_OK) {
    return res;
  }
  while (true) {
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      res = ESP_FAIL;
    } else {
      //if(fb->width > 400){
      if (fb->format != PIXFORMAT_JPEG) {
        bool jpeg_converted = frame2jpg(fb, 80, &_jpg_buf, &_jpg_buf_len);
        esp_camera_fb_return(fb);
        fb = NULL;
        if (!jpeg_converted) {
          Serial.println("JPEG compression failed");
          res = ESP_FAIL;
        }
      } else {
        _jpg_buf_len = fb->len;
        _jpg_buf = fb->buf;
      }
      //}
    }
    if (res == ESP_OK) {
      size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);
      res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
    }
    if (res == ESP_OK) {
      res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
    }
    if (res == ESP_OK) {
      res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
    }
    if (fb) {
      esp_camera_fb_return(fb);
      fb = NULL;
      _jpg_buf = NULL;
    } else if (_jpg_buf) {
      free(_jpg_buf);
      _jpg_buf = NULL;
    }
    if (res != ESP_OK) {
      break;
    }
    //Serial.printf("MJPG: %uB\n",(uint32_t)(_jpg_buf_len));
  }
  //httpd_resp_sendstr_chunk(req, "this is a test");
  return res;
}

static esp_err_t setting_handler(httpd_req_t *req) {
  char buffer[100];
  String bufVal = "";
  bool startCap = false;
  String key = "";
  Serial.println("setting handler accessed");
  if (httpd_req_get_url_query_str(req, buffer, sizeof(buffer)) == ESP_OK) {
    for (int i = 0; i < buffer[i] != '\0'; i++) {
      if (buffer[i] == '=') {
        startCap = true;
        continue;
      }
      if (startCap == true) {
        bufVal += buffer[i];
      } else {
        key += buffer[i];
      }
      if (buffer[i] == '&' || buffer[i + 1] == '\0') {
        startCap = false;
        //Serial.println(key);
        int num = bufVal.toInt();
        sensor_t *s = esp_camera_sensor_get();
        if (key == "bright") {
          s->set_brightness(s, num);
        }
        if (key == "contrast") {
          s->set_contrast(s, num);
        }
        if (key == "saturation") {
          s->set_saturation(s, num);
        }
        if (key == "ae") {
          s->set_ae_level(s, num);
        }
        if (key == "effect") {
          s->set_special_effect(s, num);
        }
        if (key == "mode") {
          s->set_wb_mode(s, num);
        }
        if (key == "resolution") {
          esp_camera_deinit();
          cameraSetup(num);
        }
        bufVal = "";
        key = "";
      }
    }
  }
  const char *response = "setting changed sucessfully!";
  httpd_resp_send(req, response, strlen(response));
  return ESP_OK;
}


void startCameraServer() {
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 80;

  httpd_uri_t index_uri = {
    .uri = "/",
    .method = HTTP_GET,
    .handler = stream_handler,
    .user_ctx = NULL
  };

  httpd_uri_t setting_uri = {
    .uri = "/setting",
    .method = HTTP_GET,
    .handler = setting_handler,
    .user_ctx = NULL
  };

  //Serial.printf("Starting web server on port: '%d'\n", config.server_port);
  if (httpd_start(&stream_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(stream_httpd, &index_uri);
    httpd_register_uri_handler(stream_httpd, &setting_uri);
  }
}

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);  //disable brownout detector

  Serial.begin(115200);
  Serial.setDebugOutput(false);
  cameraSetup(240240);
  // Wi-Fi connection
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  Serial.print("Camera Stream Ready! Go to: http://");
  Serial.print(WiFi.localIP());
  Serial.print("/");

  // Start streaming web server
  startCameraServer();
}

void loop() {
  delay(1);
}

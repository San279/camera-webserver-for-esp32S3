/*********
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp32-cam-video-streaming-web-server-camera-home-assistant/
   
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
const char *ssid = "***";
const char *password = "***";

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


httpd_handle_t stream_httpd = NULL;
sensor_t *s = NULL;
bool is_initialised = false;

/* Function Definitions ----------------------------------------*/
bool camera_setup();
bool camera_setting(String setting, int value);
char *get_camera_status();

static esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t *fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t *_jpg_buf = NULL;
  char *part_buf[64];
  res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
  res = httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  if (!is_initialised) {
    Serial.println("Camera is not initialised for streaming");
    res = ESP_FAIL;
    return res;
  }
  while (true) {
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      res = ESP_FAIL;
      break;
    }
    _jpg_buf_len = fb->len;
    _jpg_buf = fb->buf;
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
  }
  return res;
}

static esp_err_t setting_handler(httpd_req_t *req) {
  char buffer[100];
  String bufVal = "";
  bool startCap = false;
  bool hasParam = false;
  String param = "";
  int value = 0;
  esp_err_t res = ESP_OK;
  res = httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  if (httpd_req_get_url_query_str(req, buffer, sizeof(buffer)) == ESP_OK) {
    hasParam = true;
    for (int i = 0; i < buffer[i] != '\0'; i++) {
      if (buffer[i] == '=') {
        startCap = true;
        continue;
      }
      if (startCap == true) {
        bufVal += buffer[i];
      } else {
        param += buffer[i];
      }
      if (buffer[i] == '&' || buffer[i + 1] == '\0') {
        startCap = false;
        value = bufVal.toInt();
      }
    }
  }
  //Serial.println(hasParam);
  if (hasParam) {
    if (!camera_setting(param, value)) {
      httpd_resp_send_err(req, HTTPD_500_INTERNAL_SERVER_ERROR, "failed to change setting from esp");
      return ESP_OK;
    }
  }
  char *camera_status_res = get_camera_status();
  httpd_resp_send(req, camera_status_res, strlen(camera_status_res));
  return res;
}


void startCameraServer() {
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 80;

  httpd_uri_t index_uri = {
    .uri = "/stream",
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

  if (httpd_start(&stream_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(stream_httpd, &index_uri);
    httpd_register_uri_handler(stream_httpd, &setting_uri);
  }
}

bool camera_setup() {
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
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 12;
  config.fb_count = 2;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return false;
  }
  is_initialised = true;
  s = esp_camera_sensor_get();
  s->set_vflip(s, 1);
  return true;
}

bool camera_setting(String setting, int value) {
  if (setting == "bright") s->set_brightness(s, value);
  else if (setting == "contrast") s->set_contrast(s, value);
  else if (setting == "saturation") s->set_saturation(s, value);
  else if (setting == "effect") s->set_special_effect(s, value);
  else if (setting == "whiteball") s->set_whitebal(s, value);
  else if (setting == "awb") s->set_awb_gain(s, value);
  else if (setting == "mode") s->set_wb_mode(s, value);
  else if (setting == "aec2") s->set_aec2(s, value);
  else if (setting == "ae") s->set_ae_level(s, value);
  else if (setting == "aec") s->set_aec_value(s, value);
  else if (setting == "agc") s->set_agc_gain(s, value);
  else if (setting == "gainCeiling") s->set_gainceiling(s, (gainceiling_t)value);
  else if (setting == "bpc") s->set_bpc(s, value);
  else if (setting == "wpc") s->set_wpc(s, value);
  else if (setting == "rawGma") s->set_raw_gma(s, value);
  else if (setting == "resolution") s->set_framesize(s, (framesize_t)value);
  else if (setting == "vflip") s->set_vflip(s, value);
  else if (setting == "hmirror") s->set_hmirror(s, value);
  return true;
}

char *get_camera_status() {
  static char json_response[1024];
  char *p = json_response;
  *p++ = '{';
  p += sprintf(p, "\"framesize\":%u,", s->status.framesize);
  p += sprintf(p, "\"quality\":%u,", s->status.quality);
  p += sprintf(p, "\"brightness\":%d,", s->status.brightness);
  p += sprintf(p, "\"contrast\":%d,", s->status.contrast);
  p += sprintf(p, "\"saturation\":%d,", s->status.saturation);
  p += sprintf(p, "\"sharpness\":%d,", s->status.sharpness);
  p += sprintf(p, "\"special_effect\":%u,", s->status.special_effect);
  p += sprintf(p, "\"wb_mode\":%u,", s->status.wb_mode);
  p += sprintf(p, "\"awb\":%u,", s->status.awb);
  p += sprintf(p, "\"awb_gain\":%u,", s->status.awb_gain);
  p += sprintf(p, "\"aec\":%u,", s->status.aec);
  p += sprintf(p, "\"aec2\":%u,", s->status.aec2);
  p += sprintf(p, "\"denoise\":%u,", s->status.denoise);
  p += sprintf(p, "\"ae_level\":%d,", s->status.ae_level);
  p += sprintf(p, "\"aec_value\":%u,", s->status.aec_value);
  p += sprintf(p, "\"agc\":%u,", s->status.agc);
  p += sprintf(p, "\"agc_gain\":%u,", s->status.agc_gain);
  p += sprintf(p, "\"gainceiling\":%u,", s->status.gainceiling);
  p += sprintf(p, "\"bpc\":%u,", s->status.bpc);
  p += sprintf(p, "\"wpc\":%u,", s->status.wpc);
  p += sprintf(p, "\"raw_gma\":%u,", s->status.raw_gma);
  p += sprintf(p, "\"hmirror\":%u,", s->status.hmirror);
  p += sprintf(p, "\"vflip\":%u,", s->status.vflip);
  p += sprintf(p, "\"dcw\":%u,", s->status.dcw);
  p += sprintf(p, "\"colorbar\":%u", s->status.colorbar);
  *p++ = '}';
  *p++ = 0;
  return json_response;
}

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);  //disable brownout detector

  Serial.begin(115200);
  Serial.setDebugOutput(false);
  if (!camera_setup()) {
    delay(500);
    Serial.print(".");
  }
  // Wi-Fi connection
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Open index.html and paste this ip address in prompt  ");
  Serial.print(WiFi.localIP());

  startCameraServer();
}

void loop() {
  delay(1);
}
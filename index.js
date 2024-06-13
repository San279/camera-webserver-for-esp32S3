/////////////// labels and languages ////////////////////
var classLabel = document.getElementById("classLabel")
var intervalLabel = document.getElementById("intervalLabel");
var instanceLabel = document.getElementById("instanceLabel");
var brightLabel = document.getElementById("brightLabel");
var contrastLabel = document.getElementById("contrastLabel");
var saturationLabel = document.getElementById("saturationLabel");
var whiteBallLabel = document.getElementById("whiteballLabel");
var awbLabel = document.getElementById("awbLabel");
var aeLabel = document.getElementById("aeLabel");
var exposureLabel = document.getElementById("exposureLabel");
var aec2Label = document.getElementById("aec2Label");
var gainLabel = document.getElementById("gainLabel");
var agcLabel = document.getElementById("agcLabel");
var gainCelingLabel = document.getElementById("gainCelingLabel");
var rawGmaLabel = document.getElementById("rawGmaLabel");
var effectLabel = document.getElementById("effectLabel");
var modeLabel = document.getElementById("modeLabel");
var vflipLabel = document.getElementById("vflipLabel");
var hmirrorLabel = document.getElementById("hmirrorLabel");

var englishSelect = document.getElementById("englishSelect");
var thaiSelect = document.getElementById("thaiSelect");

const en =
{
  "class": "Class",
  "interval": "Interval",
  "instances": "Instances",
  "brightness": "Brightness",
  "contrast": "Contrast",
  "saturation": "Saturation",
  "whiteBall": "White Ball",
  "awb": "Auto Whiteball",
  "ae_level": "Auto Exposure",
  "aec2": "Auto Exposure Control",
  "agc": "Auto Gain Control",
  "gainCeling": "Gain Ceiling",
  "rawGma": "Raw GMA",
  "effects": "Effect",
  "mode": "Mode",
  "vflip": "Rotate Image",
  "hmirror": "Mirror Image"
}

const th =
{
  "class": "หมวด",
  "interval": "เวลาระหว่างการถ่ายรูป",
  "instances": "จำนวนรูป",
  "brightness": "ความสว่าง",
  "contrast": "ความต่างระดับสี",
  "saturation": "ความอิ่มสี",
  "whiteBall": "สมดุลแสงสีขาว",
  "awb": "สมดุลแสงสีขาวแบบออโต้",
  "ae_level": "การเปิดรับแสงแบบออโต้",
  "aec2": "การคุมแสงแบบออโต้",
  "agc": "ความไวต่อแสงแบบออโต้",
  "gainCeling": "ระดับค่าของความไวต่อแสง",
  "rawGma": "ความสว่างกล้องแบบออโต้",
  "effects": "เอฟเฟคกล้อง",
  "mode": "โหมดกล้อง",
  "vflip": "หมุนรูป",
  "hmirror": "พลิกรูป",

}
function changeLanguage(lang) {
  classLabel.innerHTML = lang.class;
  intervalLabel.innerHTML = lang.interval;
  instanceLabel.innerHTML = lang.instances;
  brightLabel.innerHTML = lang.brightness;
  contrastLabel.innerHTML = lang.contrast;
  saturationLabel.innerHTML = lang.saturation;
  whiteBallLabel.innerHTML = lang.whiteBall;
  awbLabel.innerHTML = lang.awb;
  aeLabel.innerHTML = lang.ae_level;
  aec2Label.innerHTML = lang.aec2;
  agcLabel.innerHTML = lang.agc;
  gainCelingLabel.innerHTML = lang.gainCeling;
  rawGmaLabel.innerHTML = lang.rawGma;
  effectLabel.innerHTML = lang.effects;
  modeLabel.innerHTML = lang.mode;
  vflipLabel.innerHTML = lang.vflip;
  hmirrorLabel.innerHTML = lang.hmirror;
}

englishSelect.addEventListener("click", function () {
  thaiSelect.style.color = "bisque";
  englishSelect.style.color = "blue";
  changeLanguage(en);
  localStorage.setItem("lang", "en");
})

thaiSelect.addEventListener("click", function () {
  thaiSelect.style.color = "blue";
  englishSelect.style.color = "bisque";
  changeLanguage(th);
  localStorage.setItem("lang", "th");
})

function getLanguage() {
  var getLang = localStorage.getItem("lang");
  if (getLang == "en") {
    englishSelect.click();
  }
  else if (getLang = "th") {
    thaiSelect.click();
  }
  else {
    englishSelect.click();
  }
}

//////////////////////////////////////////

/////////////// console buttons ///////////////////
var classLabel = document.getElementById("class");
var captureButton = document.getElementById("capture");
var clearButton = document.getElementById("clear");
var stopButton = document.getElementById("stop");
var downloadButton = document.getElementById("download");

var picture = document.getElementById("stream");
var loadingIcon = document.getElementById("loading");
var setting = document.getElementById('setting');
var settings_contents = document.getElementById("setting-contents");
var arrow = document.getElementById("arrow");
/////////////////////////////

var width = 0;
var height = 0;
var state = 0;
var settingHide = true;
var galleryDict = new Map();
let index = 0;

async function getStreamAddress() {
  let previousStreamRequest = localStorage.getItem('streamPath');
  let streamState = localStorage.getItem('streamState');
  if (streamState !== '1') {
    var inputAddress = prompt('ip address from arduino');
    var convertedHttpStream = "http://" + inputAddress + "/stream";
    var convertedHttpSetting = "http://" + inputAddress + "/setting?";
    localStorage.setItem('streamPath', convertedHttpStream);
    localStorage.setItem('settingPath', convertedHttpSetting);
    return convertedHttpStream;
  }
  console.log(previousStreamRequest);
  return previousStreamRequest;
}

async function checkStream(url) {
  showLoadingIcon();
  picture.setAttribute("src", url.toString());
  return new Promise((resolve) => {
    picture.onload = () => {
      width = picture.clientWidth;
      height = picture.clientHeight;
      console.log(width + " X " + height);
      localStorage.setItem('streamState', '1');
      resolve(true);
    };
    picture.onerror = () => {
      alert("check if the ip address is valid or if CORS is enabled")
      localStorage.setItem('streamState', '0');
      resolve(false);
    }
  }
  );
}

async function fetchStream() {
  for (let i = 0; i < 5; i++) {
    const inputAddress = await getStreamAddress();
    await checkStream(inputAddress).then(console.log);
    await new Promise(resolve => setTimeout(resolve, 200));
    let streamState = localStorage.getItem('streamState');
    if (streamState == '1') {
      removeLoadingIcon();
      break;
    }
  }
}

async function stopStream() {
  picture.removeAttribute("src");
}

var inputInterval = document.getElementById('interval');
inputInterval.value = 0.35;

var inputInstance = document.getElementById('instance');
inputInstance.value = 30;

////////// camera settings /////////////

var resolution = document.getElementById("resolution");
resolution.addEventListener("change", changeResolution);

var brightness = document.getElementById("brightness");
brightness.addEventListener("change", changeBrightness);

var contrast = document.getElementById("contrast");
contrast.addEventListener("change", changeContrast);

var saturation = document.getElementById("saturation");
saturation.addEventListener("change", changeSaturation);

var whiteball = document.getElementById("whiteball");
whiteball.addEventListener("change", changeWhiteball);

var awb = document.getElementById("awb");
awb.addEventListener("change", changeAwb);

var ae = document.getElementById("ae");
ae.addEventListener("change", changeAe);

var aec2 = document.getElementById("aec2");
aec2.addEventListener("change", changeAec2);
aec2.value = 1;

var agc = document.getElementById("agc");
agc.addEventListener("change", changeAgc);

var gainCeling = document.getElementById("gainCeling");
gainCeling.addEventListener("change", changeGainCeiling);

var rawGma = document.getElementById("rawGma");
rawGma.addEventListener("change", changeRawGma);
rawGma.value = 1;

var effect = document.getElementById("effect");
effect.addEventListener("change", changeEffect);

var mode = document.getElementById("mode");
mode.addEventListener("change", changeMode);

var vflip = document.getElementById("vflip");
vflip.addEventListener("change", changeVflip);

var hmirror = document.getElementById("hmirror");
hmirror.addEventListener("change", changeHmirror);

async function changeBrightness() {
  var selectedBrightness = brightness.options[brightness.selectedIndex].value;
  var params = "bright=" + selectedBrightness
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeContrast() {
  var selectedContrast = contrast.options[contrast.selectedIndex].value;
  var params = "contrast=" + selectedContrast;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeSaturation() {
  var selectedSaturation = saturation.options[saturation.selectedIndex].value;
  var params = "saturation=" + selectedSaturation;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeWhiteball(){
  var selectedWhiteball = whiteball.options[whiteball.selectedIndex].value;
  var params = "whiteball=" + selectedWhiteball;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeAwb(){
  var selectedAwb = awb.options[awb.selectedIndex].value;
  var params = "awb=" + selectedAwb;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeAe() {
  var selectedAe = ae.options[ae.selectedIndex].value;
  var params = "ae=" + selectedAe;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeAec2(){
  var selectedAec2 = aec2.options[aec2.selectedIndex].value;
  var params = "aec2=" + selectedAec2;
  await changeSettingApi(params);
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeAgc(){
  var selectedAgc = agc.options[agc.selectedIndex].value;
  var params = "agc=" + selectedAgc;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeGainCeiling(){
  var selectedGainCeiling = gainCeling.options[gainCeling.selectedIndex].value;
  var params = "gainCeiling=" + selectedGainCeiling;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeRawGma(){
  var selectedRawGma = rawGma.options[rawGma.selectedIndex].value;
  var params = "rawGma=" + selectedRawGma;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeEffect() {
  var selectedEffect = effect.options[effect.selectedIndex].value;
  var params = "effect=" + selectedEffect;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeMode() {
  var selectedMode = mode.options[mode.selectedIndex].value;
  var params = "mode=" + selectedMode;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeVflip() {
  var selectedVflip = vflip.options[vflip.selectedIndex].value;
  var params = "vflip=" + selectedVflip;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeHmirror() {
  var selectedHmirror = hmirror.options[hmirror.selectedIndex].value;
  var params = "hmirror=" + selectedHmirror;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeResolution() {
  var selectedRes = resolution.options[resolution.selectedIndex].value;
  var params = "resolution=" + selectedRes;
  const jsonCameraStatus = await changeSettingApi(params);
  await updateSettings(jsonCameraStatus);
}

async function changeSettingApi(params) {
  
  await stopStream();
  let settingAddress = localStorage.getItem('settingPath');
  const response = await fetch(settingAddress + params);
  if (response.status == 200){
    const data = await response.json();
    console.log(data);
    return data;
  }
  
}

async function updateSettings(cameraStatus){
  console.log(cameraStatus);
  brightness.value = cameraStatus.brightness; //
  contrast.value = cameraStatus.contrast; //
  saturation.value = cameraStatus.saturation; //
  awb.value = cameraStatus.awb;
  ae.value = cameraStatus.ae_level;
  aec2.value = cameraStatus.aec2;
  agc.value = cameraStatus.agc;
  gainCeling.value = cameraStatus.gainceiling;
  rawGma.value = cameraStatus.raw_gma;
  effect.value = cameraStatus.special_effect;
  mode.value = cameraStatus.wb_mode;
  vflip.value = cameraStatus.vflip;
  hmirror.value = cameraStatus.hmirror;
  resolution.selectedIndex = cameraStatus.framesize;
  await new Promise(resolve => setTimeout(resolve, 500));
  await fetchStream();
}

////////////////////////////////////////////////////////

async function getInitialSettingsAndStream() {
  await fetchStream();
  getLanguage();
  const jsonCameraStatus = await changeSettingApi("resolution=4");
  await updateSettings(jsonCameraStatus);
  updateImageNo();
}

getInitialSettingsAndStream();

var galleryImg = document.getElementById("galleryImg");
galleryImg.style.visibility = "hidden";

downloadDelete = document.getElementById('download-delete')
downloadDelete.style.visibility = 'hidden';

stopButton.style.visibility = 'hidden';

async function displayCanvas(picIndex) {
  const displayCanvas = document.createElement("canvas");
  displayCanvas.id = "cap" + picIndex.toString();
  var WidthRatio = Math.ceil((width / height) * 240);
  //console.log(WidthRatio);
  displayCanvas.setAttribute("height", "240px");
  displayCanvas.setAttribute("width", WidthRatio + "px");
  displayCanvas.style.padding = "10px"
  displayCanvas.style.zIndex = "1";
  const newDiv = createPictureDiv(picIndex);
  const deleteButton = createDeleteButton(picIndex);
  galleryImg.appendChild(newDiv);
  newDiv.appendChild(displayCanvas);
  newDiv.appendChild(deleteButton);
  displayCanvas.getContext('2d').drawImage(picture, 0, 0, WidthRatio, 240);
  galleryImg.style.visibility = "visible";
  downloadDelete.style.visibility = "visible";
}

function createPictureDiv(picIndex) {
  const newDiv = document.createElement("div");
  newDiv.id = "imgDiv" + picIndex.toString();
  newDiv.style.display = "flex";
  newDiv.style.justifyContent = "center"
  newDiv.style.width = "350px";
  newDiv.style.height = "240px"
  newDiv.style.color = "red";
  return newDiv;
}

function createDeleteButton(picIndex) {
  const deleteButton = document.createElement("button");
  deleteButton.id = picIndex.toString();
  deleteButton.style.zIndex = "2";
  deleteButton.style.position = "relative";
  deleteButton.style.fontSize = "17px";
  deleteButton.style.fontWeight = "700";
  deleteButton.style.left = "-20px";
  deleteButton.style.width = "22px";
  deleteButton.style.height = "22px"
  deleteButton.style.border = "none";
  deleteButton.style.borderRadius = "50%";
  deleteButton.style.backgroundColor = "red";
  deleteButton.style.color = "bisque";
  deleteButton.style.cursor = "pointer";
  deleteButton.innerText = "-";
  deleteButton.setAttribute("onclick", "deleteButton(this.id)");
  return deleteButton;
}

let testUrl = [];
async function savePicture(picIndex) {
  const hiddenCanvas = document.createElement("canvas");
  hiddenCanvas.id = "saved" + picIndex;
  hiddenCanvas.setAttribute("width", width + "px");
  hiddenCanvas.setAttribute("height", height + "px");
  hiddenCanvas.getContext('2d').drawImage(picture, 0, 0, width, height);
  let image_data_url = hiddenCanvas.toDataURL('image' + index - 1 + '/jpg');
  galleryDict.set("saved" + picIndex, image_data_url);
  await updateImageNo();
}

function getInterval() {
  let interval = Math.round(inputInterval.value * 1000);
  if (interval < 100) {
    alert("cannot be less than 0.1!!");
    inputInterval.value = 0.1;
    return 100;
  }
  return interval;
}

function getInstance() {
  if (inputInstance.value < 1) {
    alert("instances cannot be less than 1!");
    inputInstance.value = 1;
  }
  if (!Number.isInteger(inputInstance.value)) {
    if (inputInstance < 1) {
      inputInstance.value = Math.round(inputInstance.value + 1);
    }
    else {
      inputInstance.value = Math.round(inputInstance.value);
    }
  }
  return inputInstance.value;
}

function deleteButton(pictureId) {
  document.getElementById("imgDiv" + pictureId).remove();
  galleryDict.delete("saved" + pictureId);
  updateImageNo();
  if (galleryDict.size == 0) {
    galleryImg.style.visibility = "hidden";
    downloadDelete.style.visibility = "hidden";
  }
}

async function chageOtherSettings(setting) {
  if (setting !== "bright") {
    brightness.value = 0;
  }
  if (setting !== "contrast") {
    contrast.value = 0;
  }
  if (setting !== "saturation") {
    saturation.value = 0;
  }
  if (setting !== "ae") {
    ae.value = 0;
  }
  else if (setting !== "effect") {
    effect.value = 0;
  }
}

/////////////////////////////////////////////////
setting.addEventListener("click", function () {
  //console.log(settingHide);
  if (settingHide == true) {
    settings_contents.style.visibility = "hidden";
    arrow.src = "icons/caret-up.png";
    settingHide = false;
  } else if (settingHide == false) {
    arrow.src = "icons/caret-down.png";
    settings_contents.style.visibility = "visible";
    settingHide = true;
  }
})

captureButton.addEventListener("click", async function () {
  captureButton.style.visibility = 'hidden';
  stopButton.style.visibility = 'visible';
  state = 1;
  var instance = getInstance();
  for (let i = 0; i < instance; i++) {
    if (state === 0) {
      break;
    }
    await displayCanvas(index);
    await savePicture(index);
    index++;
    await new Promise(resolve => setTimeout(resolve, getInterval()));
  }
  captureButton.style.visibility = 'visible';
  stopButton.style.visibility = 'hidden';
})

clearButton.addEventListener("click", function () {
  const hiddenCan = document.getElementById("savedImg");
  while (galleryImg.firstChild) {
    galleryImg.removeChild(galleryImg.firstChild);
  }
  while (hiddenCan.firstChild) {
    hiddenCan.removeChild(hiddenCan.firstChild);
  }

  galleryDict.clear();
  updateImageNo();
  galleryImg.style.visibility = "hidden";
  downloadDelete.style.visibility = "hidden";
})

stopButton.addEventListener("click", async function () {
  captureButton.style.visibility = 'visible';
  stopButton.style.visibility = 'hidden';
  state = 0;
})

downloadButton.addEventListener("click", async function () {
  var downloadLink = document.createElement("a");
  const zip = new JSZip();
  if (galleryDict.size == 0) {
    alert("No image found!!");
    return;
  }
  var count = 0;
  for (const value of galleryDict.values()) {
    let data = value.substr(value.indexOf(",") + 1)
    count++;
    zip.file(classLabel.value + count.toString() + ".jpg", data, { base64: true })
  }

  const zipFile = await zip.generateAsync({ type: 'blob' });
  downloadLink.download = "images_of_" + classLabel.value + '.zip';

  const url = URL.createObjectURL(zipFile);
  downloadLink.href = url;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(url);
})

async function updateImageNo() {
  var imageNo = document.getElementById("image_no");
  imageNo.value = galleryDict.size;
}


function showLoadingIcon() {
  loadingIcon.src = "./loading.gif";
  loadingIcon.setAttribute("width", "120");
  loadingIcon.setAttribute("height", "120");
  loadingIcon.style.visibility = "visible";
}

function removeLoadingIcon() {
  loadingIcon.removeAttribute('src');
  loadingIcon.style.visibility = 'hidden';
}

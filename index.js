var classLabel = document.getElementById("class");
var captureButton = document.getElementById("capture");
var clearButton = document.getElementById("clear");
var changeSetting = document.getElementById("changeSetting");
var brightness = document.getElementById("brightness");
var stopButton = document.getElementById("stop");
var downloadButton = document.getElementById("download");
var picture = document.getElementById("stream");
var loadingIcon = document.getElementById("loading");

var resolution = document.getElementById("resolution");
resolution.addEventListener("change", changeResolution);

var resMap = new Map();
setResMap();
var width = 0;
var height = 0;
var state = 0;
var galleryDict = new Map();
let index = 0;


async function getInputAddress() {
  let previoushttpRequest = localStorage.getItem('ipAddress');
  let streamState = localStorage.getItem('streamState');
  if (streamState !== '1') {
    var inputAddress = prompt('ip address from arduino');
    var convertedHttpReq = "http://" + inputAddress + "/";
    localStorage.setItem('ipAddress', convertedHttpReq);
    return convertedHttpReq;
  }
  return previoushttpRequest;
}

function checkStream(url) {
  showLoadingIcon();
  picture.src = url;
  return new Promise((resolve) => {
    picture.onload = () => {
      width = picture.clientWidth;
      height = picture.clientHeight;
      displayPictureRes(width, height);
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

/*
picture.onload = function () {
  width = picture.clientWidth;
  height = picture.clientHeight;
  var mapKey = width.toString() + height.toString();
  resolution.selectedIndex = resMap.get(mapKey);
}
*/

async function fetchStream() {
  for (let i = 0; i < 5; i++) {
    const inputAddress = await getInputAddress();
    await checkStream(inputAddress).then(console.log);
    await new Promise(resolve => setTimeout(resolve, 200));
    let streamState = localStorage.getItem('streamState');
    if (streamState == '1') {
      removeLoadingIcon();
      break;
    }
  }
}
fetchStream();

var inputInterval = document.getElementById('interval');
inputInterval.value = 0.35;

var inputInstance = document.getElementById('instance');
inputInstance.value = 30;

var brightness = document.getElementById("brightness");
brightness.addEventListener("change", changeBrightness);

var contrast = document.getElementById("contrast");
contrast.addEventListener("change", changeContrast);

var saturation = document.getElementById("saturation");
saturation.addEventListener("change", changeSaturation);

var ae = document.getElementById("ae");
ae.addEventListener("change", changeAe);

var effect = document.getElementById("effect");
effect.addEventListener("change", changeEffect);

var mode = document.getElementById("mode");
mode.addEventListener("change", changeMode);

var imageNo = document.getElementById("image_no");
imageNo.style.visibility = "hidden";

resetAllSetting();
updateImageNo();
document.getElementById("galleryImg").style.visibility = "hidden";
document.getElementById('stop').style.visibility = 'hidden';

async function stopStream() {
  picture.removeAttribute("src");
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function displayCanvas(picIndex) {
  const displayCanvas = document.createElement("canvas");
  displayCanvas.id = "cap" + picIndex.toString();
  displayCanvas.setAttribute("width", "320px");
  displayCanvas.setAttribute("height", "240px");
  displayCanvas.style.padding = "10px"
  displayCanvas.style.zIndex = "1";
  const newDiv = createPictureDiv(picIndex);
  const deleteButton = createDeleteButton(picIndex);
  document.getElementById("galleryImg").appendChild(newDiv);
  newDiv.appendChild(displayCanvas);
  newDiv.appendChild(deleteButton);
  displayCanvas.getContext('2d').drawImage(picture, 0, 0, 320, 240);
  document.getElementById("galleryImg").style.visibility = "visible";
}

function createPictureDiv(picIndex) {
  const newDiv = document.createElement("div");
  newDiv.id = "imgDiv" + picIndex.toString();
  newDiv.style.width = "300px";
  newDiv.style.paddingLeft = "40px";
  return newDiv;
}

function createDeleteButton(picIndex) {
  const deleteButton = document.createElement("button");
  deleteButton.id = picIndex.toString();
  deleteButton.style.zIndex = "2";
  deleteButton.style.position = "relative";
  deleteButton.style.top = "-15%";
  deleteButton.style.left = "100%";
  deleteButton.style.fontSize = "17px";
  deleteButton.style.fontWeight = "700";
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
  imageNo.style.visibility = "visible";
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
    imageNo.style.visibility = "hidden";
    document.getElementById("galleryImg").style.visibility = "hidden";
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

function resetAllSetting() {
  brightness.value = 0;
  contrast.value = 0;
  saturation.value = 0;
  ae.value = 0;
  effect.value = 0;
  mode.value = 0;
}

async function changeBrightness() {
  var selectedBrightness = brightness.options[brightness.selectedIndex].value;
  var params = "bright=" + selectedBrightness
  await ChangeSetting(params);
  await chageOtherSettings("bright");
}

async function changeContrast() {
  var selectedContrast = contrast.options[contrast.selectedIndex].value;
  var params = "contrast=" + selectedContrast;
  await ChangeSetting(params);
  await chageOtherSettings("contrast");
}

async function changeSaturation() {
  var selectedSaturation = contrast.options[saturation.selectedIndex].value;
  var params = "saturation=" + selectedSaturation;
  await ChangeSetting(params);
  await chageOtherSettings("saturation");
}

async function changeAe() {
  var selectedAe = ae.options[ae.selectedIndex].value;
  var params = "ae=" + selectedAe;
  await ChangeSetting(params);
  await chageOtherSettings("ae");
}

async function changeEffect() {
  var selectedEffect = effect.options[effect.selectedIndex].value;
  var params = "effect=" + selectedEffect;
  await ChangeSetting(params);
  await chageOtherSettings("effect");
}

async function changeMode() {
  var selectedMode = mode.options[mode.selectedIndex].value;
  var params = "mode=" + selectedMode;
  await ChangeSetting(params);
}

async function changeResolution() {
  var selectedRes = resolution.options[resolution.selectedIndex].value;
  var params = "resolution=" + selectedRes;
  await ChangeSetting(params);
  resetAllSetting();
}

captureButton.addEventListener("click", async function () {
  document.getElementById('capture').style.visibility = 'hidden';
  document.getElementById('stop').style.visibility = 'visible';
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
})

clearButton.addEventListener("click", function () {
  const element = document.getElementById("galleryImg");
  const hiddenCan = document.getElementById("savedImg");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  while (hiddenCan.firstChild) {
    hiddenCan.removeChild(hiddenCan.firstChild);
  }

  galleryDict.clear();
  updateImageNo();
  imageNo.style.visibility = "hidden";
  document.getElementById("galleryImg").style.visibility = "hidden";
})

stopButton.addEventListener("click", async function () {
  document.getElementById('capture').style.visibility = 'visible';
  document.getElementById('stop').style.visibility = 'hidden';
  //console.log("stop wasclicked ");
  state = 0;
})

async function ChangeSetting(params) {
  await stopStream();
  let previoushttpRequest = localStorage.getItem('ipAddress');
  fetch(previoushttpRequest + 'setting?' + params)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      //return response.json();
    })
    .then(data => {
      console.log(data);
      fetchStream();
    })
}

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
    zip.file(classLabel.value.toString() + count + ".jpg", data, { base64: true })
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
  imageNo.value = galleryDict.size;
}

function setResMap() {
  resMap.set("160120", 0);
  resMap.set("240240", 1);
  resMap.set("320240", 2)
  resMap.set("640480", 3);
  resMap.set("800600", 4);
  resMap.set("1024768", 5);
  resMap.set("12801024", 6);
  resMap.set("16001200", 7);
}

function displayPictureRes(picWidth, picHeight) {
  width = picWidth;
  height = picHeight;
  var mapKey = width.toString() + height.toString();
  resolution.selectedIndex = resMap.get(mapKey);
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

var classLabel = document.getElementById("classLabel")
var intervalLabel = document.getElementById("intervalLabel");
var instanceLabel = document.getElementById("instanceLabel");
var brightLabel = document.getElementById("brightLabel");
var contrastLabel = document.getElementById("contrastLabel");
var saturationLabel = document.getElementById("saturationLabel");
var aeLabel = document.getElementById("aeLabel");
var effectLabel = document.getElementById("effectLabel");
var modeLabel = document.getElementById("modeLabel");

const en =
{
  "class": "Class",
  "interval": "Interval",
  "instances": "Instances",
  "brightness": "Brightness",
  "contrast": "Contrast",
  "saturation": "Saturation",
  "ae_level": "AE level",
  "effects": "Effect",
  "mode": "Mode"
}


const th =
{
  "class": "หมวด",
  "interval": "เวลาระหว่างการบันทึกรูป",
  "instances": "จำนวนรูป",
  "brightness": "ความสว่าง",
  "contrast": "ความต่างระดับสี",
  "saturation": "ความอิ่มสี",
  "ae_level": "การเปิดรับแสง",
  "effects": "เอฟเฟคกล้อง",
  "mode": "โหมดกล้อง"
}

function changeLanguage() {

  classLabel.innerHTML = th.class;
  intervalLabel.innerHTML = th.interval;
  instanceLabel.innerHTML = th.instances;
  brightLabel.innerHTML = th.brightness;
  contrastLabel.innerHTML = th.contrast;
  saturationLabel.innerHTML = th.saturation;
  aeLabel.innerHTML = th.ae_level;
  effectLabel.innerHTML = th.effects;
  modeLabel.innerText = th.mode;
}
var englishSelect = document.getElementById("englishSelect");
var thaiSelect = document.getElementById("thaiSelect");

function getLanguage(){
  var getLang = localStorage.getItem("lang");
  if (getLang == "en"){
    englishSelect.click();
  }
  else if(getLang = "th"){
    thaiSelect.click();
  }
  else{
    englishSelect.click();
  }
}

englishSelect.addEventListener("click", function () {
  thaiSelect.style.color = "bisque";
  englishSelect.style.color = "blue";
  classLabel.innerHTML = en.class;
  intervalLabel.innerHTML = en.interval;
  instanceLabel.innerHTML = en.instances;
  brightLabel.innerHTML = en.brightness;
  contrastLabel.innerHTML = en.contrast;
  saturationLabel.innerHTML = en.saturation;
  aeLabel.innerHTML = en.ae_level;
  effectLabel.innerHTML = en.effects;
  modeLabel.innerText = en.mode;
  localStorage.setItem("lang", "en");
})

thaiSelect.addEventListener("click", function () {
  thaiSelect.style.color = "blue";
  englishSelect.style.color = "bisque";
  classLabel.innerHTML = th.class;
  intervalLabel.innerHTML = th.interval;
  instanceLabel.innerHTML = th.instances;
  brightLabel.innerHTML = th.brightness;
  contrastLabel.innerHTML = th.contrast;
  saturationLabel.innerHTML = th.saturation;
  aeLabel.innerHTML = th.ae_level;
  effectLabel.innerHTML = th.effects;
  modeLabel.innerText = th.mode;
  localStorage.setItem("lang", "th");
})

getLanguage();
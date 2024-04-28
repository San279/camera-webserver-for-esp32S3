var ipAdress = "http://192.168.1.30/";
var classLabel = document.getElementById("class");
var captureButton = document.getElementById("capture");
var clearButton = document.getElementById("clear");
var changeSetting = document.getElementById("changeSetting");
var brightness = document.getElementById("brightness");
var stopButton = document.getElementById("stop");
var downloadButton = document.getElementById("download");
var picture = document.getElementById("stream");

var resolution = document.getElementById("resolution");
resolution.addEventListener("change", changeResolution);

var resMap = new Map();
setResMap();
picture.setAttribute("src", ipAdress.toString());
var width = 0;
var height = 0;
var state = 0;
var galleryDict = new Map();
let index = 0;
picture.onload = function () {
  width = picture.clientWidth;
  height = picture.clientHeight;
  var mapKey = width.toString() + height.toString();
  resolution.selectedIndex = resMap.get(mapKey);
}

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

resetAllSetting();
document.getElementById("galleryImg").style.visibility = "hidden";
document.getElementById('stop').style.visibility = 'hidden';

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
  if (galleryDict.size == 0) {
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

function resetAllSetting(){
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
  document.getElementById("galleryImg").style.visibility = "hidden";
})

stopButton.addEventListener("click", async function () {
  document.getElementById('capture').style.visibility = 'visible';
  document.getElementById('stop').style.visibility = 'hidden';
  //console.log("stop wasclicked ");
  state = 0;
})

async function ChangeSetting(params) {
  picture.removeAttribute("src");
  fetch(ipAdress + 'setting?' + params)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      //return response.json();
    })
    .then(data => {
      console.log(data);
      picture.setAttribute("src", ipAdress.toString());
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
   zip.file(classLabel.value.toString() + count + ".jpg", data, {base64: true})
  }

  const zipFile = await zip.generateAsync({type: 'blob'});
  downloadLink.download = "images_of_" + classLabel.value + '.zip';

  const url = URL.createObjectURL(zipFile);
  downloadLink.href = url;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(url);
})

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





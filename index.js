
var ipAdress = "****";
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
brightness.value = 0;
brightness.addEventListener("change", changeBrightness);

var contrast = document.getElementById("contrast");
contrast.value = 0;
contrast.addEventListener("change", changeContrast);

var saturation = document.getElementById("saturation");
saturation.value = 0;
saturation.addEventListener("change", changeSaturation);

var ae = document.getElementById("ae");
ae.value = 0;
ae.addEventListener("change", changeAe);

var effect = document.getElementById("effect");
effect.value = 0;
effect.addEventListener("change", changeEffect);

var mode = document.getElementById("mode");
mode.value = 0;
mode.addEventListener("change", changeMode);

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

function checkSetting() {
  var params;
  console.log(brightness.value);
  if (brightness.value.trim() !== "") {
    console.log("not null");
  }
  if (brightness.value != 0) {
    params = "bright=" + brightness.value;
  }
  else if (contrast.value != 0) {
    params = "contrast=" + contrast.value;
  }
  else if (saturation.value != 0) {
    params = "saturation=" + saturation.value;
  }
  else if (ae.value != 0) {
    params = "ae=" + ae.value;
  }
  else if (effect.value != 0) {
    params = "effect=" + effect.value;
  }
  else if (mode.value != 0) {
    params = "mode=" + mode.value;
  }
  return params;
}

async function changeBrightness() {
  var selectedBrightness = brightness.options[brightness.selectedIndex].value;
  var params = "bright=" + selectedBrightness
  await ChangeSetting(params);
  //console.log(selectBrightness);
}

async function changeContrast() {
  var selectedContrast = contrast.options[contrast.selectedIndex].value;
  var params = "contrast=" + selectedContrast;
  await ChangeSetting(params);
}

async function changeSaturation() {
  var selectedSaturation = contrast.options[saturation.selectedIndex].value;
  var params = "saturation=" + selectedSaturation;
  await ChangeSetting(params);
}

async function changeAe() {
  var selectedAe = ae.options[ae.selectedIndex].value;
  var params = "ae=" + selectedAe;
  await ChangeSetting(params);
}

async function changeEffect() {
  var selectedEffect = effect.options[effect.selectedIndex].value;
  var params = "effect=" + selectedEffect;
  await ChangeSetting(params);
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

  if (galleryDict.size == 0) {
    alert("No image found!!");
    return;
  }
  var count = 0;
  for (const value of galleryDict.values()) {
    console.log(count);
    count++;
    var downloadLink = document.createElement("a");
    downloadLink.href = value;
    downloadLink.download = "image" + ".jpg"; // Specify the filename for download
    
    //img.src.substr(downloadLink);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    if (count > 9){
      await new Promise(resolve => setTimeout(resolve,200));
      count = 0;
    }
  }
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





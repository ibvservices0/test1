'use strict';

function tomaFoto(){
    let videoBis = document.querySelector("vid");
    //let mycanvasBis = document.querySelector("thecanvas");
    //mycanvasBis.getContext('2d').drawImage(videoBis, 0, 0, mycanvasBis.width, mycanvasBis.height);
    createImageBitmap(videoBis)
        .then(imageBitmap => {verEnCanvasBis(imageBitmap);})
        .catch(error => alert(error.message));
}


function verEnCanvas(img){
    let mycanvasBis = document.querySelector("thecanvas");
    mycanvasBis.width = img.width;
    mycanvasBis.height = img.height;
    mycanvasBis.getContext('2d').drawImage(img, 0, 0);
    mycanvasBis.classList.remove('hidden');
}


function verEnCanvasBis(img){
    let mycanvas = document.querySelector("thecanvas");
    //mycanvas.width = window.screen.width * window.devicePixelRatio;
    //mycanvas.height = window.screen.height * window.devicePixelRatio;
    mycanvas.width = window.screen.width;
    mycanvas.height = window.screen.height;
    //mycanvas.width = window.getComputedStyle(...).width.split('px')[0];
    //mycanvas.height = window.getComputedStyle(...).height.split('px')[0];
    let ratio  = Math.min(mycanvas.width / img.width, mycanvas.height / img.height);
    let x = (mycanvas.width - img.width * ratio) / 2;
    let y = (mycanvas.height - img.height * ratio) / 2;
    mycanvas.getContext('2d').clearRect(0, 0, mycanvas.width, mycanvas.height);
    mycanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
    mycanvas.classList.remove('hidden');
}


function gotDevices(deviceInfos) {
    let myDeviceId;
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        option.text = deviceInfo.label ;
        if (deviceInfo.kind === 'videoinput') {
            if ((option.text.includes('0,'))||
                (option.text === 'Cámara trasera')||
                (option.text === 'Back Camera')){
                    myDeviceId = option.value;
                    break;
            } else {console.log('Some other kind of source/device: ', deviceInfo);}
            
        } else {
            console.log('Some other kind of source/device: ', deviceInfo);
        }
    }
    return myDeviceId;
}


function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}


function handleErrorBis(error) {
    alert(error.message);
}


function start(myIdDevice) {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const videoSource = myIdDevice;
    /*
    const constraints = {
        audio: false,
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    */
   let constraints;
   if (videoSource){
        constraints = {
            audio: false,
            video: {deviceId: {exact: videoSource}}
        };
   }
   else{
        constraints = {
            audio: false,
            video: {facingMode: 'environment'}
        };
   }

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleErrorBis);
}



function gotStream(stream) {
    let video = document.querySelector("vid");
    window.stream = stream; // make stream available to console

    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });

    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.applyConstraints({torch: true})
        .then(() => console.log(videoTrack.getSettings().torch));

}


let but = document.getElementById("but");
//but.onclick = tomaFoto;
but.addEventListener("click", () => {tomaFoto();});
//but.onclick = function(e) {e.preventDefault(); tomaFoto();};

navigator.mediaDevices.enumerateDevices().then(gotDevices).then(start).catch(handleError);
//start();
//navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleErrorBis);

const video = document.getElementById("webcam");
const demosSection = document.getElementById("demos");
const liveView = document.getElementById("liveView");
const enableWebcamButton = document.getElementById("webcamButton");

// Chek if webcam access is supported
function getUserMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Enable webcam alert
if(getUserMediaSupported()){
    enableWebcamButton.addEventListener('click', enableCam);
} else {
    console.warn('getUserMedia() is not supported by your browser');
}

// place holder
function enableCam(event){

}
// Enable live
function enableCam(event){
    // Check model
    if(!model){
        return;
    }
    event.target.classList.add('removed');
    const constraints = {
        video: true
    };
    // activate streaming
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
    });
}

// placeholder
function predictWebcam() {

}

var model = true;
demosSection.classList.remove('invisible1');

var model = undefined;

// model cocossd 
cocoSsd.load().then(function (loadedModel)
{
    model = loadedModel;
    // show demo
    demosSection.classList.remove('invisible1');
});

var children = [];

function predictWebcam() {
    model.detect(video).then(function (predictions){
        // Remove any highlight from previous frame
        for (let i=0; i<children.length; i++){
            liveView.removeChild(children[i]);
        }
        children.splice(0);
        // loop in prediction
        for (let n=0; n<predictions.length; n++){
            // if detection is greater 66%, then we draw box
            if(predictions[n].score > 0.66){
                const p = document.createElement('p');
                p.innerText = predictions[n].class + ' - with '
                    + Math.round(parseFloat(predictions[n].score)*100)
                    + '% confidence.';
                p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px;'
                        + 'margin-top: ' + (predictions[n].bbox[1] - 10) + 'px;'
                        + 'width: ' + (predictions[n].bbox[2] - 10) + 'px;'
                        + 'top: 0; left:0;'
                const highlight = document.createElement('div');
                highlight.setAttribute('class', 'highlighter');
                highlight.style = 'left: ' + predictions[n].bbox[0] + 'px;'
                                + 'top: ' + predictions[n].bbox[1] + 'px;'
                                + 'width: ' + predictions[n].bbox[2] + 'px;'
                                + 'height: ' + predictions[n].bbox[3] + 'px;'

                liveView.appendChild(highlight);
                liveView.appendChild(p);
                children.push(highlight);
                children.push(p);
            }
        }
        window.requestAnimationFrame(predictWebcam);
    });
}

//Config Start
let minaudio = 0.55; // Go fast if audio is x or less
let threshold = 3; // Checks to verify
let fastplayback = 2;
let smoothingTimeConstant = 0.9;
let normalplayback = 1;
//Config END
chrome.runtime.onMessage.addListener( // Detect URL Changes
  function(request, sender, sendResponse) {
    if (request.message === 'update') { // Message from background script
        AutoSkip();
    }
    if (request.message === 'changes') { // Message from background script
            minaudio = request.minaudio;
            threshold = request.threshold;
            fastplayback = request.fastplayback;
            smoothingTimeConstant = request.smoothingTimeConstant;
            normalplayback = request.normalplayback;
    }
    if(request.message === 'settings'){
        sendResponse({
            minaudio: minaudio,
            threshold: threshold,
            fastplayback: fastplayback,
            smoothingTimeConstant: smoothingTimeConstant,
            normalplayback: normalplayback
        });
    }
});
// Main function
AutoSkip();
function RegisterAudio(){
    window.context = new AudioContext();
    video = context.createMediaElementSource(v);
    analyser = context.createAnalyser(); //we create an analyser
    analyser.smoothingTimeConstant = smoothingTimeConstant;
    analyser.fftSize = 512; //the total samples are half the fft size.
    video.connect(analyser);
    analyser.connect(context.destination);
}

function CheckAudio(){
    var array = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(array);
    var average = 0;
    var max = 0;
    for (i = 0; i < array.length; i++) {
      a = Math.abs(array[i] - 128);
      average += a;
      max = Math.max(max, a);
    }
    average /= array.length;
    return average;
}

function AutoSkip() {
    v = document.querySelector('video'); // Video player
    if(!v) return;
    RegisterAudio();
    v.ontimeupdate = function () { // If exists add event to run on the videos "ontimeupdate"
    ASCheck();
    };
}

counter = 1;
function ASCheck() { // Video skipping
        if (CheckAudio() <= minaudio) {
            if(counter == threshold){
                v.playbackRate = fastplayback;
                counter = normalplayback;
            }else{
                counter += 1;
            }         
        }else{          
            v.playbackRate = normalplayback;
            counter = 1;
        }
}

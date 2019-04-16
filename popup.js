//HTML Buttons
document.getElementById("applyall").onclick = SendChangesALL;
document.getElementById("applyactive").onclick = SendChangesCurrent;
//HTML Inputs
minaudio = document.getElementById("minaudio");
threshold = document.getElementById("threshold");
fastplayback = document.getElementById("fastplayback");
normalplayback = document.getElementById("normalplayback");
smoothingTimeConstant = document.getElementById("smoothingTimeConstant");
//Get Current Settings
GetChangesCurrent();
// Message template used to apply new changes
function applyChangesMSG(){
    return {
        message: "changes",
        minaudio: minaudio.value,
        threshold: threshold.value,
        fastplayback: fastplayback.value,
        smoothingTimeConstant: smoothingTimeConstant.value,
        normalplayback: normalplayback.value
    }
}
//Send Changes to all tabs
function SendChangesALL(){
    chrome.tabs.query({}, async function(tabs) {
        for (var i=0; i<tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, applyChangesMSG());
        }
    });
}
// Get tab settings
function GetChangesCurrent(){
    console.log("Getting changes");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {message: "settings"}, function(resp){
            minaudio.value = resp.minaudio;
            threshold.value = resp.threshold;
            fastplayback.value = resp.fastplayback;
            smoothingTimeConstant.value = resp.smoothingTimeConstant;
            normalplayback.value = resp.normalplayback;
        });
    });
}
//Send Changes to current tab
function SendChangesCurrent(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        console.log("Sending changes");
        chrome.tabs.sendMessage(tabs[0].id, applyChangesMSG());
    });
}

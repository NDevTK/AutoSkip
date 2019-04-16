chrome.tabs.onUpdated.addListener( // On tab update
  function(tabId, changeInfo, tab) {
    if (changeInfo.url) { // If URL changed message ContentScript the video id
      chrome.tabs.sendMessage( tabId, {
        message: 'update'
      })
    }
  }
);

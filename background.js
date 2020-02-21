

chrome.contextMenus.create({
  id: "extensionadd",
  title: "add to blacklist",
  contexts: ["browser_action"]
});

chrome.contextMenus.create({
  id: "extensionsee",
  title: "see blacklist",
  contexts: ["browser_action"]
});

function initialize_blacklist(){
  let blacklist=["www.youtube.com"];
  chrome.storage.sync.set({'blacklist':blacklist}, function(){
    console.log("blacklist initialized");
  });
}


chrome.runtime.onInstalled.addListener(function initialization(){
  initialize_blacklist();
  let time_setting={blocktime:0,timeon:false};
  chrome.storage.sync.set({'time_setting': time_setting});
});

chrome.contextMenus.onClicked.addListener(function(info,tab){
  console.log("clicked");
  switch(info.menuItemId) {
    case "extensionsee":
      chrome.tabs.create({url: '/blacklist.html'});
      console.log("blacklist created");
      break;
  }
});



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


chrome.browserAction.onClicked.addListener(function (){
  chrome.tabs.query({active: true, currentWindow: true}, function(mytab) {
    let url = mytab.map(x => x.url);
    var parser = document.createElement('a');
    parser.href = url[0];
    console.log("url added "+parser.hostname);
    add_url_to_table(parser.hostname);
    alert(parser.hostname+' added to blacklist');
  });
});

chrome.contextMenus.onClicked.addListener(function(info,tab){
  console.log("clicked");
  switch(info.menuItemId) {
    case "extensionsee":
      console.log("seeing");
      chrome.tabs.create({url: '/blacklist.html'});
      console.log("blacklist created");
      break;
    case "extensionadd":
      console.log("added url");
      chrome.tabs.query({active: true, currentWindow: true}, function(mytab) {
        let url = mytab.map(x => x.url);
        var parser = document.createElement('a');
        parser.href = url[0];
        console.log("url added "+parser.hostname);
        add_url_to_table(parser.hostname);
        alert(parser.hostname+' added to blacklist');
      });
      break;


  }
});



function add_url_to_table(url){
  console.log("url is " + url);
  chrome.storage.sync.get('blacklist', function (data){
      let myblacklist = document.getElementById('blacklist');
      data.blacklist.push(url);
      chrome.storage.sync.set({'blacklist': data.blacklist});
});
}

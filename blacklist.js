

document.addEventListener('DOMContentLoaded',function (){
  drawtable(false,delete_listener);
  add_listener();
  time_listener();
});


function drawtable(last,callback){
  chrome.storage.sync.get('blacklist',function(data){
    let blacklist = data.blacklist;
    let row = document.getElementById('blacklist');
    let row_num = blacklist.length;
    var counter = 1;
    if(last==false){
    blacklist.forEach(function(item){
        if(item=="")return;
        let tr = row.insertRow();
        tr.id = counter.toString()+"tr";
        let td1 = tr.insertCell();
        let td2 = tr.insertCell();
        var btn = document.createElement('button');
        btn.className = "delete";
        btn.id = counter.toString();
        btn.innerHTML = '<i class="fa fa-minus"></i>';
        td1.innerHTML = item;
        td2.appendChild(btn);
        counter++;
        console.log("again");
      });
    }

      if(last==true){
        var enter = prompt("Please enter the website you want to block:");
        var url;
        if (enter == null || enter == "") {
            url = "";
        } else {
            url = enter;
            add_url_to_table(url);
        }
      }
      if (callback === undefined){
			    callback = function(){};
		  }
		  callback();
  });
}


function add_url_to_table(url){
  console.log("url is " + url);
  chrome.storage.sync.get('blacklist', function (data){
    try{
      let myblacklist = document.getElementById('blacklist');
      if(!myblacklist.includes(url)){
        data.blacklist.push(url);
      chrome.storage.sync.set({'blacklist': data.blacklist}, function (){

        let tr = myblacklist.insertRow();
        let cur_row = data.blacklist.length;
        tr.id = cur_row.toString()+"tr";
        let td = tr.insertCell();
        td.id = cur_row.toString()+"td";
        td.innerHTML = url;

        let td2 = tr.insertCell();
        var btn = document.createElement('button');
        btn.className = "delete";
        btn.id=cur_row.toString();
        btn.innerHTML = '<i class="fa fa-minus"></i>';
        td2.appendChild(btn);
        delete_listener();
    });
  }
    }catch(err){
      console.log("url doesn't exist err "+"row is " +row_num);
    }
});
}


function delete_listener(){
  let delete_buttons = document.getElementsByClassName("delete");
  console.log("in delete_listener, len is "+delete_buttons.length);
  for(i = 0;i<delete_buttons.length;++i){
    console.log("btn id is " + delete_buttons[i].id[0]);
    delete_buttons[i].addEventListener("click", function() {
      let id = this.id[0];
      chrome.storage.sync.get('blacklist', function (data){
        let blacklist = data.blacklist;
        blacklist.splice(id-1,1);
        let row_id = id+"tr";
        var row = document.getElementById(row_id);
        try{
          row.parentNode.removeChild(row);
        }catch{
          console.log("parent doens't exist");
        }
        chrome.storage.sync.set({'blacklist': blacklist}, function (){
					console.log(id + " has been removed from filter list");

        });
      });
    });
  }

}


function add_listener(){
  let add = document.getElementById('add');
  if(add){
    add.addEventListener('click',function(){
      console.log("drawtable true");
      drawtable(true,delete_listener);
    });
  }
}


function time_listener(){
  let start_btn = document.getElementById('start');
  let text = document.getElementById('set_time');
  chrome.storage.sync.get('time_setting', function (data) {
    if(data.time_setting.timeon){
      start_btn.disabled = true;
      text.disabled = true;
    } else {
      console.log("text in focus")
      text.focus();
      text.select();
    }
  });
  text.addEventListener("keyup",function(event){
    event.preventDefault();
    if(event.keyCode==13){
      turn_timer_on();
    }

  });
  start_btn.addEventListener('click',turn_timer_on);
  write_timer();
}



function turn_timer_on(){
  var today = new Date().getTime();
  let time_setting = {}
  chrome.storage.sync.get('time_setting', function (data) {
      var current_milli = Date.now();
      var value_milli = document.getElementById('set_time').value*60000;
      var block_time = current_milli+value_milli;
      time_setting={blocktime:block_time,timeon:true};
      chrome.storage.sync.set({'time_setting': time_setting}, function(){
        write_timer();
      });
  });
}

var update;

function write_timer(){
  chrome.storage.sync.get('time_setting', function (data) {
    console.log("in writer");
    console.log(data.time_setting.timeon);
    if(data.time_setting.timeon==true){
      //close_tab();
      let start_btn = document.getElementById('start');
      let text = document.getElementById('set_time');
      start_btn.disabled = true;
      text.disabled = true;
    }
    update = setInterval(update_time,1000);
  });
}


var interval;


function update_time(){
  chrome.storage.sync.get('time_setting', function (data) {
    let cur_time = new Date().getTime();
    let time_left = data.time_setting.blocktime-cur_time;
    if(time_left>0){
      close_tab();
      let hours = Math.floor((time_left / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((time_left / (1000 * 60)) % 60);
      let seconds = Math.floor((time_left / 1000) % 60);
      let alarm = document.createElement('button');
      alarm.className = "pass";
      alarm.innerHTML = '<i class="fas fa-clock"></i>';
      document.getElementById("num_display").innerHTML =  hours + " h " + minutes
      + " m " + seconds + " s ";
      document.getElementById("num_display").appendChild(alarm);

    } else {
      console.log("time_left<0");
      clearInterval(update);
      clearInterval(interval);
      let btn = document.createElement('button');
      btn.className = "pass";
      btn.innerHTML = '<i class="fa fa-check-circle"></i>';
      document.getElementById("num_display").innerHTML = " time's up, all sites unblocked";
      document.getElementById("num_display").appendChild(btn);
      let start_btn = document.getElementById('start');
      let text = document.getElementById('set_time');
      start_btn.disabled = false;
      text.disabled = false;
      let time_setting={blocktime:0,timeon:false};
      chrome.storage.sync.set({'time_setting': time_setting});
    }
  });
}



function close_tab(){
	chrome.storage.sync.get('blacklist', function (data) {
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				data.blacklist.forEach(function (site) {
					if (tab.url.includes(site)) {
            console.log("tab is " + tab.url);
            chrome.tabs.executeScript(tab.id, {
				        code: 'interval = setInterval(function(){alert("stay focused!")},2000)'
              });
					}
				});
			});
		});
	});
}

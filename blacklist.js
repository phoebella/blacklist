document.addEventListener('DOMContentLoaded',function (){
  drawtable(false,delete_listener);
  add_listener();
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
  chrome.storage.sync.get('blacklist', function (data){
    try{
      let myblacklist = document.getElementById('blacklist');
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
        //drawtable(true,delete_listener);

    });
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
        //let myblacklist = document.getElementById('blacklist');
        //myblacklist.deleteRow(id);
        chrome.storage.sync.set({'blacklist': blacklist}, function (){
					console.log(id + " has been removed from filter list");

        });
      });
    });
  }

}





function add_listener(){
  let add = document.getElementById('add');
  add.addEventListener('click',function(){
    console.log("drawtable true");
    drawtable(true,delete_listener);
  });
}

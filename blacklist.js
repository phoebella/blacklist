document.addEventListener('DOMContentLoaded',function (){
  drawtable(false);
  add_listener();
});


function drawtable(last){
  chrome.storage.sync.get('blacklist',function(data){
    let blacklist = data.blacklist;
    let row = document.getElementById('blacklist');
    let row_num = blacklist.length;
    var counter = 1;
    if(last==false){
    blacklist.forEach(function(item){
        if(item=="")return;
        let tr = row.insertRow();
        tr.id = counter.toString();
        counter++;
        let td = tr.insertCell();
        td.innerHTML = item;
        console.log("again");
      });
    }

      if(last==true){
        let tr = row.insertRow();
        let cur_row = row_num+1;
        tr.id = cur_row.toString();
        let td = tr.insertCell();
        td.id = cur_row.toString()+"td";
        td.innerHTML = "<input id =\"" + cur_row +   "input\">" + "</input>";
        console.log("true "+ cur_row + "input");
        set_cur_listener(cur_row);

      }
  });
}

function set_cur_listener(row_num){
  document.getElementById(row_num+"input").addEventListener("keypress", function(event){
		if(event.keyCode == 13){
			console.log("enter keypressed "+row_num);
      /*let table = document.getElementById('blacklist');
      let tr = table.insertRow();
      tr.id = row_num.toString();
      let td = tr.insertCell();*/
      let td = document.getElementById(row_num+"td");
      td.innerHTML = this.value;
      //table.deleteRow(row_num-1);

      chrome.storage.sync.get('blacklist', function (data){
        try{
          let url = document.getElementById(row_num+"input").value;
          data.blacklist.push(url);
  			  chrome.storage.sync.set({'blacklist': data.blacklist}, function (){
          console.log("url pushed "+url+ " row is " + row_num);
  			});
        }catch(err){

          console.log("url doesn't exist err "+"row is " +row_num);
        }
		});
		}
	});
}




function add_listener(){
  let add = document.getElementById('add');
  add.addEventListener('click',function(){
    console.log("drawtable true");
    drawtable(true);
  });
}

var domainUrl="http://54.89.107.103"
var webUrl = domainUrl+"/RBS/api";
var imageUrl=domainUrl+"/upload/";
//var webUrl = "http://localhost:11175/api";

var apiTimeout=20000;

function requetLogin(userName, pwd){
    var requestUrl=webUrl+"/RBS/getlogin";
    var jsonObj = {UserName :userName,Password :pwd, TokenID: "123"};
    
    $.ajax({
      url: requestUrl,
      type: "POST",
      ContentType: "application/json",
      async: true, 
      dataType : "JSON",
      data:jsonObj,
      timeout: apiTimeout,    
      success: function(data, status, xhr) {
        debugger;    

        storeSessionKey(data.SessionKey, data.UserID, '');
        window.location="menu.html";
        loading.endLoading();
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        
        alert("Failed to call server "+JSON.stringify(xhr));
        loading.endLoading();
      }
    })
}

function storeSessionKey(sessionKey, id, registrationid){
    var profile = {
    values1 : [sessionKey, id, registrationid]
    };
    
    insertSessionKey(profile);
    
    function insertSessionKey(profile) {
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM sessionKey');
            tx.executeSql(
                'INSERT INTO sessionKey (token, id, registrationid) VALUES (?, ?, ?)', 
                profile.values1,
                successStoreSessionKey,
                erroStoreSessionKey
            );
        });
    }
}




function getRoomList(sessionkey){
    var requestUrl=webUrl+"/RBS/GetRooms";
    var jsonObj = {SessionKey :sessionkey};
    
    $.ajax({
      url: requestUrl,
      type: "POST",
      ContentType: "application/json",
      async: true, 
      dataType : "JSON",
      data:jsonObj,
      timeout: apiTimeout,    
      success: function(data, status, xhr) {
        debugger;    

        storeRoomList(data);
        
        
        dbmanager.getRoomListFromDB(function(returnData){
            
            if(returnData.rows.length>0)
            {
                $.each(returnData.rows, function(key, value){
                    var roomname='"'+value.name+'"';
                    $("#scrollul").append("<li class='scrollli' id='featuredrow1' onclick='goCalendar("+value.id+", "+roomname+");'><table style='height:100%; width:100%;'><tr><td style='width:20%' ><img class='listviewimg' src='"+imageUrl+value.photoUrl+"'></td><td><h1 class='listviewitemtitle'>"+value.name+"</h1><p class='listviewitemseperator'>&nbsp;</p><p class='listviewitemdetails'></p></td></tr></table></li>");
                });       
            }
            else
            {
                alert("no data");
            }
        });
    
        loading.endLoading();
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        
        alert("Failed to call server "+JSON.stringify(xhr));
        loading.endLoading();
      }
    })
}

function storeRoomList(data){
   
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM roomList');    
    });
    
    $.each(data, function(key, value){
        var dataObj = {
        values1 : [value.ID, value.Name, value.PhotoFileName]
        };

        insertRoomList(dataObj);

        function insertRoomList(dataObj) {
            db.transaction(function(tx) {
                tx.executeSql(
                    'INSERT INTO roomList (id, name, photoUrl) VALUES (?,?,?)', 
                    dataObj.values1,
                    successStoreSessionKey,
                    erroStoreSessionKey
                );
            });
        }
    });
}

function getEventList(sessionkey, userid){
    var requestUrl=webUrl+"/RBS/GetMeetingsByUserId";
    var jsonObj = {SessionKey :sessionkey, UserID: userid};
    alert("1");
    $.ajax({
      url: requestUrl,
      type: "POST",
      ContentType: "application/json",
      async: true, 
      dataType : "JSON",
      data:jsonObj,
      timeout: apiTimeout,    
      success: function(data, status, xhr) {
        debugger;  
        alert("2");
        //alert(JSON.stringify(data)); 
        if(data.length>0)
        {
        try{$.each(data, function(key, value){
                var newdate=value.BookingDate.split("T");
                var newsTime=value.StartingTime.substr(0,2)+":"+value.StartingTime.substr(2,2);
                var neweTime=value.EndingTime.substr(0,2)+":"+value.EndingTime.substr(2,2);

                $("#scrollul").append("<li class='scrollli' id='featuredrow1'><table style='height:100%; width:100%;'><tr><td><h1 class='listviewitemtitle'>"+value.Title+"</h1><p class='listviewitemseperator'>&nbsp;</p><p class='listviewitemdetails'>DateTime:"+newdate[0]+" "+newsTime+" - "+neweTime+"</p></td></tr></table> </li>");
            });   }catch(ex){alert(ex.message)}
              
        }
        else
        {
            alert("no data");
        }
        alert("1");
        loading.endLoading();
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        
        alert("Failed to call server "+JSON.stringify(xhr));
        loading.endLoading();
      }
    })
}


function bookRoom(sessionkey, title, purpose, date, stime, etime, roomid){
    var requestUrl=webUrl+"/RBS/Booking";
    
    var newdate=date.split("/");//date.substring(7,4);//+"-"+date.substring(0,2)+"-"+date.substring(3,2);
    var newstime=stime.split(":")//stime.substring(0,2);//+stime.substring(3,2);
    var newetime=etime.split(":")//etime.substring(0,2);//+etime.substring(3,2);
    date=newdate[2]+"-"+newdate[0]+"-"+newdate[1];
    stime=newstime[0]+newstime[1];
    etime=newetime[0]+newetime[1];
    
    var jsonObj = {SessionKey :sessionkey, Title: title, Purpose: purpose, BookingDate:date, StartingTime:stime, EndingTime:etime, RoomID:roomid};

    $.ajax({
      url: requestUrl,
      type: "POST",
      ContentType: "application/json",
      async: true, 
      dataType : "JSON",
      data:jsonObj,
      timeout: apiTimeout,    
      success: function(data, status, xhr) {
        debugger;    

        alert("Room Booked Successfully.");
        
        loading.endLoading();
        window.location="attlist.html?id="+data[0].ID;
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        
        alert("Failed to call server "+JSON.stringify(xhr));
        loading.endLoading();
      }
    })
}


function bookingHistory(sessionkey, date,roomid){
    var requestUrl=webUrl+"/RBS/GetTimeSlotByRoomId";
    
    var newdate=date.split("/");//date.substring(7,4);//+"-"+date.substring(0,2)+"-"+date.substring(3,2);
    date=newdate[2]+"-"+newdate[0]+"-"+newdate[1];
    
    var jsonObj = {SessionKey :sessionkey, Date:date, RoomID:roomid};
    
    $.ajax({
      url: requestUrl,
      type: "POST",
      ContentType: "application/json",
      async: true, 
      dataType : "JSON",
      data:jsonObj,
      timeout: apiTimeout,    
      success: function(data, status, xhr) {
        debugger;    

        
        storeHistoryList(data);
        
        
        dbmanager.getHistoryListFromDB(function(returnData){
        
            if(returnData.rows.length>0)
            {
                $.each(returnData.rows, function(key, value){
                    var newdate=value.BookingDate.split("T");
                    var newsTime=value.StartingTime.substr(0,2)+":"+value.StartingTime.substr(2,2);
                    var neweTime=value.EndingTime.substr(0,2)+":"+value.EndingTime.substr(2,2);

                    $("#scrollul").append("<li class='scrollli' id='featuredrow1'><table style='height:100%; width:100%;'><tr><td><h1 class='listviewitemtitle'>"+value.Title+"</h1><p class='listviewitemseperator'>&nbsp;</p><p class='listviewitemdetails'>DateTime: "+newdate[0]+" "+newsTime+" - "+neweTime+"</p></td></tr></table> </li>");
                });       
            }
            else
            {
                alert("no data");
            }
        });
    
    
        loading.endLoading();
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        
        alert("Failed to call server "+JSON.stringify(xhr));
        loading.endLoading();
      }
    })
}

function storeHistoryList(data){
   
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM historyList');    
    });
    
    $.each(data, function(key, value){
        
        var dataObj = {
        values1 : [value.ID, value.RoomID, value.Title, value.Purpose, value.BookingDate, value.StartingTime, value.EndingTime]
        };

        insertHistoryListList(dataObj);

        function insertHistoryListList(dataObj) {
            db.transaction(function(tx) {
                tx.executeSql(
                    'INSERT INTO historyList (ID, RoomID, Title, Purpose, BookingDate, StartingTime, EndingTime) VALUES (?,?,?,?,?,?,?)', 
                    dataObj.values1,
                    successStoreSessionKey,
                    erroStoreSessionKey
                );
            });
        }
    });
}

function getUserList(sessionkey){
    var requestUrl=webUrl+"/RBS/GetUsers";
    var jsonObj = {SessionKey :sessionkey};
    
    $.ajax({
      url: requestUrl,
      type: "POST",
      ContentType: "application/json",
      async: true, 
      dataType : "JSON",
      data:jsonObj,
      timeout: apiTimeout,    
      success: function(data, status, xhr) {
        debugger;    
        
        if(data.length>0)
        {
            $.each(data, function(key, value){
                $("#scrollul").append("<li class='scrollli' id='featuredrow1'><table style='height:100%; width:100%;'><tr><td><h1 class='listviewitemtitle'>"+value.Username+"</h1><p class='listviewitemseperator'>&nbsp;</p><p class='listviewitemdetails'></p><td><input type='checkbox' id='userlist' class='userlist' value='"+value.ID+"' style='float:right'></td></tr></table></li>");
            });       
        }
        else
        {                
            alert("no data");
        }

    
        loading.endLoading();
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        
        alert("Failed to call server "+JSON.stringify(xhr));
        loading.endLoading();
      }
    })
}


function addAttList(sessionkey, meetingid, ID){
    var requestUrl=webUrl+"/RBS/AddAttendee";
    var jsonObj = {SessionKey :sessionkey, MeetingID:meetingid, Users:ID};

    $.ajax({
      url: requestUrl,
      type: "POST",
      ContentType: "application/json",
      async: true, 
      dataType : "JSON",
      data:jsonObj,
      timeout: apiTimeout,    
      success: function(data, status, xhr) {
        debugger;    
        
        loading.endLoading();
        window.location="menu.html";
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        
        alert("Failed to call server "+JSON.stringify(xhr));
        loading.endLoading();
      }
    })
}


function successStoreSessionKey(){
   // alert("success store key");
}

function erroStoreSessionKey(err){
  //  alert("failed");
}
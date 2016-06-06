var webUrl = "http://54.89.107.103/RBS/api";
//var webUrl = "http://localhost:11175/api";

var apiTimeout=20000;

function requetLogin(userName, pwd){
    var requestUrl=webUrl+"/RBS/getlogin";
    var jsonObj = {UserName :userName,Password :pwd};
    
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
        
        alert(JSON.stringify(data));
        loading.endLoading();
      },
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        
        alert("Failed to call server "+JSON.stringify(xhr));
        loading.endLoading();
      }
    })
}

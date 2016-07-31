//-------------------------------------------
//-------------------------------------------
//-------------------------------------------
//Common method in every form for mobile apps
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    initPushNotificationRegister: function(){
        var pushNotification = window.plugins.pushNotification;
        
        
        if ( device.platform == 'android' || device.platform == 'Android'){
            pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"804997115089","ecb":"app.onNotificationGCM"});
        } 
        else {
            pushNotification.register(app.tokenHandler,app.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
        }

    },
    
    // result contains any message sent from the plugin call
    successHandler: function(result) {
//        alert('Callback Success! Result = '+result);
    },
    
    errorHandler:function(error) {
//        alert(error);
    },
    
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                var regid=e.regid;
                storeRegID(regid);
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
//              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
//              alert('GCM error = '+e.msg);
            break;
 
            default:
//              alert('An unknown GCM event has occurred');
              break;
        }
    },
    
    tokenHandler: function(result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
//        alert('device token = ' + result);
//        $("#redidtxtareas").val(result);
        var regid=e.regid;
        storeRegID(regid);
    },
    
    onNotificationAPN: function(event) {
        if ( event.alert )
        {
            navigator.notification.alert(event.alert);
        }

        if ( event.sound )
        {
            var snd = new Media(event.sound);
            snd.play();
        }

        if ( event.badge )
        {
            pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
        }
    }
};

//-------------------------------------------
//-------------------------------------------
//-------------------------------------------

function storeRegID(regid){
   
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM RegID');    
    });
    
    var dataObj = {
    values1 : [regid]
    };

    insertRegID(dataObj);

    function insertRegID(dataObj) {
        db.transaction(function(tx) {
            tx.executeSql(
                'INSERT INTO RegID (ID) VALUES (?)', 
                dataObj.values1,
                successStoreSessionKey,
                erroStoreSessionKey
            );
        });
    }
}


//-------------------------------------------
//-------------------------------------------
//-------------------------------------------
//button action in index page
function btnLogin_onClick(){
    loading.startLoading();
    
     dbmanager.getHistoryListFromDB(function(returnData){
        
            if(returnData.rows.length>0)
            {
                $.each(returnData.rows, function(key, value){
                    var userName=$("#txtLoginId").val();
                    var pwd=$("#txtPassword").val();

                    requetLogin(userName, pwd, value.ID);
                });       
            }
            else
            {
                var userName=$("#txtLoginId").val();
                var pwd=$("#txtPassword").val();

                requetLogin(userName, pwd, "");
            }
        });
    
    
}
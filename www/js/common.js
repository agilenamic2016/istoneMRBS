var filtermenustatus=0;
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//page loading

var loading = {
    
    //add loading page when calll
    startLoading:function(){
        $(".app").prepend("<div class='loadingPage'><div class='loadingFrame'><img class='loadingIcon' src='img/loader.gif'></img></div></div>");
    },
    
    //remove loading page when call
    endLoading:function(){
        $(".loadingPage").remove();
    }
};


//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//dbmanager
var db;

var dbmanager = {
    initdb:function(){
        db = window.openDatabase("Database", "1.0", "ESLN", 200000);
    },
    
    createTable:function(){
        db.transaction(createTableTransaction, this.errorExecuteSQL, this.successExecuteSQL);
        
        function createTableTransaction(t){
            t.executeSql('CREATE TABLE IF NOT EXISTS userprofile (uid text, companyid text,name text, email text, profileImg text, role text, token text)');
            t.executeSql('CREATE TABLE IF NOT EXISTS DMZKEYSLOT (DMZKEY text)');
        }
    },
    
    getProfile:function(returnData){
        db.transaction(function(tx){
            tx.executeSql('SELECT * FROM userprofile', [], function(tx, rs){
                returnData(rs);
          }, this.errorExecuteSQL);
        });
    },
    
    successExecuteSQL:function(){
        //success to executeSQL
        //alert("success");
    },
    
    errorExecuteSQL:function(err){
        //fail executeSQL
        alert(err.message);
    },
};

//special dedicated to get dmz key
function getDMZKeyFromDB(){
    var defer=$.Deferred();

    db.transaction(function(tx){
            tx.executeSql('SELECT * FROM DMZKEYSLOT', [], function(tx, rs){
                defer.resolve(rs.rows);
          }, errorGetDMZKeyFromDB);
    });
    
    return defer.promise();
}

function errorGetDMZKeyFromDB(err){
    alert("fail get dmzkey from db");
}

//-----------------------------------------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------
//inbox page navigate
function goInbox(){
    window.location = "inboxPage.html";
}

function initInboxButton(){
    dbmanager.getProfile(function(returnData){
        if(returnData.rows.length>0)
            $(".inboxBtn").show();
    });
}


//-----------------------------------------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------
//inbox check new message

var inboxMessage={
    
    checkNewMessageNumber:function(){
        dbmanager.getProfile(function(returnData){
        if(returnData.rows.length>0)
            var token=returnData.rows.item(0).token;
            var uid=returnData.rows.item(0).uid;
            postNewInboxMessageCount(token, uid, "1");
        });
    },
}



//-----------------------------------------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------
//encode textarea input into html
function encode4HTML(str) {
    return str
        .replace(/\r\n?/g,'\n')
        // normalize newlines - I'm not sure how these
        // are parsed in PC's. In Mac's they're \n's
        .replace(/(^((?!\n)\s)+|((?!\n)\s)+$)/gm,'')
        // trim each line
        .replace(/(?!\n)\s+/g,' ')
        // reduce multiple spaces to 2 (like in "a    b")
        .replace(/^\n+|\n+$/g,'')
        // trim the whole string
        .replace(/[<>&"']/g,function(a) {
        // replace these signs with encoded versions
            switch (a) {
                case '<'    : return '&lt;';
                case '>'    : return '&gt;';
                case '&'    : return '&amp;';
                case '"'    : return '&quot;';
                case '\''   : return '&apos;';
            }
        })
        //.replace(/\n{2,}/g,'</p><br><p>')
        // replace 2 or more consecutive empty lines with these
        .replace(/\n/g,'<br />')
        // replace single newline symbols with the <br /> entity
        .replace(/^(.+?)$/,'<p>$1</p>');
        // wrap all the string into <p> tags
        // if there's at least 1 non-empty character
}


//-----------------------------------------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------
//thousand separator
function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//-----------------------------------------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------
//open link in new browser
function cordovaOpenLink(url){
    cordova.InAppBrowser.open(url, '_system');
}

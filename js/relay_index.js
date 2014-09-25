//$(document).ready(function ()
//    {      
//        action_Realy = Relay.createNew();        
//        action_Relay.GetRelayList();
//    }
//)
var action_Relay = {};
var relayList;
var relayClass = function(id,source,port,channelname){
    this.id = id;
    this.source=source;
    this.port=port;
    this.channelname=channelname;
}
function MyError(message) {  
    this.message = message || "Default Message";
    alert(this.message);
    $(document).ajaxStop($.unblockUI);
}
MyError.prototype = new Error();
MyError.prototype.constructor = MyError;
function init()
{
    $('#btn_refresh').click(function () {
        action_Relay.getRelayList();
    });
    $('#btn_create').click(function(){
        createAction();
    });    
}

function createAction()
{
    var flag = true;
    var source = $('#Source').val();
    var port = $('#Port').val();
    var name = $('#ChannelName').val();
    if(source.length  == 0)    
    {
        alert("Error : Please input Source" );
        return;
    }
    if(port.length  == 0)    
    {
        alert("Error : Please input Port" );
        return;
    };
    $.each( relayList, function( index, element ){ 
        if(port == element['port'])
        {
            flag = false;            
            alert("Error : DUPLICATE PORT NUMBER !" );
            return false;
        }
    });
    if(!flag)
        return;
    action_Relay.createRelay(source,port,name);
}

var CreateHtml = {
    createNew : function(input_relayobj){        
        var delete_class = '.delete';     
        var resume_class = '.resume'; 
        var relayobj_forhtml = input_relayobj;
        var table_relay = $('#table_relay');
        var createobj = {};
        createobj.clearTable = function(){
            table_relay.find("tr:gt(0)").remove();
        }
        createobj.appendTable = function(relay_list){
             var tmp_relay_item;
             var dest_temp;
             var port;
             var channelname;
             relayList = [];
             $.each( relay_list, function( index, element ) 
             {                   
                dest_temp = element['dest'].split(':');
                port = '';
                channelname = '';
                if (typeof dest_temp[2] != 'undefined')
                {
                    dest_temp = dest_temp[2].split('/');                    
                    port = dest_temp[0];
                    channelname = dest_temp[1]                                        
                }               
                tmp_relay_item = new relayClass(element['id'],element['source'],port,channelname);
                relayList[index]=tmp_relay_item;                
                var append_str = ''                 
                append_str += '<tr>';
                append_str += '<td>' +  element['source'] + '</td>';
                append_str += '<td>' +  element['dest'] + '</td>';                
                append_str += '<td>';
                append_str += '<a href="#" class="btn-light delete" id="' +  index + '">Delete</a>'
                if(port != '')
                    append_str += '<a href="#" style="margin-left:10px" class="btn-light resume" id="' +  index + '">Resume</a>'
                append_str += '</td>';
                append_str += '</tr>';                
                table_relay.append(append_str);                
             })            
        }       
        createobj.rebindDeleteEvert = function(){
            $(delete_class).click(function () {
                var thisitem = $(this);
//                alert(relayList[thisitem.attr('id')]['id']);
                relayobj_forhtml.deleteRelay(relayList[thisitem.attr('id')]['id']);
            });
        };
         createobj.rebindResumeEvert = function(){
            $(resume_class).click(function () {
                var thisitem = $(this);
//                alert(relayList[thisitem.attr('id')]['id']);
                var index = thisitem.attr('id');
                relayobj_forhtml.resumeRelay(relayList[index]['id'],relayList[index]['source'],relayList[index]['port'],relayList[index]['channelname']);
            });
        };
        createobj.blockPage = function(){
            $.blockUI();
        }
        createobj.stopPage = function(){
            $(document).ajaxStop($.unblockUI);
        }
        return createobj;
    }
}

var Relay = {
    createNew: function(){           
        var relayobj = {};      
        var htmlobj = CreateHtml.createNew(relayobj);
        relayobj.getRelayList = function(){ 
            var request = relayobj.CallAjax("relay/list","GET", '', "json");
            htmlobj.blockPage();
            request.done(function (msg, statustext, jqxhr)
            {                       
                htmlobj.stopPage();
                htmlobj.clearTable();
                htmlobj.appendTable(msg);
                htmlobj.rebindDeleteEvert();
                htmlobj.rebindResumeEvert();
            });
            request.fail(function (jqxhr, textStatus)
            {            
                htmlobj.stopPage();
                throw new MyError("Error : Ajax List Error" );
            });
        };
        relayobj.createRelay = function(source,port,channelname){ 
            
            var jsonrequest = '{"Source":"' + source + '","Port":' + port + ',"ChannelName":"' + channelname +  '"}';
            var request = relayobj.CallAjax("relay/create","POST", jsonrequest, "json");
            htmlobj.blockPage();
            request.done(function (msg, statustext, jqxhr)
            {           
                htmlobj.stopPage();
                alert('Success');
                relayobj.getRelayList();
            });
            request.fail(function (jqxhr, textStatus)
            {            
                htmlobj.stopPage();
                alert("Error : Ajax Create Error" );
            });
        };        
        relayobj.deleteRelay = function(deleteID){             
            var request = relayobj.CallAjax("relay/delete/" + deleteID,"DELETE", "", "json");            
            request.done(function (msg, statustext, jqxhr)
            {                            
                setTimeout(relayobj.getRelayList(),2000);                
            });
            request.fail(function (jqxhr, textStatus)
            {                            
                alert("Error : Ajax Delete Error" );
            });
        };     
        relayobj.resumeRelay = function(id,source,port,channelname){
            try{
//                alert(id);
                var jsonrequest = '{"Source":"' + source + '","Port":' + port + ',"ChannelName":"' + channelname +  '","ID":"' + id +'"}';
                var request = relayobj.CallAjax("relay/resume","POST", jsonrequest, "json");
                htmlobj.blockPage();
                request.done(function (msg, statustext, jqxhr)
                {           
                    htmlobj.stopPage();                
                    setTimeout(relayobj.getRelayList(),2000); 
                });
                request.fail(function (jqxhr, textStatus)
                {                            
                    alert("Error : Ajax Resume Error" );
                });
                }
            catch(exception)
            {
                
            }
        }
        relayobj.CallAjax = function(url,method, data, datatype){             
            var request = $.ajax({
                type: method,
                url: url,
                data: data,
                dataType: datatype
            });
            return request;
        };
        return relayobj;
    }
};

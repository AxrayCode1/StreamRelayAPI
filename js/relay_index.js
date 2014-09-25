//$(document).ready(function ()
//    {      
//        action_Realy = Relay.createNew();        
//        action_Relay.GetRelayList();
//    }
//)
var action_Relay = {};
function MyError(message) {  
  this.message = message || "Default Message";
  alert(this.message);
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
    var source = $('#Source').val();
    var port = $('#Port').val();
    var name = $('#ChannelName').val();
    if(source.length  == 0)    
    {
        throw new MyError("Error : Please input Source" );
        return;
    }
    if(port.length  == 0)    
    {
        throw new MyError("Error : Please input Port" );
        return;
    };
    action_Relay.createRelay(source,port,name);
}

var CreateHtml = {
    createNew : function(input_relayobj){
        var delete_class = '.delete';     
        var relayobj_forhtml = input_relayobj;
        var table_relay = $('#table_relay');
        var createobj = {};
        createobj.clearTable = function(){
            table_relay.find("tr:gt(0)").remove();
        }
        createobj.appendTable = function(relay_list){
             $.each( relay_list, function( index, element ) 
             {  
                var append_str = ''
                append_str += '<tr>';
                append_str += '<td>' +  element['source'] + '</td>';
                append_str += '<td>' +  element['dest'] + '</td>';                
                append_str += '<td><a href="#" class="btn-light delete" id="' +  element['id'] + '">Delete</a></td>';
                append_str += '</tr>';                
                table_relay.append(append_str);                
             })            
        }       
        createobj.rebindDeleteEvert = function(){
            $(delete_class).click(function () {
                var thisitem = $(this);
                relayobj_forhtml.deleteRelay(thisitem.attr('id'));
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
                throw new MyError("Error : Ajax Create Error" );
            });
        };        
        relayobj.deleteRelay = function(deleteID){             
            var request = relayobj.CallAjax("relay/delete/" + deleteID,"DELETE", "", "json");            
            request.done(function (msg, statustext, jqxhr)
            {                            
                setTimeout(relayobj.getRelayList(),1000);                
            });
            request.fail(function (jqxhr, textStatus)
            {                            
                throw new MyError("Error : Ajax Delete Error" );
            });
        };        
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

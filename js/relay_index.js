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
    createNew : function(){
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
        return createobj;
    }
}

var Relay = {
    createNew: function(){
        var delete_class = '.delete';
        var htmlobj = CreateHtml.createNew();
        var relayobj = {}; 1       
        relayobj.getRelayList = function(){ 
            var request = relayobj.CallAjax("relay/list","GET", '', "json");
                request.done(function (msg, statustext, jqxhr)
                {           
                    htmlobj.clearTable();
                    htmlobj.appendTable(msg);
                    relayobj.rebindDeleteEvert();
                });
                request.fail(function (jqxhr, textStatus)
                {            
                    throw new MyError("Error : Ajax List Error" );
                });
        };
        relayobj.createRelay = function(source,port,channelname){ 
            var jsonrequest = '{"Source":"' + source + '","Port":' + port + ',"ChannelName":"' + channelname +  '"}';
            var request = relayobj.CallAjax("relay/create","POST", jsonrequest, "json");
            request.done(function (msg, statustext, jqxhr)
            {           
                alert('Success');
                relayobj.getRelayList();
            });
            request.fail(function (jqxhr, textStatus)
            {            
                throw new MyError("Error : Ajax Create Error" );
            });
        };
        relayobj.rebindDeleteEvert = function(){
            $(delete_class).click(function () {
                var thisitem = $(this);
                alert('delete');
                alert(thisitem.attr('id'));
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

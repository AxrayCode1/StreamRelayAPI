//$(document).ready(function ()
//    {      
//        action_Realy = Relay.createNew();        
//        action_Relay.GetRelayList();
//    }
//)
var action_Relay = {};
var relayList;
var IPList;
var GatewayList;
var DNSList;
var relayClass = function(id,source,port,channelname){
    this.id = id;
    this.source=source;
    this.port=port;
    this.channelname=channelname;
}
var IPClass = function(id,displayname,name,ip,mask){
    this.id = id;    
    this.displayname = displayname;
    this.name = name;
    this.ip = ip;
    this.mask = mask;
}
var GatewayClass = function(id,ip,bindport){
    this.id = id;
    this.ip = ip;
    this.bindport = bindport;
}
var DNSClass = function(id,ip){
    this.id = id;
    this.ip = ip;
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
    $('#a_btn_ip_setting').click(function(){
        action_Relay.listip();
    }); 
    $('#btn_ip_confirm').click(function(){
        SetIPAction();
    }); 
    $('#btn_ip_cancel').click(function(){
        action_Relay.listip();
    });    
}
function SetIPAction()
{
    var regexIP=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    var bInputIP = false;
    var sJsonIP = '';
    $.each( IPList, function( index, element ) { 
        if($('#IPMask'+element['id']).val().length > 0)
        {
            if(regexIP.test($('#IPMask'+element['id']).val()) === false)
            {
                alert(element['displayname'] + "'s Mask format error.");                
                return false;
            }
            if(regexIP.test($('#IP'+element['id']).val()) === false)
            {
                alert(element['displayname'] + "'s IP format error.");                
                return false;
            }
            bInputIP = true;
        }
        else
        {
            if($('#IP'+element['id']).val().length > 0)
            {
                alert("Please input " + element['displayname'] + "'s mask.");
                return false;
            }
        }
        if(!bInputIP)
        {
            alert("Please input ip and mask of one nic.")
            return false;
        }
        if(index != 0)
            sJsonIP += ',';
        sJsonIP += '{"name":"' + element['name'] + '","ip":"' + element['ip'] + '","mask":"' + element['mask'] + '"}'
    });
    alert(sJsonIP);
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
        var ip_field = $('#div_ip_field');
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
        createobj.EmptyIPDiv = function(){
            ip_field.empty();
        };
        createobj.appendIPDiv = function(ip_list){
            IPList = [];
            GatewayList = [];
            DNSList = [];
            var tmp_ip_item;
            var tmp_dns_item;
            var tmp_gateway_item;
            var tmp_ip_displayidex;
            var tmp_ip;
            var tmp_mask;
            var tmp_ip_html;
            var tmp_dns_html;
            var tmp_bol_marge;
            
            $.each( ip_list, function( index, element ) 
            {                
               switch(index)
               {
                   case 'IP':
                       $.each( element, function( ipindex, ipelement ) 
                       {                  
                           tmp_bol_marge = true;
                           tmp_ip = ipelement['ip'];
                           tmp_mask = ipelement['mask'];                                                      
                           tmp_ip_displayidex = ipindex + 1;     
                           tmp_ip_item = new IPClass(ipindex,'NIC' + tmp_ip_displayidex,ipelement['name'],tmp_ip,tmp_mask);
                           IPList[ipindex]=tmp_ip_item;
                           if(ipindex == 0)
                               tmp_bol_marge = false
                           tmp_ip_html = createobj.CreateIPHtml(ipindex,'NIC' + tmp_ip_displayidex, tmp_ip,tmp_mask,tmp_bol_marge);
                           ip_field.append(tmp_ip_html);
                       });
                       break;
                   case 'Gateway':
                       $.each( element, function( gatewayindex, gatewayelement ) 
                       {
                           tmp_ip = gatewayelement['ip'];
                           tmp_gateway_item = new GatewayClass(gatewayindex,tmp_ip,gatewayelement['bindport']);
                           GatewayList[gatewayindex] = tmp_gateway_item;
                           tmp_ip_html = createobj.CreateGatewayHtml(gatewayindex,tmp_ip,gatewayelement['bindport']);
                           ip_field.append(tmp_ip_html);
                           return false;
                       });
                       break;
                   case 'DNS':
                       $.each( element, function( dnsindex, dnselement ) 
                       {
                           tmp_ip = dnselement['ip'];
                           tmp_dns_item = new DNSClass(dnsindex, tmp_ip);
                           DNSList[dnsindex] = tmp_dns_item;
                           tmp_dns_html = createobj.CreateDNSHtml(dnsindex,tmp_ip);
                           ip_field.append(tmp_dns_html);
                           return false;
                       });
                       break;
               }                                
            });
        };
        createobj.CreateIPHtml =function(id,displayname,ip,mask,bmarge){   
            var rtnhtml = '<fieldset ';
            if(bmarge)
                rtnhtml += 'style="margin-top:10px"'
            rtnhtml += '><legend>' + displayname + '</legend>IP : <input id="IP' + id +'" type="text" class="iptext" value="' + ip + '"><br><br>Mask : <input class="iptext" id="IPMask' + id + '" type="text" value="' + mask + '"><br></fieldset>';
            return rtnhtml;
        };
        createobj.CreateGatewayHtml = function(id,ip,bindport){
            var rtnhtml = '<fieldset ';            
            rtnhtml += 'style="margin-top:10px"';
            rtnhtml += '><legend>Gateway</legend>IP : <input id="Gateway' + id +'" type="text" class="iptext" value="' + ip + '"><br><br>';
            rtnhtml += 'Bind NIC Port : <select id="GatewaySelect' + id + '">';
            $.each(IPList, function( ipindex, ipelement )
            {
                if(bindport == '' && ipindex == 0)
                {
                    rtnhtml += '<option value="' + ipelement['name'] + '" selected=true>' + ipelement['displayname'] + '</option>';                    
                }
                else if(bindport == ipelement['name'])
                {
                    rtnhtml += '<option value="' + ipelement['name'] + '" selected=true>' + ipelement['displayname'] + '</option>';                    
                }
                else
                    rtnhtml += '<option value="' + ipelement['name'] + '">' + ipelement['displayname'] + '</option>';                    
            });
            rtnhtml += '<br></fieldset>';
            return rtnhtml; 
        }
        createobj.CreateDNSHtml = function(id,ip)
        {
            var rtnhtml = '<fieldset ';            
            rtnhtml += 'style="margin-top:10px"'
            rtnhtml += '><legend>DNS</legend>IP : <input id="DNS' + id +'" type="text" class="iptext" value="' + ip + '"><br></fieldset>';
            return rtnhtml;
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
                alert("Error : Ajax List Error" );
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
        relayobj.listip = function(){ 
            var request = relayobj.CallAjax("ip/list","GET", '', "json");
            htmlobj.blockPage();
            request.done(function (msg, statustext, jqxhr)
            {                       
                htmlobj.EmptyIPDiv();
                htmlobj.appendIPDiv(msg);
                htmlobj.stopPage();                                   
            });
            request.fail(function (jqxhr, textStatus)
            {            
                htmlobj.stopPage();
                alert("Error : Ajax List Error" );
            });
        };
        relayobj.setip = function(){
            
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

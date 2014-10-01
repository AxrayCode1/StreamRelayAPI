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
    var DivChannel = $('#div_relay_control');
    var DivIP = $('#div_ip_control');
    DivIP.hide();
    $('#btn_refresh').click(function () {
        action_Relay.getRelayList();
    });
    $('#btn_create').click(function(){
        createAction();
    });    
    $('#ise').click(function(){      
        DivChannel.hide();
        DivIP.show();        
        action_Relay.listip();
    }); 
    $('#rl').click(function(){
        DivIP.css('display','none');
        DivChannel.css('display','inline');
        action_Relay.getRelayList();
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
    var bCheckHaveInputIP;
    var bInputIP = false;
    var bInputGateway = false;
    var bInputDNS = false;
    var sJsonIP = '';
    var sJsonGateway = '';
    var sJsonDNS = '';
    var aGateway = [];
    var aIP = [];
    var aMask = [];
    $.each(GatewayList,function(index,element){
       if($('#Gateway' + element['id']).val().length > 0 && !regexIP.test($('#Gateway' + element['id']).val()))
       {
           alert("Gateway's IP format error.");
           return false;
       }
       bInputGateway = true;
       sJsonGateway += '{"ip":"' +  $('#Gateway' + element['id']).val() + '","bindport":"' + $('#GatewaySelect' + element['id']).select().val() +'"}';       
       return false;
    });
    if(!bInputGateway)
        return false;
    $.each( IPList, function( index, element ) { 
        bInputIP = false;
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
            bCheckHaveInputIP = true;              
            if($('#Gateway' + GatewayList[0]['id']).val().length > 0 && $('#GatewaySelect' + GatewayList[0]['id']).select().val()==element['name'])
            {
                aGateway = $('#Gateway' + GatewayList[0]['id']).val().split('.');
                aIP = $('#IP'+element['id']).val().split('.');
                aMask = $('#IPMask'+element['id']).val().split('.');
                var iIPAndMask1 = aIP[0] & aMask[0];
                var iIPAndMask2 = aIP[1] & aMask[1];
                var iIPAndMask3 = aIP[2] & aMask[2];
                var iIPAndMask4 = aIP[3] & aMask[3];
                var iGatewayAndMask1 = aGateway[0] & aMask[0];
                var iGatewayAndMask2 = aGateway[1] & aMask[1];
                var iGatewayAndMask3 = aGateway[2] & aMask[2];
                var iGatewayAndMask4 = aGateway[3] & aMask[3];
                if(iIPAndMask1 != iGatewayAndMask1 || iIPAndMask2 != iGatewayAndMask2 || iIPAndMask3 != iGatewayAndMask3 || iIPAndMask4 != iGatewayAndMask4)
                {
                    alert(element['displayname'] + "'s IP and Gateway's IP are not the same lan.");
                    return false;
                }
            }                      
        }
        else
        {
            if($('#IP'+element['id']).val().length > 0)
            {
                alert("Please input " + element['displayname'] + "'s mask.");
                return false;
            }
        }                
        bInputIP = true;
        if(index != 0)
            sJsonIP += ',';
        sJsonIP += '{"name":"' + element['name'] + '","ip":"' + $('#IP'+element['id']).val() + '","mask":"' + $('#IPMask'+element['id']).val() + '"}';
    });  
    if(!bCheckHaveInputIP)
    {
        alert("Please input ip and mask of one nic.")
        return false;
    }
    if(!bInputIP)
        return false;
    
    $.each(DNSList,function(index,element){           
       if($('#DNS' + element['id']).val().length > 0 && !regexIP.test($('#DNS' + element['id']).val()))
       {
           alert("DNS's IP format error.");
           return false;
       }
       bInputDNS = true;
       sJsonDNS += '{"ip":"' +  $('#DNS' + element['id']).val() + '"}';
       return false;
    });
    if(!bInputDNS)
        return false;
    action_Relay.setip(sJsonIP,sJsonGateway,sJsonDNS);
}
function createAction()
{
    var flag = true;
    var source = $('#Source').val();
    var port = $('#Port').val();
    var name = $('#ChannelName').val();
    var sRemark1 = $('#Remark1').val();
    var sRemark2 = $('#Remark2').val();
    var whitespace = " ";
    var sDot = ","
    if(name.indexOf(whitespace) != -1 || name.indexOf(sDot) != -1)
    {
        alert("Error : Can't input whitespace and ',' in Channel Name." );
        return;
    }    
    if(sRemark1.indexOf(whitespace) != -1 || sRemark1.indexOf(sDot) != -1)
    {
        alert("Error : Can't input whitespace and ',' in Remark1." );
        return;
    }  
    if(sRemark2.indexOf(whitespace) != -1 || sRemark2.indexOf(sDot) != -1)
    {
        alert("Error : Can't input whitespace and ',' in Remark2." );
        return;
    }  
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
    action_Relay.createRelay(sRemark1,sRemark2,source,port,name);
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
                append_str += '<td style="text-align:center">' +  (index+1) + '</td>';                
                append_str += '<td>' +  element['source'] + '</td>';
                append_str += '<td>' +  element['dest'] + '</td>';                    
                if(element['status'] == 0)
                    append_str += '<td>Not Ready</td>';       
                else
                    append_str += '<td>Ready</td>';       
                append_str += '<td>' +  element['remark1'] + '</td>';
                append_str += '<td>' +  element['remark2'] + '</td>'; 
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
            rtnhtml += '><legend style="">' + displayname + '</legend><div class="div_fieldcontent">IP : <input id="IP' + id +'" type="text" class="iptext" value="' + ip + '"><br><br>Mask : <input class="iptext" id="IPMask' + id + '" type="text" value="' + mask + '"><br></div></fieldset>';
            return rtnhtml;
        };
        createobj.CreateGatewayHtml = function(id,ip,bindport){
            var rtnhtml = '<fieldset ';            
            rtnhtml += 'style="margin-top:10px"';
            rtnhtml += '><legend>Gateway</legend><div class="div_fieldcontent">IP : <input id="Gateway' + id +'" type="text" class="iptext" value="' + ip + '"><br><br>';
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
            rtnhtml += '<br></div><fieldset>';
            return rtnhtml; 
        }
        createobj.CreateDNSHtml = function(id,ip)
        {
            var rtnhtml = '<fieldset ';            
            rtnhtml += 'style="margin-top:10px"'
            rtnhtml += '><legend>DNS</legend><div class="div_fieldcontent">IP : <input id="DNS' + id +'" type="text" class="iptext" value="' + ip + '"><br></div</fieldset>';
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
        createobj.blockPageMsg = function(msg){     
            msg = '<h2>' + msg + '</h2>';
            $.blockUI({message:msg,css: { padding:0,margin:0,width:'20%',top:'40%',left:'35%',textAlign:'center',
				color:		'#000',
				border:		'3px solid #aaa',
				backgroundColor:'#fff',
				cursor:		'wait'}});
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
        relayobj.createRelay = function(remark1,remark2,source,port,channelname){ 
            
            var jsonrequest = '{"Remark1":"' + remark1 + '","Remark2":"' + remark2 + '","Source":"' + source + '","Port":' + port + ',"ChannelName":"' + channelname +  '"}';
            var request = relayobj.CallAjax("relay/create","POST", jsonrequest, "json");
            htmlobj.blockPage();
            request.done(function (msg, statustext, jqxhr)
            {           
                htmlobj.stopPage();
//                alert('Success');
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
                alert("Error : Ajax List IP Error" );
            });
        };
        relayobj.setip = function(sJsonIP,sJsonGateway,sJsonDNS){            
            var sJsonRequest = '{"IP":[' + sJsonIP + '],"Gateway":[' + sJsonGateway + '],"DNS":[' + sJsonDNS + ']}';
            htmlobj.blockPageMsg("Please redirect new IP Address.");
            var request = relayobj.CallAjax("ip/set","POST", sJsonRequest, "json");            
            request.done(function (msg, statustext, jqxhr)
            {                                           
                if(jqxhr.status !== 400)
                {                    
                }
                else
                {
                    htmlobj.stopPage();
                    alert("Error : Set IP Error" );
                }
            });
            request.fail(function (jqxhr, textStatus)
            {                               
                if(jqxhr.status !== 400)
                {                   
                }
                else
                {
                    htmlobj.stopPage();
                    alert("Error : Set IP Error" );
                }
                
            });
        };
        relayobj.CallAjaxNoAsync = function(url,method, data, datatype){             
            var request = $.ajax({
                type: method,
                url: url,
                data: data,
                dataType: datatype,
                async: false
            });
            return request;
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

//$(document).ready(function ()
//    {      
//        action_Realy = Relay.createNew();        
//        action_Relay.GetRelayList();
//    }
//)
var IPList;
var GatewayList;
var DNSList;
var relayList;

function MyError(message) {
    this.message = message || "Default Message";
    alert(this.message);
    $(document).ajaxStop($.unblockUI);
}
MyError.prototype = new Error();
MyError.prototype.constructor = MyError;

function init() {
    var OUIControl = UIControl.createNew();
    OUIControl.Init();
}

var UIControl = {
    createNew:function(){
        var delete_class = '.delete';
        var resume_class = '.resume';
        var DivChannel = $('#div_relay_control');
        var DivIP = $('#div_ip_control');
        var action_Relay = {};
        var HtmlObj = {};        
        var sMassCreateStr = '';
        var UIObj={};
        UIObj.Init = function(){
            DivIP.hide();
            HtmlObj = CreateHtml.createNew();
            action_Relay = Relay.createNew();        
            UIObj.GetRelayList();
            $('#btn_refresh').click(function() {
                UIObj.GetRelayList();
            });
            $('#btn_create').click(function() {        
                UIObj.CreateRelayAction();                       
            });
            $('#ise').click(function() {
                DivChannel.hide();
                DivIP.show();
                UIObj.GetIPList();
            });
            $('#rl').click(function() {
                DivIP.css('display', 'none');
                DivChannel.css('display', 'inline');
                UIObj.GetRelayList();
            });
            $('#btn_ip_confirm').click(function() {
                UIObj.SetIPAction();
            });
            $('#btn_ip_cancel').click(function() {
                UIObj.GetIPList();
            });
            $('#file_test').change(function(event){                
                $('#uploadFile').val($(this).val());
                UIObj.FileBindChangeEvent(event);
            });
            $('#btn_create').click(function() {                        
                UIObj.MassFileParserAction();        
            });
        };
        
        
        UIObj.GetRelayList = function(){
            var request = action_Relay.getRelayList();
            UIObj.CallBackGetRelay(request);
        };     
        
        UIObj.CallBackGetRelay = function(request){
            HtmlObj.blockPage();
            request.done(function(msg, statustext, jqxhr) {
                HtmlObj.stopPage();
                HtmlObj.clearTable();
                HtmlObj.appendTable(msg);
                UIObj.RebindDeleteEvert();
                UIObj.RebindResumeEvert();
            });
            request.fail(function(jqxhr, textStatus) {
                HtmlObj.stopPage();
                alert("Error : Ajax List Relay Error");
            });
        };
                       
        UIObj.RebindDeleteEvert = function() {
            $(delete_class).click(function() {
                var thisitem = $(this);                
                UIObj.DeleteRelay(relayList[thisitem.attr('id')]['id']);
            });
        };
        
        UIObj.DeleteRelay = function(id){
            var request = action_Relay.deleteRelay(id);   
            UIObj.CallBackDeleteRelay(request);
        };
        
        UIObj.CallBackDeleteRelay = function(request){
            request.done(function(msg, statustext, jqxhr) {
                setTimeout(UIObj.GetRelayList(), 2000);
            });
            request.fail(function(jqxhr, textStatus) {
                alert("Error : Ajax Delete Relay Error");
            });
        };
        
        UIObj.RebindResumeEvert = function() {
            $(resume_class).click(function() {
                var thisitem = $(this);                
                var index = thisitem.attr('id');
                UIObj.ResumeRelay(index);
            });
        };
        
        UIObj.ResumeRelay = function(index){
            var request = action_Relay.deleteRelay(relayList[index]['id'], relayList[index]['source'], relayList[index]['port'], relayList[index]['channelname']);   
            UIObj.CallBackResumeRelay(request);
        };
        
        UIObj.CallBackResumeRelay = function(request){
            request.done(function(msg, statustext, jqxhr) {
                setTimeout(UIObj.GetRelayList(), 2000);
            });
            request.fail(function(jqxhr, textStatus) {
                alert("Error : Ajax Delete Relay Error");
            });
        };
        
        UIObj.GetIPList = function(){
            var request = action_Relay.listip();
            UIObj.CallBackGetIP(request);
        };
        
        UIObj.CallBackGetIP = function(request){
            HtmlObj.blockPage();
            request.done(function(msg, statustext, jqxhr) {
                HtmlObj.stopPage();
                HtmlObj.EmptyIPDiv()();
                HtmlObj.appendTable(msg);               
            });
            request.fail(function(jqxhr, textStatus) {
                HtmlObj.stopPage();
                alert("Error : Ajax List IP Error");
            });
        };
        
        UIObj.SetIPAction = function(){
            var regexIP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
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
            $.each(GatewayList, function(index, element) {
                if ($('#Gateway' + element['id']).val().length > 0 && !regexIP.test($('#Gateway' + element['id']).val())) {
                    alert("Gateway's IP format error.");
                    return false;
                }
                bInputGateway = true;
                sJsonGateway += '{"ip":"' + $('#Gateway' + element['id']).val() + '","bindport":"' + $('#GatewaySelect' + element['id']).select().val() + '"}';
                return false;
            });
            if (!bInputGateway)
                return false;
            $.each(IPList, function(index, element) {
                bInputIP = false;
                if ($('#IPMask' + element['id']).val().length > 0) {
                    if (regexIP.test($('#IPMask' + element['id']).val()) === false) {
                        alert(element['displayname'] + "'s Mask format error.");
                        return false;
                    }
                    if (regexIP.test($('#IP' + element['id']).val()) === false) {
                        alert(element['displayname'] + "'s IP format error.");
                        return false;
                    }
                    bCheckHaveInputIP = true;
                    if ($('#Gateway' + GatewayList[0]['id']).val().length > 0 && $('#GatewaySelect' + GatewayList[0]['id']).select().val() === element['name']) {
                        aGateway = $('#Gateway' + GatewayList[0]['id']).val().split('.');
                        aIP = $('#IP' + element['id']).val().split('.');
                        aMask = $('#IPMask' + element['id']).val().split('.');
                        var iIPAndMask1 = aIP[0] & aMask[0];
                        var iIPAndMask2 = aIP[1] & aMask[1];
                        var iIPAndMask3 = aIP[2] & aMask[2];
                        var iIPAndMask4 = aIP[3] & aMask[3];
                        var iGatewayAndMask1 = aGateway[0] & aMask[0];
                        var iGatewayAndMask2 = aGateway[1] & aMask[1];
                        var iGatewayAndMask3 = aGateway[2] & aMask[2];
                        var iGatewayAndMask4 = aGateway[3] & aMask[3];
                        if (iIPAndMask1 !== iGatewayAndMask1 || iIPAndMask2 !== iGatewayAndMask2 || iIPAndMask3 !== iGatewayAndMask3 || iIPAndMask4 !== iGatewayAndMask4) {
                            alert(element['displayname'] + "'s IP and Gateway's IP are not the same lan.");
                            return false;
                        }
                    }
                } else {
                    if ($('#IP' + element['id']).val().length > 0) {
                        alert("Please input " + element['displayname'] + "'s mask.");
                        return false;
                    }
                }
                bInputIP = true;
                if (index !== 0)
                    sJsonIP += ',';
                sJsonIP += '{"name":"' + element['name'] + '","ip":"' + $('#IP' + element['id']).val() + '","mask":"' + $('#IPMask' + element['id']).val() + '"}';
            });
            if (!bCheckHaveInputIP) {
                alert("Please input ip and mask of one nic.");
                return false;
            }
            if (!bInputIP)
                return false;

            $.each(DNSList, function(index, element) {
                if ($('#DNS' + element['id']).val().length > 0 && !regexIP.test($('#DNS' + element['id']).val())) {
                    alert("DNS's IP format error.");
                    return false;
                }
                bInputDNS = true;
                sJsonDNS += '{"ip":"' + $('#DNS' + element['id']).val() + '"}';
                return false;
            });
            if (!bInputDNS)
                return false;
            UIObj.SetIP(sJsonIP, sJsonGateway, sJsonDNS);           
        };    
        
        UIObj.SetIP=function(sJsonIP, sJsonGateway, sJsonDNS)
        {
            var request = action_Relay.setip(sJsonIP, sJsonGateway, sJsonDNS);
            UIObj.CallBackSetIP(request); 
        }
        
        UIObj.CallBackSetIP=function(request){
            htmlobj.blockPageMsg("Please redirect new IP Address.");            
            request.done(function(msg, statustext, jqxhr) {
                if (jqxhr.status !== 400) {} else {
                    htmlobj.stopPage();
                    alert("Error : Set IP Error");
                }
            });
            request.fail(function(jqxhr, textStatus) {
                if (jqxhr.status !== 400) {} else {
                    htmlobj.stopPage();
                    alert("Error : Set IP Error");
                }

            });
        };
        
        UIObj.CreateRelayAction = function (){
            var flag = true;
            var source = $('#Source').val();
            var port = $('#Port').val();
            var name = $('#ChannelName').val();
            var sRemark1 = $('#Remark1').val();
            var sRemark2 = $('#Remark2').val();
            var whitespace = " ";
            var sDot = ",";
            if (!UIObj.VerifyRelayInput(name)) {
                alert("Error : Can't input whitespace and ',' in Channel Name.");
                return;
            }
            if (!UIObj.VerifyRelayInput(sRemark1)) {
                alert("Error : Can't input whitespace and ',' in Remark1.");
                return;
            }
            if (!UIObj.VerifyRelayInput(sRemark2)) {
                alert("Error : Can't input whitespace and ',' in Remark2.");
                return;
            }
            if (source.length === 0) {
                alert("Error : Please input Source");
                return;
            }
            if (port.length === 0) {
                alert("Error : Please input Port");
                return;
            };
            $.each(relayList, function(index, element) {                
                if (String(port) === element['port']) {
                    flag = false;
                    alert("Error : DUPLICATE PORT NUMBER !");
                    return false;
                }
            });
            if (!flag)
                return;
            UIObj.CreatRelay(sRemark1, sRemark2, source, port, name);
        };
        
        UIObj.VerifyRelayInput = function(Input_Data)
        {
            if (Input_Data.indexOf(whitespace) !== -1 || Input_Data.indexOf(sDot) !== -1)
                return false;
            else
                return true;
        };
        
        UIObj.CreatRelay = function(sRemark1, sRemark2, source, port, name){
            var request = action_Relay.createRelay(sRemark1, sRemark2, source, port, name);
            UIObj.CallBackCreateRelay(request);
        };
        
        UIObj.CallBackCreateRelay = function(request)
        {
            HtmlObj.blockPage();
            request.done(function(msg, statustext, jqxhr) {
                HtmlObj.stopPage();                
                HtmlObj.getRelayList();
            });
            request.fail(function(jqxhr, textStatus) {
                HtmlObj.stopPage();
                alert("Error : Ajax Create Relay Error");
            });
        };

        UIObj.FileBindChangeEvent = function(event){  
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                sMassCreateStr = '';
                var filelist = event.target.files;
                var str = "";
                for(var i = 0; i < filelist.length ; i++ ) {
                    var file = filelist[i];
                    str += "name：" + escape(file.name) + "\n" + //檔名
                           "type：" + file.type + "\n" +  //檔案類型
                           "size：" + file.size + "\n" +  //檔案大小
                           "lastModifiedDate：" + file.lastModifiedDate.toLocaleDateString() + "\n\n\n"; //最後修改日期              


                }    
                alert(str);
                file = filelist[0];    
                var reader = new FileReader();
                reader.onload = function() {
                    sMassCreateStr = reader.result;
                    alert(sMassCreateStr);
                };
                reader.readAsText(file);
            }
        };

        UIObj.MassFileParserAction = function () {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                alert("support");
            } else {
                alert('Please Change Your Browser.Your Browser is not support File API.');
            }
        };
        
        return UIObj;
    }    
};

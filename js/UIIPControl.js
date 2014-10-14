var UIIPControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;        
        var oUIIPContorl={};
        var oError = {};
        var DivChannel = $('#div_relay_control');
        var DivIP = $('#div_ip_control');
        var DivSystem = $('#div_sys_config');
        oUIIPContorl.Init = function(){   
            oError = ErrorHandle.createNew();
            $('#ise').click(function() {
                DivChannel.hide();
                DivSystem.hide();
                DivIP.show();
                oUIIPContorl.GetIPList();
            });            
            $('#btn_ip_confirm').click(function() {
                oUIIPContorl.SetIPAction();
            });
            $('#btn_ip_cancel').click(function() {
                oUIIPContorl.GetIPList();
            });           
        };                        
        
        oUIIPContorl.GetIPList = function(){
            var request = oRelayAjax.listip();
            oUIIPContorl.CallBackGetIP(request);
        };
        
        oUIIPContorl.CallBackGetIP = function(request){
            oHtml.blockPage();
            request.done(function(msg, statustext, jqxhr) {
                oHtml.stopPage();
                oHtml.EmptyIPDiv();
                oHtml.appendIPDiv(msg);               
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.GetIP);
            });
        };
        
        oUIIPContorl.SetIPAction = function(){
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
            oUIIPContorl.SetIP(sJsonIP, sJsonGateway, sJsonDNS);           
        };    
        
        oUIIPContorl.SetIP=function(sJsonIP, sJsonGateway, sJsonDNS)
        {
            var request = oRelayAjax.setip(sJsonIP, sJsonGateway, sJsonDNS);
            oUIIPContorl.CallBackSetIP(request); 
        };
        
        oUIIPContorl.CallBackSetIP=function(request){
            oHtml.blockPageMsg("Please redirect new IP Address.");            
            request.done(function(msg, statustext, jqxhr) {
                if (jqxhr.status !== 400) {} else {
                    oHtml.stopPage();
                    alert("Error : Set IP Error");
                }
            });
            request.fail(function(jqxhr, textStatus) {
                if (jqxhr.status !== 400) {} else {
                    oHtml.stopPage();
                    alert("Error : Set IP Error");
                }

            });
        };               
        return oUIIPContorl;
    }
};


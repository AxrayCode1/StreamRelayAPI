var Relay = {
    createNew: function() {
        var relayobj = {};        
        relayobj.getRelayList = function() {
            var request = relayobj.CallAjax("relay/list", "GET", '', "json");
            return request;
            
        };
        relayobj.createRelay = function(remark1, remark2, source, port, channelname) {
            var jsonrequest = '{"Remark1":"' + remark1 + '","Remark2":"' + remark2 + '","Source":"' + source + '","Port":' + port + ',"ChannelName":"' + channelname + '"}';
            var request = relayobj.CallAjax("relay/create", "POST", jsonrequest, "json");
            return request;            
        };
        relayobj.deleteRelay = function(deleteID) {
            var request = relayobj.CallAjax("relay/delete/" + deleteID, "DELETE", "", "json");
            return request;           
        };
        relayobj.resumeRelay = function(id, source, port, channelname) {
            try {
                var jsonrequest = '{"Source":"' + source + '","Port":' + port + ',"ChannelName":"' + channelname + '","ID":"' + id + '"}';
                var request = relayobj.CallAjax("relay/resume", "POST", jsonrequest, "json");
                return request;
                htmlobj.blockPage();
                request.done(function(msg, statustext, jqxhr) {
                    htmlobj.stopPage();
                    setTimeout(relayobj.getRelayList(), 2000);
                });
                request.fail(function(jqxhr, textStatus) {
                    alert("Error : Ajax Resume Error");
                });
            } catch (exception) {

            }
        };
        relayobj.listip = function() {
            var request = relayobj.CallAjax("ip/list", "GET", '', "json");
            return request;
            
        };
        relayobj.setip = function(sJsonIP, sJsonGateway, sJsonDNS) {
            var sJsonRequest = '{"IP":[' + sJsonIP + '],"Gateway":[' + sJsonGateway + '],"DNS":[' + sJsonDNS + ']}';
            var request = relayobj.CallAjax("ip/set", "POST", sJsonRequest, "json");
            return request;            
        };
        relayobj.CallAjaxNoAsync = function(url, method, data, datatype) {
            var request = $.ajax({
                type: method,
                url: url,
                data: data,
                dataType: datatype,
                async: false
            });
            return request;
        };
        relayobj.CallAjax = function(url, method, data, datatype) {
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

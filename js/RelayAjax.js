var Relay = {
    createNew: function() {
        var relayobj = {};        
        relayobj.getRelayList = function() {
            var request = relayobj.CallAjax("/relay/list", "GET", '', "json");
            return request;
            
        };
        relayobj.createRelay = function(channelnumber,name, description, source, destport, destname) {
            var jsonrequest = '{"ChannelNumber":'+ channelnumber 
                    +',"Name":"' + name 
                    + '","Description":"' + description 
                    + '","SourceUrl":[' + source 
                    + '],"DestPort":' + destport 
                    + ',"DestName":"' + destname + '"}';            
            var request = relayobj.CallAjax("/relay/create", "POST", jsonrequest, "json");
            return request;            
        };
        relayobj.deleteRelay = function(deleteID) {
            var request = relayobj.CallAjax("/relay/delete/" + deleteID, "DELETE", "", "json");
            return request;           
        };
        relayobj.stopRelay = function(stopID) {
            var request = relayobj.CallAjax("/relay/stop/" + stopID, "PUT", "", "json");
            return request;           
        };
        relayobj.stopMultiRelay = function(arrID) {
            var jsonrequest = '{"ID":[';
            try {
                for(var i = 0; i < arrID.length; i++)
                {
                    if(i !== arrID.length -1)
                        jsonrequest += arrID[i] + ',';
                    else
                        jsonrequest += arrID[i];
                }
            } catch (exception) {
            }
            jsonrequest += ']}';
            var request = relayobj.CallAjax("/relay/stop/multi", "POST", jsonrequest, "json");
            return request; 
        };
        relayobj.resumeRelay = function(arrID) {
            var jsonrequest = '{"ID":[';
            try {
                for(var i = 0; i < arrID.length; i++)
                {
                    if(i !== arrID.length -1)
                        jsonrequest += arrID[i] + ',';
                    else
                        jsonrequest += arrID[i];
                }
            } catch (exception) {
            }
            jsonrequest += ']}';
            var request = relayobj.CallAjax("/relay/resume", "POST", jsonrequest, "json");
            return request; 
        };
        relayobj.listip = function() {
            var request = relayobj.CallAjax("/ip/list", "GET", '', "json");
            return request;
            
        };
        relayobj.setip = function(sJsonIP, sJsonGateway, sJsonDNS) {
            var sJsonRequest = '{"IP":[' + sJsonIP + '],"Gateway":[' + sJsonGateway + '],"DNS":[' + sJsonDNS + ']}';
            var request = relayobj.CallAjax("/ip/set", "POST", sJsonRequest, "json");
            return request;            
        };    
        relayobj.changepwd = function(sNewPWD) {
            var sJsonRequest = '{"PWD":"' + sNewPWD + '"}';            
            var request = relayobj.CallAjax("/system/password/change", "PUT", sJsonRequest, "json");
            return request;            
        };     
        relayobj.listversion = function(){
            var request = relayobj.CallAjax("/system/update/list", "GET", '', "json");
            return request;            
        };
        relayobj.checknewversion = function(){
            var request = relayobj.CallAjax("/system/update/checknew", "GET", '', "json");
            return request;            
        };
        relayobj.updatenewversion = function(){
            var request = relayobj.CallAjax("/system/update/updatenew", "POST", '', "json");
            return request;            
        };
        relayobj.checkupdate = function(){
            var request = relayobj.CallAjax("/system/update/checkupdate", "GET", '', "json");
            return request;            
        };
        relayobj.listlog = function() {
            var request = relayobj.CallAjax("/log/list", "GET", '', "json");
            return request;            
        };
        relayobj.AddChannelSource = function(channelid,asourceurl) {
            var jsonrequest = '{"ChannelID":'+ channelid + ',"AddSource":[';
            for(var i = 0; i < asourceurl.length; i++)
            {
                jsonrequest += '{"URL":"' + asourceurl[i]['url'] + '","Order":' + asourceurl[i]['prior'];
                if(i === asourceurl.length - 1)
                    jsonrequest += '}';
                else
                    jsonrequest += '},';
            }
            jsonrequest += ']}';            
            var request = relayobj.CallAjax("/relay/source/add", "POST", jsonrequest, "json");
            return request;            
        };
        relayobj.DeleteChannelSource = function(channelid,asourceurl) {
            var jsonrequest = '{"ChannelID":'+ channelid + ',"DeleteSource":[';
            for(var i = 0; i < asourceurl.length; i++)
            {
                jsonrequest += asourceurl[i]['id'];
                if(i === asourceurl.length - 1)
                    jsonrequest += '';
                else
                    jsonrequest += ',';
            }
            jsonrequest += ']}';         
            var request = relayobj.CallAjax("/relay/source/delete", "POST", jsonrequest, "json");
            return request;            
        };
        relayobj.ReOrderChannelSource = function(channelid,asourceurl) {
            var jsonrequest = '{"ChannelID":'+ channelid + ',"ReorderSource":[';
            for(var i = 0; i < asourceurl.length; i++)
            {
                jsonrequest += '{"ID":';
                jsonrequest += asourceurl[i]['id'];
                jsonrequest += ',"Order":';
                jsonrequest += asourceurl[i]['prior'];
                if(i === asourceurl.length - 1)
                    jsonrequest += '}';
                else
                    jsonrequest += '},';
            }
            jsonrequest += ']}';                     
            var request = relayobj.CallAjax("/relay/source/reorder", "POST", jsonrequest, "json");
            return request;            
        };
        relayobj.ModifyChannel = function(idchannel,channelnumber,name, description, destport, destname) {
            var jsonrequest = '{"ChannelNumber":'+ channelnumber 
                    +',"Name":"' + name 
                    + '","Description":"' + description                    
                    + '","DestPort":' + destport 
                    + ',"DestName":"' + destname + '"}';            
            var request = relayobj.CallAjax("/relay/modify/" + idchannel, "PUT", jsonrequest, "json");
            return request;            
        };
        relayobj.CallAjaxNoAsync = function(url, method, data, datatype) {
            var request = $.ajax({
                type: method,
                url: url,
                data: data,
                dataType: datatype,
                timeout:30000,
                async: false
            });
            return request;
        };        
        relayobj.CallAjax = function(url, method, data, datatype) {
            var request = $.ajax({
                type: method,
                url: url,
                data: data,
                timeout:30000,
                dataType: datatype
            });
            return request;
        };
        return relayobj;
    }
};

var CreateHtml = {
    createNew: function() {                
        var table_relay = $('#table_relay');
        var ip_field = $('#div_ip_field');
        var Table_Result_Mass_Entry = $('#MassEntryResulTable');
        var createobj = {};
        createobj.clearTable = function() {
            table_relay.find("tr:gt(0)").remove();
        };
        createobj.appendTable = function(relay_list) {
            var tmp_relay_item;
            var dest_temp;
            var port;
            var dest_name;
            relayList = [];
            $.each(relay_list, function(index, element) {
                dest_temp = element['Dest'].split(':');
                port = '';
                dest_name = '';
                if (typeof(dest_temp[2]) !== 'undefined') {
                    dest_temp = dest_temp[2].split('/');
                    port = dest_temp[0];
                    channelname = dest_temp[1];
                }
                tmp_relay_item = new relayClass(element['id'], element['SourceUrl']
                , port, dest_name,element['ChannelNumber'],element['Name'],element['Description']);
                relayList[index] = tmp_relay_item;
                var append_str = '';
                append_str += '<tr>';
                append_str += '<td style="text-align:center">' + (index + 1) + '</td>';
                append_str += '<td>' + element['SourceUrl'] + '</td>';
                append_str += '<td>' + element['Dest'] + '</td>';
                append_str += '<td>' + createobj.GetRelayStatusStr(element['Status']) + '</td>';
                append_str += '<td>' + element['ChannelNumber'] + '</td>';
                append_str += '<td>' + element['Name'] + '</td>';
                append_str += '<td>' + element['Description'] + '</td>';
                append_str += '<td>';
                append_str += '<a href="#" class="btn-light delete" id="' + index + '">Delete</a>';
                if (port !== '')
                    append_str += '<a href="#" style="margin-left:10px" class="btn-light resume" id="' + index + '">Resume</a>';
                append_str += '</td>';
                append_str += '</tr>';
                table_relay.append(append_str);
            });
        };
        createobj.GetRelayStatusStr = function(sStatus){
            iStatus = parseInt(sStatus);
            switch(iStatus)
            {
                case 0:
                    return 'Not Ready';
                    break;
                case 1:
                    return 'Ready';
                    break;
                case 2:
                    return 'Initializing';                    
                    break;
                defalue:
                    return 'Unknow('+sStatus + ')';
            }
        };
        createobj.EmptyIPDiv = function() {
            ip_field.empty();
        };
        createobj.appendIPDiv = function(ip_list) {
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

            $.each(ip_list, function(index, element) {
                switch (index) {
                    case 'IP':
                        $.each(element, function(ipindex, ipelement) {
                            tmp_bol_marge = true;
                            tmp_ip = ipelement['ip'];
                            tmp_mask = ipelement['mask'];
                            tmp_ip_displayidex = ipindex + 1;
                            tmp_ip_item = new IPClass(ipindex, 'NIC' + tmp_ip_displayidex, ipelement['name'], tmp_ip, tmp_mask);
                            IPList[ipindex] = tmp_ip_item;
                            if (ipindex === 0)
                                tmp_bol_marge = false;
                            tmp_ip_html = createobj.CreateIPHtml(ipindex, 'NIC' + tmp_ip_displayidex, tmp_ip, tmp_mask, tmp_bol_marge);
                            ip_field.append(tmp_ip_html);
                        });
                        break;
                    case 'Gateway':
                        $.each(element, function(gatewayindex, gatewayelement) {
                            tmp_ip = gatewayelement['ip'];
                            tmp_gateway_item = new GatewayClass(gatewayindex, tmp_ip, gatewayelement['bindport']);
                            GatewayList[gatewayindex] = tmp_gateway_item;
                            tmp_ip_html = createobj.CreateGatewayHtml(gatewayindex, tmp_ip, gatewayelement['bindport']);
                            ip_field.append(tmp_ip_html);
                            return false;
                        });
                        break;
                    case 'DNS':
                        $.each(element, function(dnsindex, dnselement) {
                            tmp_ip = dnselement['ip'];
                            tmp_dns_item = new DNSClass(dnsindex, tmp_ip);
                            DNSList[dnsindex] = tmp_dns_item;
                            tmp_dns_html = createobj.CreateDNSHtml(dnsindex, tmp_ip);
                            ip_field.append(tmp_dns_html);
                            return false;
                        });
                        break;
                }
            });
        };
        createobj.CreateIPHtml = function(id, displayname, ip, mask, bmarge) {
            var rtnhtml = '<fieldset ';
            if (bmarge)
                rtnhtml += 'style="margin-top:10px"';
            rtnhtml += '><legend style="">' + displayname + '</legend><div class="div_fieldcontent">IP : <input id="IP' + id + '" type="text" class="iptext" value="' + ip + '"><br><br>Mask : <input class="iptext" id="IPMask' + id + '" type="text" value="' + mask + '"><br></div></fieldset>';
            return rtnhtml;
        };
        createobj.CreateGatewayHtml = function(id, ip, bindport) {
            var rtnhtml = '<fieldset ';
            rtnhtml += 'style="margin-top:10px"';
            rtnhtml += '><legend>Gateway</legend><div class="div_fieldcontent">IP : <input id="Gateway' + id + '" type="text" class="iptext" value="' + ip + '"><br><br>';
            rtnhtml += 'Bind NIC Port : <select id="GatewaySelect' + id + '">';
            $.each(IPList, function(ipindex, ipelement) {
                if (bindport === '' && ipindex === 0) {
                    rtnhtml += '<option value="' + ipelement['name'] + '" selected=true>' + ipelement['displayname'] + '</option>';
                } else if (bindport === ipelement['name']) {
                    rtnhtml += '<option value="' + ipelement['name'] + '" selected=true>' + ipelement['displayname'] + '</option>';
                } else
                    rtnhtml += '<option value="' + ipelement['name'] + '">' + ipelement['displayname'] + '</option>';
            });
            rtnhtml += '<br></div><fieldset>';
            return rtnhtml;
        };        
        createobj.CreateDNSHtml = function(id, ip) {
            var rtnhtml = '<fieldset ';
            rtnhtml += 'style="margin-top:10px"';
            rtnhtml += '><legend>DNS</legend><div class="div_fieldcontent">IP : <input id="DNS' + id + '" type="text" class="iptext" value="' + ip + '"><br></div</fieldset>';
            return rtnhtml;
        };        
        createobj.EmptyMassEntryResultTable = function(){
            Table_Result_Mass_Entry.find("tr:gt(0)").remove();
        };
        createobj.AppendMassEntryResultTable = function(InputRow,InputResult){
            var sAppend = '';
            sAppend += '<tr>';
            sAppend += '<td>' + InputRow + '</td>';
            sAppend += '<td>' + InputResult + '</td>';           
            sAppend += '</tr>';
            Table_Result_Mass_Entry.append(sAppend);
        };
        createobj.blockPage = function() {
            $.blockUI();
        };
        createobj.blockPageMsg = function(msg) {
            msg = '<h2>' + msg + '</h2>';
            $.blockUI({
                message: msg,
                css: {
                    padding: 0,
                    margin: 0,
                    width: '20%',
                    top: '40%',
                    left: '35%',
                    textAlign: 'center',
                    color: '#000',
                    border: '3px solid #aaa',
                    backgroundColor: '#fff',
                    cursor: 'wait'
                }
            });
        };
        createobj.stopPage = function() {
            $(document).ajaxStop($.unblockUI);
        };
        return createobj;
    }
};

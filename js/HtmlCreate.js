var CreateHtml = {
    createNew: function() {                
        var table_relay = $('#table_relay');
        var table_log = $('#table_log');
        var ip_field = $('#div_ip_field');
        var source_area = $('#UrlArea');
        var modify_source_area = $('#ModifySourceArea');
        var Table_Result_Mass_Entry = $('#MassEntryResulTable');
        var createobj = {};
        createobj.InitWaitDialog = function(){
            $( "#dialog_wait" ).dialog({
                    title: "",
                    modal: true,
                    resizable: false,
                    draggable: false,
                    closeOnEscape: false,
                    autoOpen: false,
                    dialogClass: "no-close",
                    height:140,
                    width:350               
            });           
            $(".ui-dialog-titlebar").hide();
        };
        createobj.clearTable = function() {
            table_relay.find("tr:gt(0)").remove();
        };
        createobj.clearLogTable = function() {
            table_log.find("tr:gt(0)").remove();
        };
        createobj.appendTable = function(relay_list) {
            var tmp_relay_item;
            var dest_temp;
            var port;
            var dest_name;
            var atmpSourceUrl;
            var otmpSourceUrl;
            var i = 1;
            relayList = [];
            $.each(relay_list, function(relayindex, relayelement) {               
                dest_temp = relayelement['dest'].split(':');
                port = '';
                dest_name = '';
                if (typeof(dest_temp[2]) !== 'undefined') {
                    dest_temp = dest_temp[2].split('/');
                    port = dest_temp[0];
                    dest_name = dest_temp[1];
                }
                atmpSourceUrl = [];
                $.each(relayelement['Source'],function(sourceindex,sourceelement){
                    otmpSourceUrl = new relaySourceClass(sourceelement['idSource'],sourceelement['state']
                    ,sourceelement['urlSource'],sourceelement['prior']);
                    atmpSourceUrl[sourceindex] = otmpSourceUrl;
                });
                tmp_relay_item = new relayClass(relayelement['idChannel'], atmpSourceUrl
                , port, dest_name,relayelement['numChannel'],relayelement['nameChannel']
                ,relayelement['descChannel'],relayelement['dest'],relayelement['status']);
                relayList[relayelement['idChannel']] = tmp_relay_item;
                var append_str = '';
                var sourceurl = atmpSourceUrl.length > 0 ? atmpSourceUrl[0]['url'] : ''; 
                append_str = CreateRelayHtml(i,sourceurl,tmp_relay_item);
                ++i;
                table_relay.append(append_str);
            });
        };
        createobj.appendTablebyList = function() {
            var i = 1;
            for(var key in relayList){ 
                var element = relayList[key];
                var append_str = '';
                var sourceurl = element['source'].length > 0 ? element['source'][0]['url'] : '' ; 
                append_str = CreateRelayHtml(i  ,sourceurl,element);
                ++i;
                table_relay.append(append_str);
            };
        };
        createobj.GetTooltip = function(index){
            var ListSource = relayList[index]['source'];
            var TooltipHtml = '';
            TooltipHtml += '<div style="width:460px">';
            for(var key in ListSource){                     
                TooltipHtml += '<label style="display:inline-block;width:80px">Order ' + ListSource[key]['prior'] + '</label>' ;
                TooltipHtml += '<label class="TooltipURL">' + ListSource[key]['url'] + '</label>';
                TooltipHtml += '<label style="display:inline-block">' + GetSourceStatusStr(ListSource[key]['flag']) + '</label>'; 
                TooltipHtml += '<br>';                
            };
            TooltipHtml += '</div>';
            return TooltipHtml;
        };
        function CreateRelayHtml(index,sourceurl,element){
            var append_str = '';
            append_str += '<tr id="tr' + element['id'] +'">';
            append_str += '<td style="text-align:center">' + index + '</td>';              
            append_str += '<td><div class="wrapword">' + sourceurl;
            append_str += '<img src="/img/log.png" style="margin-left:5px" height="20" width="20" align="center" class="DetailSource" id="' + element['id'] + '">';
            append_str += '<div></td>';
            append_str += '<td style="text-align:right">' + element['source'].length + '</td>';  
            append_str += '<td>' + element['fulldest'] + '</td>';
            append_str += '<td>' + createobj.GetRelayStatusStr(element['status']) + '</td>';
            append_str += '<td style="text-align:right">' + element['channelnumber'] + '</td>';
            append_str += '<td>' + element['name'] + '</td>';
            append_str += '<td>' + element['description'] + '</td>';
            append_str += '<td>';
            append_str += '<a href="#" class="btn-light delete" id="' + element['id'] + '">Delete</a>';
            append_str += '<a href="#" style="margin-left:10px" class="btn-light stop" id="' + element['id'] + '">Stop</a>';
            if (element['port'] !== '')
                append_str += '<a href="#" style="margin-left:10px" class="btn-light resume" id="' + element['id'] + '">Resume</a>';
            append_str += '<a href="#" style="margin-top:5px" class="btn-light ModifySource" id="' + element['id'] + '">Edit Source</a>';
            append_str += '<a href="#" style="margin-top:5px;margin-left:10px" class="btn-light ModifyChannel" id="' + element['id'] + '">Edit Channel</a>';
            append_str += '</td>';
            append_str += '</tr>';
            return append_str;
        };
        createobj.CreateTdSourceText = function(ChannelID){
            var atmpSourceUrl=relayList[ChannelID]['source'];
            var sourceurl = atmpSourceUrl.length > 0 ? atmpSourceUrl[0]['url'] : ''; 
            var append_str = '';
            append_str += '<div class="wrapword">' + sourceurl;
            append_str += '<img src="/img/log.png" style="margin-left:5px" height="20" width="20" align="center" class="DetailSource" id="' + ChannelID + '">';
            append_str += '</div>';
            return append_str;
        };        
        createobj.EmptySoucreArea = function(){
            source_area.empty();
        };
        createobj.EmptyModifySourceArea = function(){
            modify_source_area.empty();
        };
        createobj.AppendSourceArea = function(source_url_list){
            var max_create_count =4;
            var append_str = '';
            var i =0;
            if(source_url_list.length === 0){
                append_str += '<div>';
                append_str += '<label class="LabelRelayHead">Order 1 : </label>';
                append_str += '<input id="AddSourceUrl" class="InputRelay" value="" type="text">';
                append_str += '<a href="#" class="btn-light AddSource" style="margin-left:5px">Add</a>';
                append_str += '</div>';
            }
            else{
//                $.each(source_url_list,function(index,element){
                for(var key in source_url_list){ 
                    var element = source_url_list[key];
                    switch(i)
                    {
                        case 0:
                            append_str += '<div>';
                            append_str += '<label class="LabelRelayHead">Order ' + (i+1) + ': </label>';                            
                            append_str += '<label class="LabelSource">' + element['url'] + '</label>';                            
                            append_str += '<a  href="#" class="btn-light DeleteSource" style="margin-left:5px" id="' + key + '">Delete</a>';
                            if(source_url_list.length >= 2)                                                                                            
                                append_str += '<a  href="#" class="btn-light DownSource" style="margin-left:5px" id="' + key +'">Down</a>';                                                            
                            append_str += '</div>';                            
                            break;
                        default:
                            append_str += '<div style="margin-top: 5px">';
                            append_str += '<label class="LabelRelayHead">Order ' + (i+1) + ': </label>';                             
                            append_str += '<label class="LabelSource">' + element['url'] + '</label>';
                            append_str += '<a  href="#" class="btn-light DeleteSource" style="margin-left:5px" id="' + key +'">Delete</a>';
                            if(i < source_url_list.length -1)
                            {                                
                                append_str += '<a  href="#" class="btn-light UpSource" style="margin-left:5px" id="' + key +'">Up</a>';
                                append_str += '<a  href="#" class="btn-light DownSource" style="margin-left:5px"id="' + key +'">Down</a>';
                            }
                            else
                                append_str += '<a  href="#" class="btn-light UpSource" style="margin-left:5px" id="' + key +'">Up</a>';
                            append_str += '</div>';
                            break;
                    }
                    ++i;
                };                
                if(source_url_list.length < max_create_count){
                    append_str += '<div style="margin-top: 5px">';
                    append_str += '<label class="LabelRelayHead">Order ' + (i+1) + ': </label>';;
                    append_str += '<input id="AddSourceUrl" class="InputRelay" value="" type="text">';
                    append_str += '<a  href="#" class="btn-light AddSource" style="margin-left:5px">Add</a>';
                    append_str += '</div>';
                }
            }     
            source_area.append(append_str);
        };
        createobj.AppendModfiySourceArea = function(source_url_list){
            var max_create_count =4;
            var append_str = '';
            var i =0;
            if(source_url_list.length === 0){
                append_str += '<div>';
                append_str += '<label class="LabelRelayHead">Order 1 : </label>';
                append_str += '<input id="ModifyAddSourceUrlAddSourceUrl" class="InputRelay" value="" type="text">';
                append_str += '<a href="#" class="btn-light ModifyAddSource" style="margin-left:5px">Add</a>';
                append_str += '</div>';
            }
            else{
//                $.each(source_url_list,function(index,element){
                for(var key in source_url_list){ 
                    var element = source_url_list[key];
                    switch(i)
                    {
                        case 0:
                            append_str += '<div>';
                            append_str += '<label class="LabelRelayHead">Order ' + (i+1) + ': </label>';                            
                            append_str += '<label class="LabelSource">' + element['url'] + '</label>';                            
                            if(source_url_list.length >= 2){
                                append_str += '<a  href="#" class="btn-light ModifyDeleteSource" style="margin-left:5px" id="' + key + '">Delete</a>';
                                append_str += '<a  href="#" class="btn-light ModifyDownSource" style="margin-left:5px" id="' + key +'">Down</a>';                                                            
                            }
                            append_str += '</div>';                            
                            break;
                        default:
                            append_str += '<div style="margin-top: 5px">';
                            append_str += '<label class="LabelRelayHead">Order ' + (i+1) + ': </label>';                             
                            append_str += '<label class="LabelSource">' + element['url'] + '</label>';
                            append_str += '<a  href="#" class="btn-light ModifyDeleteSource" style="margin-left:5px" id="' + key +'">Delete</a>';
                            if(i < source_url_list.length -1)
                            {                                
                                append_str += '<a  href="#" class="btn-light ModifyUpSource" style="margin-left:5px" id="' + key +'">Up</a>';
                                append_str += '<a  href="#" class="btn-light ModifyDownSource" style="margin-left:5px"id="' + key +'">Down</a>';
                            }
                            else
                                append_str += '<a  href="#" class="btn-light ModifyUpSource" style="margin-left:5px" id="' + key +'">Up</a>';
                            append_str += '</div>';
                            break;
                    }
                    ++i;
                };                
                if(source_url_list.length < max_create_count){
                    append_str += '<div style="margin-top: 5px">';
                    append_str += '<label class="LabelRelayHead">Order ' + (i+1) + ': </label>';;
                    append_str += '<input id="ModifyAddSourceUrl" class="InputRelay" value="" type="text">';
                    append_str += '<a  href="#" class="btn-light ModifyAddSource" style="margin-left:5px">Add</a>';
                    append_str += '</div>';
                }
            }     
            modify_source_area.append(append_str);
        };
        createobj.appendLogTable = function(log_list) {
            var tmp_log_item;
            var i =1;
            LogList = [];
            for(var key in log_list) {  
                var loglement = log_list[key];
                tmp_log_item = new LogClass(loglement['LogType'], loglement['SouceURL'], loglement['Dest'],
                loglement['ChannelName'],loglement['CreateTime'],loglement['Description']);
                LogList[key]=tmp_log_item;
                var append_str = '';
                append_str += '<tr>';
                append_str += '<td style="text-align:center">' + i + '</td>';
                append_str += '<td>' + loglement['LogType'] + '</td>';
                append_str += '<td>' + loglement['SouceURL'] + '</td>';
                append_str += '<td>' + loglement['Dest'] + '</td>';
                append_str += '<td>' + loglement['ChannelName'] + '</td>';
                append_str += '<td>' + loglement['Description'] + '</td>';
                append_str += '<td>' + loglement['CreateTime'] + '</td>';                                
                append_str += '</tr>';
                ++i;
                table_log.append(append_str);
            };
        };
        createobj.appendLogTablebyList = function() {
            var i =1;
            for(var key in LogList) {    
                var element = LogList[key];
                var append_str = '';
                append_str += '<tr>';
                append_str += '<td style="text-align:center">' + i + '</td>';
                append_str += '<td>' + element['type'] + '</td>';
                append_str += '<td>' + element['source'] + '</td>';
                append_str += '<td>' + element['fulldest'] + '</td>';
                append_str += '<td>' + element['name'] + '</td>';
                append_str += '<td>' + element['description'] + '</td>';
                append_str += '<td>' + element['time'] + '</td>';       
                append_str += '</tr>';
                ++i;
                table_log.append(append_str);
            };
        };
        createobj.GetRelayStatusStr = function(sStatus){
            var iStatus = parseInt(sStatus);
            switch(iStatus)
            {
                case -1:
                    return 'Preparing';
                    break;
                case 0:
                    return 'Not Ready';
                    break;
                case 1:
                    return 'Ready';
                    break;
                case 2:
                    return 'Initializing';                    
                    break;
                case 3 :
                    return 'Stop';                    
                    break;
                default:
                    return 'Unknow('+sStatus + ')';
            }
        };
        function GetSourceStatusStr(sStatus){
            var iStatus = parseInt(sStatus);
            switch(iStatus)
            {
                case -1:
                    return 'Offline';
                    break;
                case 0:
                    return 'Standby';
                    break;
                case 1:
                    return 'Initializing';                    
                    break;
                case 2 :
                    return 'Active';                    
                    break;
                default:
                    return 'Unknow('+sStatus + ')';
            }
        }
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
            rtnhtml += '><legend style="">' + displayname 
                    + '</legend><div class="div_fieldcontent"><label class="LabelIPHead">IP : </label><input id="IP' + id + '" type="text" class="iptext" value="' + ip 
                    + '"><br><br><label class="LabelIPHead">Mask : </label><input class="iptext" id="IPMask' + id + '" type="text" value="' + mask + '"><br></div></fieldset>';
            return rtnhtml;
        };
        createobj.CreateGatewayHtml = function(id, ip, bindport) {
            var rtnhtml = '<fieldset ';
            rtnhtml += 'style="margin-top:10px"';
            rtnhtml += '><legend>Gateway</legend><div class="div_fieldcontent"><label class="LabelIPHead">IP : </label><input id="Gateway' + id + '" type="text" class="iptext" value="' + ip + '"><br><br>';
            rtnhtml += '<label class="LabelIPHead">Bind NIC Port : </label><select id="GatewaySelect' + id + '">';
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
            rtnhtml += '><legend>DNS</legend><div class="div_fieldcontent"><label class="LabelIPHead">IP : </label><input id="DNS' + id + '" type="text" class="iptext" value="' + ip + '"><br></div</fieldset>';
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
            $('#dialog_msg').text('Please Wait...');
            $( "#dialog_wait" ).dialog('open');
//            $.blockUI();
        };
        createobj.blockPageMsg = function(msg) {
            $('#dialog_msg').text(msg);
            $("#dialog_wait" ).dialog('open');
        };
        createobj.ChangeblockMsg = function(msg) {
            $('#dialog_msg').text(msg);            
        };
        createobj.stopPage = function() {
            $( "#dialog_wait" ).dialog('close');
//            $(document).ajaxStop($.unblockUI);
        };
        createobj.HideAllOption = function(){
            $.each(DivAllOption,function(index,element){
               $(element[0]).hide(); 
               $(element[1]).removeClass('OptionSelect');
               $(element[1]).css('background-image','');
               $(element[1]).addClass('OptionUnSelect');
            });
        };
        createobj.ShowOption = function(Option){
            $(Option[0]).show();            
            $(Option[1]).removeClass('OptionUnSelect');
            $(Option[1]).css('background-image','');
            $(Option[1]).addClass('OptionSelect');
        };
        return createobj;
    }
};

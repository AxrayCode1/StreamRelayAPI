var UIRelayControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;
        var sMassCreateStr = '';
        var delete_class = '.delete';
        var resume_class = '.resume';
        var stop_class = '.stop';
        var modify_source_class = '.ModifySource';
        var modify_channel_class = '.ModifyChannel';
        var addsource_class = '.AddSource';
        var deletesource_class = '.DeleteSource';
        var upsource_class = '.UpSource';
        var downsource_class = '.DownSource';
        var modify_addsource_class = '.ModifyAddSource';
        var modify_deletesource_class = '.ModifyDeleteSource';
        var modify_upsource_class = '.ModifyUpSource';
        var modify_downsource_class = '.ModifyDownSource';
        var oUIRelayContorl={};
        var sPortCheck = '';
        var sNameCheck = '';
        var sChannelNumberCheck = '';
        var oError = {};     
        var PollingTime = 10000;
        var iModifyChannelID;
        var RelayColumn = {
            ChannelNumber:1,
            ChannelName:2,
            Source: 3,
            SourceQtp: 4,
            Destination: 5,
            Status: 6,            
            Description:7           
        };
        var ChannelVerifyAction = {
            CreateAction:1,
            ModifyAction:2
        };
        var CreateSourceList;
        var ModifySourceList;
        oUIRelayContorl.Init = function(){   
//            $("#demo_drop1").jui_dropdown({
//            launcher_id: 'launcher1',
//            launcher_container_id: 'launcher1_container',
//            menu_id: 'menu1',
//            containerClass: 'container1',
//            menuClass: 'menu1',
//            onSelect: function(event, data) {
//              $("#result").text('index: ' + data.index + ' (id: ' + data.id + ')');
//            }
//            });
//            $("#demo_drop2").jui_dropdown({
//            launcher_id: 'launcher2',
//            launcher_container_id: 'launcher2_container',
//            menu_id: 'menu2',
//            containerClass: 'container2',
//            menuClass: 'menu2',
//            onSelect: function(event, data) {
//              $("#result").text('index: ' + data.index + ' (id: ' + data.id + ')');
//            }
//            });
$('.RealyEdit').on('show', function(event, dropdownData) {
    alert($(this).attr('id'));
});
            CreateSourceList = [];
            oError = ErrorHandle.createNew();            
            oHtml.HideAllOption();
            oHtml.ShowOption(DivRelay);
            oHtml.EmptySoucreArea();
            oHtml.AppendSourceArea(CreateSourceList);
            RebindAllControlSourceEvent();
            oUIRelayContorl.InitMassEntryDialog();
            InitAddChannelDialog();
            InitModifySourceDialog();
            InitModifyChannelDialog();
            oUIRelayContorl.GetRelayList();
            $('#btn_add').click(function(){
                $( "#modal_create_channel_content" ).dialog('open');
            });
            $('#btn_refresh').click(function() {
                oUIRelayContorl.GetRelayList();
            });
            $('#btn_create').click(function(event) {    
                event.preventDefault();
                oUIRelayContorl.CreateRelayAction();                       
            });            
            $('#rl').click(function() {
                oHtml.HideAllOption();
                oHtml.ShowOption(DivRelay);
                oUIRelayContorl.GetRelayList();
            });            
            $('#file_mass_create').change(function(event){                
                $('#uploadFile').val($(this).val());
                oUIRelayContorl.FileBindChangeEvent(event);
            });
            $('#btn_mass_create').click(function() {                        
                oUIRelayContorl.MassFileCreateAction();        
            });
            $('.relayth').click(function(){
                var th = $(this);
                var eSortType = SortType.String;
                var eSortDirection = SortDirection.ASC;
                if(th.attr('id') === "channelnumber" || th.attr('id') === "sourcecount" || th.attr('id') === "status")
                    eSortType = SortType.Num;
                if(th.hasClass('asc')){
                    th.removeClass('asc');
                    th.addClass('desc');
                    eSortDirection = SortDirection.Desc;
                }
                else{
                    th.removeClass('desc');
                    th.addClass('asc');
                    eSortDirection = SortDirection.ASC;
                }
                SortRelayList(eSortDirection,eSortType,th.attr('id'));                
                oHtml.clearTable();
                oHtml.appendTablebyList();
                RebindAllRelayEvent(); 
                ReCreateRelayList();
                $('.DetailSource').tooltip({    
                    items: "img ",
                    content: function() {  
                         var tooltip = oHtml.GetTooltip($(this).attr('id'));
                         return tooltip;
                    }
                });
            });
            PollingRelayList(true);
        };
        
        function SortRelayList(eSortDirection,eSortType,sSortVariable)
        {                    
            switch ( eSortDirection )
            {
                case SortDirection.ASC:
                    switch(eSortType)
                    {
                        case SortType.Num:
                            relayList.sort(function(a,b)
                            {	
                                if(sSortVariable === 'sourcecount')
                                    return (a['source'].length - b['source'].length);
                                else
                                    return (a[sSortVariable] - b[sSortVariable]);
                            });
                            break;
                        case SortType.String:
                            relayList.sort( function(a,b)
                            {
                                if(sSortVariable === 'source')
                                    return a[sSortVariable][0]['url'].toUpperCase() < b[sSortVariable][0]['url'].toUpperCase() ? -1 : ( a[sSortVariable][0]['url'].toUpperCase() > b[sSortVariable][0]['url'].toUpperCase() ? 1 : 0 );
                                else
                                    return a[sSortVariable].toUpperCase() < b[sSortVariable].toUpperCase() ? -1 : ( a[sSortVariable].toUpperCase() > b[sSortVariable].toUpperCase() ? 1 : 0 );
                            });
                            break;
                    }
                    break;

                case SortDirection.Desc:
                    switch(eSortType)
                    {
                        case SortType.Num:
                            relayList.sort( function(a,b)
                            {
                                if(sSortVariable === 'sourcecount')
                                    return (b['source'].length - a['source'].length);
                                else                                    
                                    return (b[sSortVariable] - a[sSortVariable]);
                            });
                            break;
                        case SortType.String:
                            relayList.sort( function(a,b)
                            {
                                if(sSortVariable === 'source')
                                    return a[sSortVariable][0]['url'].toUpperCase() > b[sSortVariable][0]['url'].toUpperCase() ? -1 : ( a[sSortVariable][0]['url'].toUpperCase() < b[sSortVariable][0]['url'].toUpperCase() ? 1 : 0 );
                                else
                                    return a[sSortVariable].toUpperCase() > b[sSortVariable].toUpperCase() ? -1 : ( a[sSortVariable].toUpperCase() < b[sSortVariable].toUpperCase() ? 1 : 0 );
                            });
                            break;
                    }
                    break;               
            }          
        }     
        
        function ReCreateRelayList()
        {
            var TmpRelayList = [];
            for(var index in relayList)
            {
                TmpRelayList[relayList[index]['id']] = relayList[index];                
            }
            relayList = [];
            relayList = TmpRelayList;
        }
        
        oUIRelayContorl.InitMassEntryDialog = function(){
            $( "#modal_update_progress_content" ).dialog({
                    title: "Mass Entry",
                    modal: true,
                    resizable: false,
                    draggable: false,
                    closeOnEscape: false,
                    autoOpen: false,
                    dialogClass: "no-close",
                    height:450,
                    width:560               
            });    
            $( "#progressbar" ).progressbar({                
                    value:0,
                    max:100,    
                    complete: function() {
                        $('#closedialog').show();                           
                    }
            });      
            $('#closedialog').click(function () {	
                sMassCreateStr = '';
                $( "#modal_update_progress_content" ).dialog('close');
                oUIRelayContorl.GetRelayList();
            });
        };
                
        function InitModifySourceDialog(){
            $( "#modal_modify_source_content" ).dialog({
                    title: "Edit Source",
                    modal: true,
                    resizable: false,
                    draggable: false,
                    closeOnEscape: false,
                    autoOpen: false,
                    dialogClass: "no-close",
                    height:400,
                    width:650               
            });                
            $('#closemodifydialog').click(function (event) {
                event.preventDefault();
                $( "#modal_modify_source_content" ).dialog('close');
//                oUIRelayContorl.GetRelayList();
                    setTimeout(function(){GetRelayNoRefresh();}, 200);
            });
        };        
        
        function InitModifyChannelDialog(){
            $( "#modal_modify_channel_content" ).dialog({
                    title: "Edit Channel",
                    modal: true,
                    resizable: false,
                    draggable: false,
                    closeOnEscape: false,
                    autoOpen: false,
                    dialogClass: "no-close",
                    height:400,
                    width:600               
            });     
            $('#btn_modify_channel').click(function (event) {	
                event.preventDefault();
                ModifyChannel();
            });
            $('#btn_close_modify_channel').click(function (event) {
                 event.preventDefault();
                $( "#modal_modify_channel_content" ).dialog('close');
                setTimeout(function(){GetRelayNoRefresh();}, 200);
            });
        };
             
        function InitAddChannelDialog(){
            $( "#modal_create_channel_content" ).dialog({
                    title: "Add",
                    modal: true,
                    resizable: false,
                    draggable: false,
                    closeOnEscape: false,
                    autoOpen: false,
                    dialogClass: "no-close",
                    height:550,
                    width:680               
            });                 
//            $('#btn_close_modify_channel').click(function () {	                
//                $( "#modal_modify_channel_content" ).dialog('close');
//                oUIRelayContorl.GetRelayList();
//            });
        };
        
        oUIRelayContorl.CheckNum = function(str){
            return str.match(/^[0-9]*$/);
        };
        
        function RebindAllControlSourceEvent(){
            RebindAddSourceEvent();
            RebindDeleteSourceEvent();
            RebindUpSourceEvent();
            RebindDownSourceEvent();
        };
        
        function RebindAddSourceEvent() {
            $(addsource_class).click(function(event) {
                event.preventDefault();
                var sSourceUrl = $('#AddSourceUrl').val();  
                var oTmpSourceUrl;
                if (sSourceUrl.length === 0) {
                    alert("Error : Please input value in Source.");
                    return;
                };     
                if (!oUIRelayContorl.VerifyRelayInput(sSourceUrl)) {
                    alert("Error : Can't input whitespace and ',' in Source.");
                    return; 
                }
                oTmpSourceUrl = new relaySourceClass(0,0,sSourceUrl,0);
                CreateSourceList.push(oTmpSourceUrl);
                oHtml.EmptySoucreArea();
                oHtml.AppendSourceArea(CreateSourceList);
                RebindAllControlSourceEvent();
            });
        };
        
        function RebindDeleteSourceEvent() {
            $(deletesource_class).click(function(event) {
                event.preventDefault();
                var index = parseInt($(this).attr('id'));
                CreateSourceList.splice(index,1);
                oHtml.EmptySoucreArea();
                oHtml.AppendSourceArea(CreateSourceList);
                RebindAllControlSourceEvent();                
            });
        };
               
        function RebindUpSourceEvent() {
            $(upsource_class).click(function(event) {
                event.preventDefault();
                var index = parseInt($(this).attr('id'));                                
                var oTmpNowItem = CreateSourceList[index];
                var oTmpUpItem = CreateSourceList[index - 1];
                CreateSourceList[index - 1] = oTmpNowItem;
                CreateSourceList[index] = oTmpUpItem;
                oHtml.EmptySoucreArea();
                oHtml.AppendSourceArea(CreateSourceList);
                RebindAllControlSourceEvent();
            });
        };
        
        function RebindDownSourceEvent() {
            $(downsource_class).click(function(event) {
                event.preventDefault();
                var index = parseInt($(this).attr('id'));                                
                var oTmpNowItem = CreateSourceList[index];
                var oTmpUpItem = CreateSourceList[index + 1];
                CreateSourceList[index + 1] = oTmpNowItem;
                CreateSourceList[index] = oTmpUpItem;
                oHtml.EmptySoucreArea();
                oHtml.AppendSourceArea(CreateSourceList);
                RebindAllControlSourceEvent();
            });
        };               
        
        function GetRelayNoRefresh(){
            oHtml.blockPage();
            var request = oRelayAjax.getRelayList();
            CallBackPollingGetRelay(request,false);
        }
        
        function PollingRelayList(bIsPolling){
            var request = oRelayAjax.getRelayList();
            CallBackPollingGetRelay(request,bIsPolling);
        }
        
        function CallBackPollingGetRelay(request,bIsPolling){            
            request.done(function(msg, statustext, jqxhr) {
                ChangeRelayContentNoFresh(msg);
                if(bIsPolling)
                    setTimeout(function(){PollingRelayList();}, PollingTime);
                else
                    oHtml.stopPage();
            });
            request.fail(function(jqxhr, textStatus) {
                if(bIsPolling)
                    setTimeout(function(){PollingRelayList();}, PollingTime);
                else{
                    oHtml.stopPage();
                    oError.CheckAuth(jqxhr.status,ActionStatus.GetRelay);
                }                    
            });
        }
                
        function ChangeRelayContentNoFresh(msg)
        {
            var otmpSourceUrl;
            $.each(msg, function(relayindex, relayelement) {     
               if(typeof(relayList[relayelement['idChannel']]) !== 'undefined'){
                   if(relayelement['status'] !== relayList[relayelement['idChannel']]['status']){                                                      
                       relayList[relayelement['idChannel']]['status'] = relayelement['status'];
                       $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.Status).text(oHtml.GetRelayStatusStr(relayelement['status']));
                   };
                   if(relayelement['numChannel'] !== relayList[relayelement['idChannel']]['channelnumber']){                                                      
                       relayList[relayelement['idChannel']]['channelnumber'] = relayelement['numChannel'];
                       $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.ChannelNumber).text(relayelement['numChannel']);
                   };
                   if(relayelement['nameChannel'] !== relayList[relayelement['idChannel']]['name']){                                                      
                       relayList[relayelement['idChannel']]['name'] = relayelement['nameChannel'];
                       $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.ChannelName).text(relayelement['nameChannel']);
                   };
                   if(relayelement['dest'] !== relayList[relayelement['idChannel']]['fulldest']){                                                      
                        var dest_temp = relayelement['dest'].split(':');
                        var port = '';
                        var dest_name = '';
                        if (typeof(dest_temp[2]) !== 'undefined') {
                            dest_temp = dest_temp[2].split('/');
                            port = dest_temp[0];
                            dest_name = dest_temp[1];
                        }
                        relayList[relayelement['idChannel']]['destname'] = dest_name;
                        relayList[relayelement['idChannel']]['port'] = port;
                        relayList[relayelement['idChannel']]['fulldest'] = relayelement['dest'];
                        $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.Destination).text(relayelement['dest']);
                   };
                   if(relayelement['descChannel'] !== relayList[relayelement['idChannel']]['description']){                        
                        relayList[relayelement['idChannel']]['description'] = relayelement['descChannel'];
                        $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.Description).text(relayelement['descChannel']);
                   };
//                        if(relayelement['Source'].length > 0 && relayelement['Source'][0]['urlSource'] !== relayList[relayelement['idChannel']]['source'][0]['url'])
//                        {
                       relayList[relayelement['idChannel']]['source'] = [];
                       $.each(relayelement['Source'],function(sourceindex,sourceelement){
                           otmpSourceUrl = new relaySourceClass(sourceelement['idSource'],sourceelement['state'],sourceelement['urlSource'],sourceelement['prior']);
                           relayList[relayelement['idChannel']]['source'][sourceindex] = otmpSourceUrl;
                       });
                       $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.Source).html(oHtml.CreateTdSourceText(relayelement['idChannel']));
                       $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.SourceQtp).text(relayelement['Source'].length);
//                        };
               }
           });
           $('.DetailSource').tooltip({    
               items: "img ",
               content: function() {  
                   var tooltip = oHtml.GetTooltip($(this).attr('id'));
                   return tooltip;
               }
           });
        }
                
        oUIRelayContorl.GetRelayList = function(){
            oHtml.blockPage();
            var request = oRelayAjax.getRelayList();
            oUIRelayContorl.CallBackGetRelay(request);
        };     
        
        oUIRelayContorl.CallBackGetRelay = function(request){            
            request.done(function(msg, statustext, jqxhr) {
                oHtml.stopPage();                
                oHtml.clearTable();
                oHtml.appendTable(msg);               
                RebindAllRelayEvent(); 
                $('.DetailSource').tooltip({    
                    items: "img ",
                    content: function() {  
                        var tooltip = oHtml.GetTooltip($(this).attr('id'));
                        return tooltip;
                    }
                });
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.GetRelay);
            });
        };
                       
        oUIRelayContorl.CreateRelayAction = function (){
            var flag = true;
            var sSourceUrl = '';
            var iDestPort = $('#Port').val();
            var sDestName = $('#DestinationName').val();
            var iChannelNumber = $('#ChannelNumber').val();
            var sName = $('#Name').val();
            var sDescription = $('#Description').val();                  
            if(CreateSourceList.length === 0){
                alert("Error : Please add least one Source Url.");
                return;
            }
            flag = VerifyRelayInput(sDestName,sName,sDescription,iDestPort,iChannelNumber,ChannelVerifyAction.CreateAction);             
            if (!flag)
                return false;
            iDestPort = parseInt(iDestPort);
            iChannelNumber = parseInt(iChannelNumber);           
            for(var i = 0; i< CreateSourceList.length; i++){ 
                sSourceUrl += '"' +  CreateSourceList[i]['url'] ;
                if(i !== CreateSourceList.length -1)
                    sSourceUrl += '",';
                else
                    sSourceUrl += '"';
            };
            oUIRelayContorl.CreatRelay(iChannelNumber,sName, sDescription, sSourceUrl, iDestPort, sDestName);
        };
        
        function VerifyRelayInput(sDestName,sName,sDescription,iDestPort,iChannelNumber,eChannelVerifyAction){
            if (!oUIRelayContorl.VerifyRelayInput(sDestName)) {
                alert("Error : Can't input whitespace and ',' in Destination Name.");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sName)) {
                alert("Error : Can't input whitespace and ',' in Remark1.");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sDescription)) {
                alert("Error : Can't input whitespace and ',' in Remark2.");
                return false;
            }                                   
            if (iDestPort.length === 0) {
                alert("Error : Please input value in Port.");
                return false;
            };            
            if (!oUIRelayContorl.CheckNum(iDestPort)){
                alert("Error : Port must be integer.");   
                return false;
            };
            
            if (sName.length === 0) {
                alert("Error : Please input value in Name.");
                return false;
            };  
            if (iChannelNumber.length === 0) {
                alert("Error : Please input value in Channel Number.");
                return false;
            };                         
            if (!oUIRelayContorl.CheckNum(iChannelNumber)){
                alert("Error : Channel Number must be integer.");   
                return false;
            };                        
//            $.each(relayList, function(index, element) {   
            for(var key in relayList){ 
                var element = relayList[key];
                switch(eChannelVerifyAction)
                {
                    case ChannelVerifyAction.CreateAction:
                        if (String(iDestPort) === element['port']) {
                            alert("Error : DUPLICATE PORT NUMBER !");
                            return false;
                        }
                        else if(sName === element['name']){
                            alert("Error : DUPLICATE Name !");
                            return false;
                        }   
                        else if(String(iChannelNumber) === String(element['channelnumber'])){
                            alert("Error : DUPLICATE Channel Number !");
                            return false;
                        }
                        break;
                    case ChannelVerifyAction.ModifyAction:                         
                        if (String(iDestPort) !== relayList[iModifyChannelID]['port'] && String(iDestPort) === element['port']) {
                            alert("Error : DUPLICATE PORT NUMBER !");
                            return false;
                        }
                        else if(sName !== relayList[iModifyChannelID]['name'] && sName === element['name']){
                            alert("Error : DUPLICATE Name !");
                            return false;
                        }   
                        else if(String(iChannelNumber) !== String(relayList[iModifyChannelID]['channelnumber']) && String(iChannelNumber) === String(element['channelnumber'])){
                            alert("Error : DUPLICATE Channel Number !");
                            return false;
                        }
                        break;
                }
            };
            return true;
        };
        
        oUIRelayContorl.VerifyRelayInput = function(Input_Data)
        {
            var whitespace = " ";
            var sDot = ",";            
            if (Input_Data.indexOf(whitespace) !== -1 || Input_Data.indexOf(sDot) !== -1)
                return false;
            else
                return true;
        };
        
        oUIRelayContorl.CreatRelay = function(iChannelNumber,sName, sDescription, sSourceUrl, iDestPort, sDestName){
            oHtml.blockPage();
            var request =  oRelayAjax.createRelay(iChannelNumber,sName, sDescription, sSourceUrl, iDestPort, sDestName);
            oUIRelayContorl.CallBackCreateRelay(request);            
        };
        
        oUIRelayContorl.CallBackCreateRelay = function(request)
        {            
            request.done(function(msg, statustext, jqxhr) {                
                setTimeout(function(){oUIRelayContorl.GetRelayList();}, 1000);
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.CreateRelay);
            });
        };

        oUIRelayContorl.FileBindChangeEvent = function(event){  
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                sMassCreateStr = '';
                var filelist = event.target.files;                
                $('#uploadFile').val(filelist[0].name);
                file = filelist[0];    
                var reader = new FileReader();
                reader.onload = function() {
                    sMassCreateStr = reader.result;                    
                };
                reader.readAsText(file);
            }
        };

        oUIRelayContorl.MassFileCreateAction = function () {
            $('#uploadFile').val('');
            $('#file_mass_create').val('');
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                if(sMassCreateStr.length === 0)
                {
                    alert("Please select a file to create.");
                    return false;
                }                
                
                var aMassCreate = sMassCreateStr.trim().split('\n');
                if(aMassCreate.length > 1001)
                {
                    alert("You can olny create 1000 Items at the same time.");
                    return false;
                }
                if(aMassCreate.length > 1)
                    oUIRelayContorl.MassEntryDialog(aMassCreate);
            } 
            else {
                alert('Please Change Your Browser.Your Browser is not support File API.');               
            }
        };
        
        oUIRelayContorl.MassEntryDialog = function(aMassCreateItem)
        {
//            var progressbar = $( "#progressbar" );
            $('#closedialog').hide();
            var progressLabel = $( ".progress-label" ); 
            var iTotalCreate = aMassCreateItem.length - 1;   
            sPortCheck = ",";
            sNameCheck = ",";
            sChannelNumberCheck = ",";
//            $.each(relayList, function(index, element) {     
            for(var key in relayList){ 
                var element = relayList[key];
                sPortCheck += element['port'] + ',';      
                sNameCheck += element['name'] + ',';
                sChannelNumberCheck += element['channelnumber'] + ',';
            };
            progressLabel.text("0/" + iTotalCreate);            
            oHtml.EmptyMassEntryResultTable();
            $( "#progressbar" ).progressbar('option','value',0);
            $( "#progressbar" ).progressbar('option','max',iTotalCreate);
            $( "#modal_update_progress_content" ).dialog('open');
            oUIRelayContorl.MassCreatRelay(1,aMassCreateItem);            
        };        
                
        oUIRelayContorl.MassCreatRelay = function(RowNum,aMassCreateItem){
            var progressLabel = $( ".progress-label" ); 
            if(RowNum > aMassCreateItem.length - 1)            
                return false;
            $( "#progressbar" ).progressbar( "option","value", RowNum);   
            progressLabel.text( RowNum + '/' + $( "#progressbar" ).progressbar( "option", "max" ) );
            var aCreateInput = aMassCreateItem[RowNum].trim().split(/\s+/);
            if(oUIRelayContorl.MassEntryVerifyInput(RowNum,aCreateInput))
            {
                var sSourceUrl = '';
                var aSourceUrl = aCreateInput[0].trim().split(',');
                for(var i = 0; i< aSourceUrl.length; i++){ 
                    sSourceUrl += '"' +  aSourceUrl[i] ;
                    if(i !== aSourceUrl.length -1)
                        sSourceUrl += '",';
                    else
                        sSourceUrl += '"';
                };
                var request =  oRelayAjax.createRelay(aCreateInput[3], aCreateInput[4], aCreateInput[5], sSourceUrl, aCreateInput[1], aCreateInput[2]);
                oUIRelayContorl.CallBackMassCreateRelay(RowNum,aMassCreateItem,request);                
            }
            else
            {
                ++RowNum;
                oUIRelayContorl.MassCreatRelay(RowNum,aMassCreateItem);
            }
        };
        
        oUIRelayContorl.CallBackMassCreateRelay = function(RowNum,aMassCreateItem,request)
        {            
            request.done(function(msg, statustext, jqxhr) {                                
                ++RowNum;
                oUIRelayContorl.MassCreatRelay(RowNum,aMassCreateItem);
            });
            request.fail(function(jqxhr, textStatus) {                
                oError.CheckAuth(jqxhr.status,ActionStatus.CreateRelay);
            });
        };        
        
        oUIRelayContorl.MassEntryVerifyInput = function(RowNum,aCreateInput)
        {                                   
            var RowNum = RowNum + 1;
             var max_create_count =4;
            if(aCreateInput.length !== 6)
            {
                oHtml.AppendMassEntryResultTable(RowNum,'Number of Input Fields is not match.');
                return false;
            }
            if (aCreateInput[0].length <= 2) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input value in Source Url.");
                return false;
            }
            if (aCreateInput[1].length === 0) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input value in Destination Port.");
                return false;
            };
            if (aCreateInput[3].length === 0) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input value in Channel Number.");
                return false;
            };
            if (aCreateInput[4].length <= 2) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input value in Name.");
                return false;
            };
            var sSourceUrl = aCreateInput[0];            
            var aSourceUrl = sSourceUrl.trim().split(',');
            if(aSourceUrl.length > max_create_count)
            {
                oHtml.AppendMassEntryResultTable(RowNum,'Count of Source Url is over maximum count(' + max_create_count +').');
                return false;
            }
            var sDestinationName = aCreateInput[2].length > 2 ? aCreateInput[2].substring(1,aCreateInput[2].length-1) : '';
            aCreateInput[2] = sDestinationName;
            var sName = aCreateInput[4].substring(1,aCreateInput[4].length-1);
            aCreateInput[4] = sName;
            var sDescription = aCreateInput[5].length > 2 ? aCreateInput[5].substring(1,aCreateInput[5].length-1) : '';
            aCreateInput[5] = sDescription;
            for(var index in aSourceUrl)
            {
                if (!oUIRelayContorl.VerifyRelayInput(aSourceUrl[index])) {
                    oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Source Url('" + sSourceUrl + "').");
                    return false;
                }
            }
            if (!oUIRelayContorl.VerifyRelayInput(sDestinationName)) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Destination Name('" + sDestinationName + "').");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sName)) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Name('" + sName + "').");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sDescription)) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Description('" + sDescription + "').");
                return false;
            }                        
            if (!oUIRelayContorl.CheckNum(aCreateInput[1])){
                oHtml.AppendMassEntryResultTable(RowNum,"Destination Port('" + aCreateInput[1] + "') must be integer.");   
                return false;
            };   
            aCreateInput[1] = parseInt(aCreateInput[1]);
            if (!oUIRelayContorl.CheckNum(aCreateInput[3])){
                oHtml.AppendMassEntryResultTable(RowNum,"Channel Number('" + aCreateInput[3] + "') must be integer.");   
                return false;
            }; 
            aCreateInput[3] = parseInt(aCreateInput[3]);
            if(sPortCheck.indexOf(aCreateInput[1]) !== -1){
                oHtml.AppendMassEntryResultTable(RowNum,"Destination Port('" + aCreateInput[1] + "') is duplicate.");   
                return false;
            }  
            if(sNameCheck.indexOf(',' + sName + ',') !== -1){
                oHtml.AppendMassEntryResultTable(RowNum,"Name('" + sName + "') is duplicate.");   
                return false;
            }  
            if(sChannelNumberCheck.indexOf(aCreateInput[3]) !== -1){
                oHtml.AppendMassEntryResultTable(RowNum,"Channel Number('" + aCreateInput[3] + "') is duplicate.");   
                return false;
            }
            sPortCheck += aCreateInput[1] + ',';
            sChannelNumberCheck += aCreateInput[3] + ',';
            sNameCheck += sName + ',';
            return true;
       
        };               
                       
        function RebindAllRelayEvent(){
            RebindStopEvent();
            RebindDeleteEvent();
            RebindResumeEvent();
            RebindModifySourceEvent();
            RebindModifyChannelEvent();
        }               
                
        function RebindStopEvent() {
            $(stop_class).click(function(event) {
                event.preventDefault();
                var thisitem = $(this);                
                StopRelay(relayList[thisitem.attr('id')]['id']);
            });
        };
        
        function StopRelay(id){
            oHtml.blockPage();            
            var request = oRelayAjax.stopRelay(id);   
            CallBackStopRelay(request);
        };
        
        function CallBackStopRelay(request){            
            request.done(function(msg, statustext, jqxhr) {                
                setTimeout(function(){GetRelayNoRefresh();}, 200);
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.StopRelay);
            });
        };
        
        function RebindDeleteEvent(event) {
            $(delete_class).click(function(event) {
                event.preventDefault();
                var thisitem = $(this);                
                DeleteRelay(relayList[thisitem.attr('id')]['id']);
            });
        };
        
        function DeleteRelay(id){
            oHtml.blockPage();            
            var request = oRelayAjax.deleteRelay(id);   
            CallBackDeleteRelay(request);
        };
        
        function CallBackDeleteRelay(request){            
            request.done(function(msg, statustext, jqxhr) {                
                setTimeout(function(){oUIRelayContorl.GetRelayList();}, 200);
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.DeleteRealy);
            });
        };
        
        function RebindResumeEvent() {
            $(resume_class).click(function(event) {
                event.preventDefault();
                var thisitem = $(this);                
                var index = thisitem.attr('id');
                ResumeRelay(index);
            });
        };
        
        function ResumeRelay(index){
            oHtml.blockPage();
            var request = oRelayAjax.resumeRelay(relayList[index]['id'], relayList[index]['source'], relayList[index]['port'], relayList[index]['channelname']);   
            CallBackResumeRelay(request);
        };
        
        function CallBackResumeRelay(request){            
            request.done(function(msg, statustext, jqxhr) {                
//                setTimeout(function(){oUIRelayContorl.GetRelayList();}, 1000);
                setTimeout(function(){GetRelayNoRefresh();}, 200);
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.ResumeRelay);
            });
        };                
        
        function RebindModifySourceEvent(){
            $(modify_source_class).click(function(event) {
                event.preventDefault();
                var channelid = parseInt($(this).attr('id'));
                ModifySourceList = [];
                ModifySourceList = relayList[channelid]['source'];
                ModifySourceList.sort(function(a,b)
                {	
                    return (a['prior'] - b['prior']);
                });
                oHtml.EmptyModifySourceArea();
                oHtml.AppendModfiySourceArea(ModifySourceList);
                RebindAllModifySourceEvent(channelid);
                $( "#modal_modify_source_content" ).dialog('open');
            });
        };
        
        function RebindModifyChannelEvent(){
            $(modify_channel_class).click(function(event) {
                event.preventDefault();
                var channelid = parseInt($(this).attr('id'));
                iModifyChannelID = channelid;
                $('#btn_modify_channel').attr('id',channelid);
                $('#ModfiyPort').val(relayList[channelid]['port']);
                $('#ModfiyDestinationName').val(relayList[channelid]['destname']);
                $('#ModfiyChannelNumber').val(relayList[channelid]['channelnumber']);
                $('#ModfiyName').val(relayList[channelid]['name']);
                $('#ModfiyDescription').val(relayList[channelid]['description']);
                $( "#modal_modify_channel_content" ).dialog('open');
            });
        };
        
        function ModifyChannel(){
            var flag = true;            
            var iDestPort = $('#ModfiyPort').val();
            var sDestName = $('#ModfiyDestinationName').val();
            var iChannelNumber = $('#ModfiyChannelNumber').val();
            var sName = $('#ModfiyName').val();
            var sDescription = $('#ModfiyDescription').val();                             
            flag = VerifyRelayInput(sDestName,sName,sDescription,iDestPort,iChannelNumber
            ,ChannelVerifyAction.ModifyAction);             
            if (!flag)
                return false;
            iDestPort = parseInt(iDestPort);
            iChannelNumber = parseInt(iChannelNumber);
            oHtml.blockPage();
            var request =  oRelayAjax.ModifyChannel(iModifyChannelID,iChannelNumber,sName
            ,sDescription, iDestPort, sDestName);
            CallBackModifyChannel(request);
        }
        
         function CallBackModifyChannel(request)
        {            
            request.done(function(msg, statustext, jqxhr) {    
                $( "#modal_modify_channel_content" ).dialog('close');
//                setTimeout(function(){oUIRelayContorl.GetRelayList();}, 1000);
                setTimeout(function(){GetRelayNoRefresh();}, 200);
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.ModifyChannel);
            });
        };
        
        function RebindAllModifySourceEvent(channelid){
            RebindModifyAddSourceEvent(channelid);
            RebindModifyDeleteSourceEvent(channelid);
            RebindModifyUPSourceEvent(channelid);
            RebindModifyDownSourceEvent(channelid);
        };
        
        function RebindModifyAddSourceEvent(channelid){
            $(modify_addsource_class).click(function(event){
               event.preventDefault();
               var sSourceUrl = $('#ModifyAddSourceUrl').val();
               if (sSourceUrl.length === 0) {
                    alert("Error : Please input value in Source.");
                    return;
                };     
                if (!oUIRelayContorl.VerifyRelayInput(sSourceUrl)) {
                    alert("Error : Can't input whitespace and ',' in Source.");
                    return; 
                }
               var oAddSourceUrl = new relaySourceClass(0,0,sSourceUrl,ModifySourceList.length + 1);
               var aAddSourceUrl = [];
               aAddSourceUrl.push(oAddSourceUrl);
               AddChannelSource(channelid,aAddSourceUrl);
            });
        };
        
        function AddChannelSource(channelid,aAddSourceUrl){
            oHtml.blockPage();
            var request = oRelayAjax.AddChannelSource(channelid,aAddSourceUrl);
            CallBackAddChannelSource(request,channelid);
        };
        
        function CallBackAddChannelSource(request,channelid){            
            request.done(function(msg, statustext, jqxhr) {   
                oHtml.stopPage();
                CallBackArrayToModifySourceList(msg,channelid);                
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.AddSource);
            });
        };          
        
        function RebindModifyDeleteSourceEvent(channelid){
            $(modify_deletesource_class).click(function(event){
               event.preventDefault();
               var index = $(this).attr('id');               
               var oDeleteSourceUrl = new relaySourceClass(ModifySourceList[index]['id'],0,ModifySourceList[index]['url'],0);
               var aDeleteSourceUrl = [];
               aDeleteSourceUrl.push(oDeleteSourceUrl);
               DeleteChannelSource(channelid,aDeleteSourceUrl);
            });
        };
        
        function DeleteChannelSource(channelid,aDeleteSourceUrl){
            oHtml.blockPage();
            var request = oRelayAjax.DeleteChannelSource(channelid,aDeleteSourceUrl);
            CallBackDeleteChannelSource(request,channelid);
        };
        
        function CallBackDeleteChannelSource(request,channelid){            
            request.done(function(msg, statustext, jqxhr) {   
                oHtml.stopPage();
                CallBackArrayToModifySourceList(msg,channelid);                
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.AddSource);
            });
        };   
        
        function RebindModifyUPSourceEvent(channelid){
            $(modify_upsource_class).click(function(event){
               event.preventDefault();
               var index = parseInt($(this).attr('id'));    
               var upindex = index - 1;
               var NowSourUrl_AfterChange = new relaySourceClass(ModifySourceList[index]['id'],0,ModifySourceList[index]['url'],upindex + 1);
               var UpSourceUrl_AfterChange = new relaySourceClass(ModifySourceList[upindex]['id'],0,ModifySourceList[upindex]['url'],index + 1);
               var aReorderSourceUrl = [];
               aReorderSourceUrl.push(NowSourUrl_AfterChange);
               aReorderSourceUrl.push(UpSourceUrl_AfterChange);
               ReOrderChannelSource(channelid,aReorderSourceUrl);
            });
        };
        
        function RebindModifyDownSourceEvent(channelid){
            $(modify_downsource_class).click(function(event){
               event.preventDefault();
               var index = parseInt($(this).attr('id'));    
               var downindex = index + 1;
               var NowSourUrl_AfterChange = new relaySourceClass(ModifySourceList[index]['id'],0,ModifySourceList[index]['url'],downindex + 1);
               var UpSourceUrl_AfterChange = new relaySourceClass(ModifySourceList[downindex]['id'],0,ModifySourceList[downindex]['url'],index + 1);
               var aReorderSourceUrl = [];
               aReorderSourceUrl.push(NowSourUrl_AfterChange);
               aReorderSourceUrl.push(UpSourceUrl_AfterChange);
               ReOrderChannelSource(channelid,aReorderSourceUrl);
            });
        };
        
        function ReOrderChannelSource(channelid,aReorderSourceUrl){
            oHtml.blockPage();
            var request = oRelayAjax.ReOrderChannelSource(channelid,aReorderSourceUrl);
            CallBackReOrderChannelSource(request,channelid);
        };
        
        function CallBackReOrderChannelSource(request,channelid){            
            request.done(function(msg, statustext, jqxhr) {   
                oHtml.stopPage();
                CallBackArrayToModifySourceList(msg,channelid);                
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.AddSource);
            });
        };   
        
        function CallBackArrayToModifySourceList(sourcelist,channelid)
        {
            var otmpSourceUrl;
            ModifySourceList = [];
            $.each(sourcelist, function(index, sourcelement) {                               
                $.each(sourcelement['Source'],function(sourceindex,sourceelement){
                    otmpSourceUrl = new relaySourceClass(sourceelement['idSource'],sourceelement['state']
                    ,sourceelement['urlSource'],sourceelement['prior']);
                    ModifySourceList.push(otmpSourceUrl);
                });
            });
            ModifySourceList.sort(function(a,b)
            {	
                return (a['prior'] - b['prior']);
            });
            oHtml.EmptyModifySourceArea();
            oHtml.AppendModfiySourceArea(ModifySourceList);
            RebindAllModifySourceEvent(channelid);
        }
                
        return oUIRelayContorl;
    }
};

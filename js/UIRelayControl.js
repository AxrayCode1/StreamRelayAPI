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
        var iModifyID;
        var RelayColumn = {
            ChannelNumber:1,
            ChannelName:2,
            Source: 3,
            SourceQtp: 4,
            Destination: 5,
            Status: 6,            
            Description:7           
        };
        var MassColumn = {
            ChannelNumber:0,
            ChannelName:1,
            SourceURL:2,
            Port:3,
            Name:4,
            Description:5
        };
        var ChannelVerifyAction = {
            CreateAction:1,
            ModifyAction:2
        };
        var CreateSourceList;
        var ModifySourceList;
        var NowSortType;
        var NowSortDirection;
        var NowSortDOMID;
        oUIRelayContorl.Init = function(){              
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
            InitDetailDialog();
            oUIRelayContorl.GetRelayList();
            RebindDeleteEvent();
            RebindModifySourceEvent();
            RebindModifyChannelEvent();
            $('.btn_add_single').click(function(event){
                event.preventDefault();
                CreateSourceList = [];
                $('.SingleCreate').val('');
                oHtml.EmptySoucreArea();
                oHtml.AppendSourceArea(CreateSourceList);
                RebindAllControlSourceEvent();
                $( "#modal_create_channel_content" ).dialog('open');
            });            
            $('.btn_mass_entry').click(function(event){
                event.preventDefault();
                $('#uploadFile').val('');
                $('#file_mass_create').val('');
                $( "#progressbar" ).progressbar('option','value',0);
                $( ".progress-label").text('');
                oHtml.EmptyMassEntryResultTable();
                $( "#modal_update_progress_content").dialog('open');
            });
            $('#btn_resume_all').click(function(event){
                event.preventDefault();
                ResumeAllRelay();
            });
            $('#btn_stop_all').click(function(event){
                event.preventDefault();
                StopAllRelay();
            });
            $('#btn_refresh').click(function(event) {
                event.preventDefault();
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
                event.preventDefault();
                $('#uploadFile').val($(this).val());
                oUIRelayContorl.FileBindChangeEvent(event);
            });           
            $('#btn_mass_create').click(function(event) {
                event.preventDefault();
                oUIRelayContorl.MassFileCreateAction();        
            });
            $('.relayth').click(function(event){
                event.preventDefault();
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
                NowSortType = eSortType;
                NowSortDirection = eSortDirection;
                NowSortDOMID = th.attr('id');
                SortRelayList(eSortDirection,eSortType,th.attr('id'));                
                oHtml.clearTable();
                oHtml.appendTablebyList();
                RebindAllRelayEvent(); 
                ReCreateRelayList();                
            });
            PollingRelayList(true);
        };
        
        function DefaultSortByChannelNo()
        {
            if(typeof(NowSortType)=== 'undefined')
            {
                var th = $('#channelnumber');
                th.removeClass('desc');
                th.addClass('asc');
                NowSortDirection = SortDirection.ASC;
                NowSortType = SortType.Num;
                NowSortDOMID = th.attr('id');
            }                        
            SortRelayList(NowSortDirection,NowSortType,NowSortDOMID); 
        }
        
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
                    width:560               
            });    
            $( "#progressbar" ).progressbar({                
                    value:0,
                    max:100,    
                    complete: function() {
                        $('#closedialog').show();                           
                    }
            });      
            $('#closedialog').click(function (event) {
                event.preventDefault();
                sMassCreateStr = '';
                $( "#modal_update_progress_content" ).dialog('close');
                oUIRelayContorl.GetRelayList();
            });
        };
                
        function InitModifySourceDialog(){
            $( "#modal_modify_source_content" ).dialog({
                    title: "Edit Source URL",
                    modal: true,
                    resizable: false,
                    draggable: true,
                    closeOnEscape: false,
                    autoOpen: false,
                    dialogClass: "no-close",
                    height:400,
                    width:720               
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
                    title: "Modify Miscellaneous",
                    modal: true,
                    resizable: false,
                    draggable: true,
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
                    title: "Single Channel",
                    modal: true,
                    resizable: false,
                    draggable: true,
                    closeOnEscape: false,
                    autoOpen: false,
                    dialogClass: "no-close",
                    height:530,
                    width:720               
            });                 
            $('#btn_close_create_channel').click(function (event) {	    
                event.preventDefault();
                $( "#modal_create_channel_content" ).dialog('close');                
            });
        };
        
        function InitDetailDialog(){
            $( "#modal_detail_content" ).dialog({
                    title: "Source URL Information",
                    modal: true,
                    resizable: false,
                    draggable: true,
                    closeOnEscape: false,
                    autoOpen: false,
                    dialogClass: "no-close",
                    height:350,
                    width:600               
            });
            $('#btn_close_detail_content').click(function (event) {
                event.preventDefault();
                $( "#modal_detail_content" ).dialog('close');                
            });            
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
                    setTimeout(function(){PollingRelayList(true);}, PollingTime);
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
//                        $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.Source).children(":first-child").text(relayList[relayelement['idChannel']]['source'][0]['url']);
                        $('#tr' + relayelement['idChannel']).find('td').eq(RelayColumn.SourceQtp).text(relayelement['Source'].length);
 //                        };
                }
            });
            RebindDetailEvent();
        }
                
        oUIRelayContorl.GetRelayList = function(){
            oHtml.blockPage();
            var request = oRelayAjax.getRelayList();
            oUIRelayContorl.CallBackGetRelay(request);
        };     
        
        oUIRelayContorl.CallBackGetRelay = function(request){              
            request.done(function(msg, statustext, jqxhr) {
                var tmp_relay_item;
                var dest_temp;
                var port;
                var dest_name;
                var atmpSourceUrl;
                var otmpSourceUrl;                
                relayList = [];
                $.each(msg, function(relayindex, relayelement) {               
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
                });
                oHtml.stopPage(); 
                DefaultSortByChannelNo();
                oHtml.clearTable();
                oHtml.appendTablebyList();
                RebindAllRelayEvent(); 
                ReCreateRelayList();
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
                alert("Error : Can't input whitespace and ',' in Name.");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sName)) {
                alert("Error : Can't input whitespace and ',' in Channel Name.");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sDescription)) {
                alert("Error : Can't input whitespace and ',' in Description.");
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
                alert("Error : Please input value in Channel Name.");
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
                            alert("Error : DUPLICATE Channel Name !");
                            return false;
                        }   
                        else if(String(iChannelNumber) === String(element['channelnumber'])){
                            alert("Error : DUPLICATE Channel Number !");
                            return false;
                        }
                        break;
                    case ChannelVerifyAction.ModifyAction:                         
                        if (String(iDestPort) !== relayList[iModifyID]['port'] && String(iDestPort) === element['port']) {
                            alert("Error : DUPLICATE PORT NUMBER !");
                            return false;
                        }
                        else if(sName !== relayList[iModifyID]['name'] && sName === element['name']){
                            alert("Error : DUPLICATE Channel Name !");
                            return false;
                        }   
                        else if(String(iChannelNumber) !== String(relayList[iModifyID]['channelnumber']) && String(iChannelNumber) === String(element['channelnumber'])){
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
                $( "#modal_create_channel_content" ).dialog('close');
                setTimeout(function(){oUIRelayContorl.GetRelayList();}, 1000);
            });
            request.fail(function(jqxhr, textStatus) {
                $( "#modal_create_channel_content" ).dialog('close');
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
//            $('#uploadFile').val('');
//            $('#file_mass_create').val('');
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
            $('#closedialog').hide();
            var progressLabel = $( ".progress-label" ); 
            var iTotalCreate = aMassCreateItem.length - 1;   
            sPortCheck = ",";
            sNameCheck = ",";
            sChannelNumberCheck = ",";   
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
//            $( "#modal_update_progress_content" ).dialog('open');
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
                var aSourceUrl = aCreateInput[MassColumn.SourceURL].trim().split(',');
                for(var i = 0; i< aSourceUrl.length; i++){ 
                    sSourceUrl += '"' +  aSourceUrl[i] ;
                    if(i !== aSourceUrl.length -1)
                        sSourceUrl += '",';
                    else
                        sSourceUrl += '"';
                };
                var request =  oRelayAjax.createRelay(aCreateInput[MassColumn.ChannelNumber], aCreateInput[MassColumn.ChannelName], aCreateInput[MassColumn.Description], sSourceUrl, aCreateInput[MassColumn.Port], aCreateInput[MassColumn.Name]);
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
            if (aCreateInput[MassColumn.SourceURL].length <= 2) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input value in Source URL.");
                return false;
            }
            if (aCreateInput[MassColumn.Port].length === 0) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input value in Destination Port.");
                return false;
            };
            if (aCreateInput[MassColumn.ChannelNumber].length === 0) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input value in Channel Number.");
                return false;
            };
            if (aCreateInput[MassColumn.ChannelName].length <= 2) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input value in Channel Name.");
                return false;
            };
            var sSourceUrl = aCreateInput[MassColumn.SourceURL];            
            var aSourceUrl = sSourceUrl.trim().split(',');
            if(aSourceUrl.length > max_create_count)
            {
                oHtml.AppendMassEntryResultTable(RowNum,'Count of Source URL is over maximum count(' + max_create_count +').');
                return false;
            }
            var sDestinationName = aCreateInput[MassColumn.Name].length > 2 ? aCreateInput[MassColumn.Name].substring(1,aCreateInput[MassColumn.Name].length-1) : '';
            aCreateInput[MassColumn.Name] = sDestinationName;
            var sName = aCreateInput[MassColumn.ChannelName].substring(1,aCreateInput[MassColumn.ChannelName].length-1);
            aCreateInput[MassColumn.ChannelName] = sName;
            var sDescription = aCreateInput[MassColumn.Description].length > 2 ? aCreateInput[MassColumn.Description].substring(1,aCreateInput[MassColumn.Description].length-1) : '';
            aCreateInput[MassColumn.Description] = sDescription;
            for(var index in aSourceUrl)
            {
                if (!oUIRelayContorl.VerifyRelayInput(aSourceUrl[index])) {
                    oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Source URL('" + sSourceUrl + "').");
                    return false;
                }
            }
            if (!oUIRelayContorl.VerifyRelayInput(sDestinationName)) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Name('" + sDestinationName + "').");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sName)) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Channel Name('" + sName + "').");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sDescription)) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Description('" + sDescription + "').");
                return false;
            }                        
            if (!oUIRelayContorl.CheckNum(aCreateInput[MassColumn.Port])){
                oHtml.AppendMassEntryResultTable(RowNum,"Port('" + aCreateInput[MassColumn.Port] + "') must be integer.");   
                return false;
            };   
            aCreateInput[MassColumn.Port] = parseInt(aCreateInput[MassColumn.Port]);
            if (!oUIRelayContorl.CheckNum(aCreateInput[MassColumn.ChannelNumber])){
                oHtml.AppendMassEntryResultTable(RowNum,"Channel Number('" + aCreateInput[3] + "') must be integer.");   
                return false;
            }; 
            aCreateInput[MassColumn.ChannelNumber] = parseInt(aCreateInput[MassColumn.ChannelNumber]);
            if(sPortCheck.indexOf(',' + aCreateInput[MassColumn.Port]+ ',') !== -1){
                oHtml.AppendMassEntryResultTable(RowNum,"Port('" + aCreateInput[MassColumn.Port] + "') is duplicate.");   
                return false;
            }  
            if(sNameCheck.indexOf(',' + sName + ',') !== -1){
                oHtml.AppendMassEntryResultTable(RowNum,"Channel Name('" + sName + "') is duplicate.");   
                return false;
            }  
            if(sChannelNumberCheck.indexOf(',' + aCreateInput[MassColumn.ChannelNumber]+ ',') !== -1){
                oHtml.AppendMassEntryResultTable(RowNum,"Channel Number('" + aCreateInput[MassColumn.ChannelNumber] + "') is duplicate.");   
                return false;
            }
            sPortCheck += aCreateInput[MassColumn.Port] + ',';
            sChannelNumberCheck += aCreateInput[MassColumn.ChanelNumber] + ',';
            sNameCheck += sName + ',';
            return true;
       
        };               
                       
        function RebindAllRelayEvent(){
            RebindStopEvent();
//            RebindDeleteEvent();
            RebindResumeEvent();
//            RebindModifySourceEvent();
//            RebindModifyChannelEvent();
            RebindEditEvent();
            RebindDetailEvent();
        }               
        
        function RebindDetailEvent(){
//            $('.DetailSource').tooltip({    
//                items: "img ",
//                content: function() {  
//                     var tooltip = oHtml.GetTooltip($(this).attr('id'));
//                     return tooltip;
//                }
//            });
            $('.DetailSource').click(function(event){
                event.preventDefault();
                oHtml.clearDetailTable();
                oHtml.appendDetailTable($(this).attr('id'));
                $( "#modal_detail_content" ).dialog('open');
            });
        };
        
        function RebindEditEvent(){
            $('.RealyEdit').click(function(event){
                event.preventDefault();
                iModifyID = $(this).attr('data-edit');
            });
        };
        
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
        
        function StopAllRelay(){
            var i = 0;
            var arrID = [];
            for(var key in relayList){ 
                arrID.push(relayList[key]['id']);
                ++i;
            };
            if(arrID.length > 0)
            {
                var request = oRelayAjax.stopMultiRelay(arrID);   
                CallBackStopRelay(request);
            }
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
//                var thisitem = $(this);                
                DeleteRelay(iModifyID);
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
            var arrID = [];
            arrID.push(relayList[index]['id']);
            var request = oRelayAjax.resumeRelay(arrID);   
            CallBackResumeRelay(request);
        };
        
        function ResumeAllRelay(){
            var i = 0;
            var arrID = [];
            for(var key in relayList){ 
                arrID.push(relayList[key]['id']);
                ++i;
            };
            if(arrID.length > 0)
            {
                var request = oRelayAjax.resumeRelay(arrID);   
                CallBackResumeRelay(request);
            }
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
                var channelid = iModifyID;
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
                var channelid = iModifyID;
//                iModifyID = channelid;
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
            var request =  oRelayAjax.ModifyChannel(iModifyID,iChannelNumber,sName
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
                    alert("Error : Please input value in Source URL.");
                    return;
                };     
                if (!oUIRelayContorl.VerifyRelayInput(sSourceUrl)) {
                    alert("Error : Can't input whitespace and ',' in Source URL.");
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

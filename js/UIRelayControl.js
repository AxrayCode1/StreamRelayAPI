var UIRelayControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;
        var sMassCreateStr = '';
        var delete_class = '.delete';
        var resume_class = '.resume';
        var oUIRelayContorl={};
        var sPortCheck = '';
        var sNameCheck = '';
        var sChannelNumberCheck = '';
        var oError = {};      
        oUIRelayContorl.Init = function(){   
            oError = ErrorHandle.createNew();
            oHtml.HideAllOption();
            oHtml.ShowOption(DivRelay);
            oUIRelayContorl.InitMassEntryDialog();
            oUIRelayContorl.GetRelayList();            
            $('#btn_refresh').click(function() {
                oUIRelayContorl.GetRelayList();
            });
            $('#btn_create').click(function() {        
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
        };
        
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
                
        oUIRelayContorl.CheckNum = function(str){
            return str.match(/^[0-9]*$/);
        };
                
        oUIRelayContorl.GetRelayList = function(){
            var request = oRelayAjax.getRelayList();
            oUIRelayContorl.CallBackGetRelay(request);
        };     
        
        oUIRelayContorl.CallBackGetRelay = function(request){
            oHtml.blockPage();
            request.done(function(msg, statustext, jqxhr) {
                oHtml.stopPage();                
                oHtml.clearTable();
                oHtml.appendTable(msg);
                oUIRelayContorl.RebindDeleteEvert();
                oUIRelayContorl.RebindResumeEvert();
            });
            request.fail(function(jqxhr, textStatus) {
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.GetRelay);
            });
        };
                       
        oUIRelayContorl.RebindDeleteEvert = function() {
            $(delete_class).click(function() {
                var thisitem = $(this);                
                oUIRelayContorl.DeleteRelay(relayList[thisitem.attr('id')]['id']);
            });
        };
        
        oUIRelayContorl.DeleteRelay = function(id){
            var request = oRelayAjax.deleteRelay(id);   
            oUIRelayContorl.CallBackDeleteRelay(request);
        };
        
        oUIRelayContorl.CallBackDeleteRelay = function(request){
            request.done(function(msg, statustext, jqxhr) {
                setTimeout(oUIRelayContorl.GetRelayList(), 2000);
            });
            request.fail(function(jqxhr, textStatus) {
                oError.CheckAuth(jqxhr.status,ActionStatus.DeleteRealy);
            });
        };
        
        oUIRelayContorl.RebindResumeEvert = function() {
            $(resume_class).click(function() {
                var thisitem = $(this);                
                var index = thisitem.attr('id');
                oUIRelayContorl.ResumeRelay(index);
            });
        };
        
        oUIRelayContorl.ResumeRelay = function(index){
            var request = oRelayAjax.resumeRelay(relayList[index]['id'], relayList[index]['source'], relayList[index]['port'], relayList[index]['channelname']);   
            oUIRelayContorl.CallBackResumeRelay(request);
        };
        
        oUIRelayContorl.CallBackResumeRelay = function(request){
            request.done(function(msg, statustext, jqxhr) {
                setTimeout(oUIRelayContorl.GetRelayList(), 2000);
            });
            request.fail(function(jqxhr, textStatus) {
                oError.CheckAuth(jqxhr.status,ActionStatus.ResumeRelay);
            });
        };                
        
        oUIRelayContorl.CreateRelayAction = function (){
            var flag = true;
            var sSourceUrl = $('#Source').val();
            var iDestPort = $('#Port').val();
            var sDestName = $('#DestinationName').val();
            var iChannelNumber = $('#ChannelNumber').val();
            var sName = $('#Name').val();
            var sDescription = $('#Description').val();     
            if (!oUIRelayContorl.VerifyRelayInput(sSourceUrl)) {
                alert("Error : Can't input whitespace and ',' in Source.");
                return;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sDestName)) {
                alert("Error : Can't input whitespace and ',' in Destination Name.");
                return;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sName)) {
                alert("Error : Can't input whitespace and ',' in Remark1.");
                return;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sDescription)) {
                alert("Error : Can't input whitespace and ',' in Remark2.");
                return;
            }     
            if (sSourceUrl.length === 0) {
                alert("Error : Please input value in Source.");
                return;
            };                     
            if (iDestPort.length === 0) {
                alert("Error : Please input value in Port.");
                return;
            };            
            if (!oUIRelayContorl.CheckNum(iDestPort)){
                alert("Error : Port must be integer.");   
                return false;
            };
            iDestPort = parseInt(iDestPort);
            if (sName.length === 0) {
                alert("Error : Please input value in Name.");
                return;
            };  
            if (iChannelNumber.length === 0) {
                alert("Error : Please input value in Channel Number.");
                return;
            };                         
            if (!oUIRelayContorl.CheckNum(iChannelNumber)){
                alert("Error : Channel Number must be integer.");   
                return false;
            };            
            iChannelNumber = parseInt(iChannelNumber);
            $.each(relayList, function(index, element) {                
                if (String(iDestPort) === element['port']) {
                    flag = false;
                    alert("Error : DUPLICATE PORT NUMBER !");
                    return false;
                }
                else if(sName === element['name']){
                    flag = false;
                    alert("Error : DUPLICATE Name !");
                    return false;
                }   
                else if(String(iChannelNumber) === element['channelnumber']){
                    flag = false;
                    alert("Error : DUPLICATE Channel Number !");
                    return false;
                }  
            });
            if (!flag)
                return false;
            oUIRelayContorl.CreatRelay(iChannelNumber,sName, sDescription, sSourceUrl, iDestPort, sDestName);
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
            var request =  oRelayAjax.createRelay(iChannelNumber,sName, sDescription, sSourceUrl, iDestPort, sDestName);
            oUIRelayContorl.CallBackCreateRelay(request);
        };
        
        oUIRelayContorl.CallBackCreateRelay = function(request)
        {
            oHtml.blockPage();
            request.done(function(msg, statustext, jqxhr) {
                oHtml.stopPage();                
                oUIRelayContorl.GetRelayList();
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
            sPortCheck = "";
            sNameCheck = "";
            sChannelNumberCheck = "";
            $.each(relayList, function(index, element) {                
                           sPortCheck += element['port'] + ',';      
                           sNameCheck += element['name'] + ',';
                           sChannelNumberCheck += element['channelnumber'] + ',';
                       });
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
                var request =  oRelayAjax.createRelay(aCreateInput[3], aCreateInput[4], aCreateInput[5], aCreateInput[0], aCreateInput[1], aCreateInput[2]);
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
//                oHtml.AppendMassEntryResultTable(RowNum,'Ajax Create Relay Error.');
//                ++RowNum;
//                oUIRelayContorl.MassCreatRelay(RowNum,aMassCreateItem);
                  oError.CheckAuth(jqxhr.status,ActionStatus.CreateRelay);
            });
        };        
        
        oUIRelayContorl.MassEntryVerifyInput = function(RowNum,aCreateInput)
        {                                   
            var RowNum = RowNum + 1;
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
            var sDestinationName = aCreateInput[2].length > 2 ? aCreateInput[2].substring(1,aCreateInput[2].length-1) : '';
            aCreateInput[2] = sDestinationName;
            var sName = aCreateInput[4].substring(1,aCreateInput[4].length-1);
            aCreateInput[4] = sName;
            var sDescription = aCreateInput[5].length > 2 ? aCreateInput[5].substring(1,aCreateInput[5].length-1) : '';
            aCreateInput[5] = sDescription;
            if (!oUIRelayContorl.VerifyRelayInput(sSourceUrl)) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Source Url('" + sSourceUrl + "').");
                return false;
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
            if(sNameCheck.indexOf(sName) !== -1){
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
        return oUIRelayContorl;
    }
};

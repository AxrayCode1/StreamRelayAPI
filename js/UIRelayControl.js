var UIRelayControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;
        var sMassCreateStr = '';
        var delete_class = '.delete';
        var resume_class = '.resume';
        var oUIRelayContorl={};
        var sPortCheck = '';
        var oError = {};
        var DivChannel = $('#div_relay_control');
        var DivIP = $('#div_ip_control');
        var DivSystem = $('#div_sys_config');
        oUIRelayContorl.Init = function(){   
            oError = ErrorHandle.createNew();
            DivIP.hide();
            DivSystem.hide();
            oUIRelayContorl.GetRelayList();            
            $('#btn_refresh').click(function() {
                oUIRelayContorl.GetRelayList();
            });
            $('#btn_create').click(function() {        
                oUIRelayContorl.CreateRelayAction();                       
            });            
            $('#rl').click(function() {
                DivIP.hide();
                DivSystem.hide();
                DivChannel.show();
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
            var source = $('#Source').val();
            var port = $('#Port').val();
            var name = $('#ChannelName').val();
            var sRemark1 = $('#Remark1').val();
            var sRemark2 = $('#Remark2').val();     
            if (!oUIRelayContorl.VerifyRelayInput(source)) {
                alert("Error : Can't input whitespace and ',' in Source.");
                return;
            }
            if (!oUIRelayContorl.VerifyRelayInput(name)) {
                alert("Error : Can't input whitespace and ',' in Channel Name.");
                return;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sRemark1)) {
                alert("Error : Can't input whitespace and ',' in Remark1.");
                return;
            }
            if (!oUIRelayContorl.VerifyRelayInput(sRemark2)) {
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
            if (!(port === parseInt(port))){
                alert("Error : Port must be integer.");   
                return false;
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
            oUIRelayContorl.CreatRelay(sRemark1, sRemark2, source, port, name);
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
        
        oUIRelayContorl.CreatRelay = function(sRemark1, sRemark2, source, port, name){
            var request =  oRelayAjax.createRelay(sRemark1, sRemark2, source, port, name);
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
            var progressbar = $( "#progressbar" );
            var progressLabel = $( ".progress-label" ); 
            var iTotalCreate = aMassCreateItem.length - 1;   
            sPortCheck = "";
            progressLabel.text("0/" + iTotalCreate);
            progressbar.progressbar({
                max:iTotalCreate,
                value:0,
                change: function() { 
                    var oPG = $(this);
                    progressLabel.text( oPG.progressbar("option","value") + '/' + oPG.progressbar( "option", "max" ) );
                },
                complete: function() {
                    $('#closedialog').show();
                }
            });  
            $('#modal_update_progress_content').modal({
                escClose : false,
                onShow: function () {
                    var modal = this;			
                    $('#closedialog').click(function () {								
                        modal.close();
                        oUIRelayContorl.GetRelayList();
                    });
                    $('#closedialog').hide();
                    $.each(relayList, function(index, element) {                
                        sPortCheck += element['port'] + ',';                
                    });
                    oUIRelayContorl.MassCreatRelay(1,aMassCreateItem);
		}
            }); 
            
        };        
                
        oUIRelayContorl.MassCreatRelay = function(RowNum,aMassCreateItem){
            if(RowNum > aMassCreateItem.length - 1)            
                return false;
            $( "#progressbar" ).progressbar( "value", RowNum);     
            var aCreateInput = aMassCreateItem[RowNum].trim().split(/\s+/);
            if(oUIRelayContorl.MassEntryVerifyInput(RowNum,aCreateInput))
            {
                var request =  oRelayAjax.createRelay(aCreateInput[3], aCreateInput[4], aCreateInput[0], aCreateInput[1], aCreateInput[2]);
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
            if(aCreateInput.length !== 5)
            {
                oHtml.AppendMassEntryResultTable(RowNum,'Number of Input Fields is not match.');
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(aCreateInput[0])) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Source.");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(aCreateInput[2])) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Channel Name.");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(aCreateInput[3])) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Remark1.");
                return false;
            }
            if (!oUIRelayContorl.VerifyRelayInput(aCreateInput[4])) {
                oHtml.AppendMassEntryResultTable(RowNum,"Can't input whitespace and ',' in Remark2.");
                return false;
            }
            if (aCreateInput[0].length === 0) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input Source.");
                return false;
            }
            if (aCreateInput[1].length === 0) {
                oHtml.AppendMassEntryResultTable(RowNum,"Please input Port.");
                return false;
            };
            if (isNaN(parseInt(aCreateInput[1]))){
                oHtml.AppendMassEntryResultTable(RowNum,"Port must be integer.");   
                return false;
            };           
            if(sPortCheck.indexOf(aCreateInput[1]) !== -1){
                oHtml.AppendMassEntryResultTable(RowNum,"Port is duplicate.");   
                return false;
            }           
            sPortCheck += aCreateInput[1] + ',';
            return true;
       
        };
        return oUIRelayContorl;
    }
};

var UIRelayControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;
        var sMassCreateStr = '';
        var DivChannel = $('#div_relay_control');
        var DivIP = $('#div_ip_control');
        var delete_class = '.delete';
        var resume_class = '.resume';
        var oUIRelayContorl={};
        oUIRelayContorl.Init = function(){                        
            oUIRelayContorl.GetRelayList();
            $('#btn_refresh').click(function() {
                oUIRelayContorl.GetRelayList();
            });
            $('#btn_create').click(function() {        
                oUIRelayContorl.CreateRelayAction();                       
            });            
            $('#rl').click(function() {
                DivIP.css('display', 'none');
                DivChannel.css('display', 'inline');
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
                alert("Error : Ajax List Relay Error");
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
                alert("Error : Ajax Delete Relay Error");
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
                alert("Error : Ajax Delete Relay Error");
            });
        };                
        
        oUIRelayContorl.CreateRelayAction = function (){
            var flag = true;
            var source = $('#Source').val();
            var port = $('#Port').val();
            var name = $('#ChannelName').val();
            var sRemark1 = $('#Remark1').val();
            var sRemark2 = $('#Remark2').val();            
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
                alert("Error : Ajax Create Relay Error");
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
                var aMassCreate = sMassCreateStr.split('\n');
                if(aMassCreate.length > 1001)
                {
                    alert("You can olny create 1000 Items at the same time.");
                    return false;
                }
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
            progressLabel.text("0/" + iTotalCreate);
            progressbar.progressbar({
                max:iTotalCreate,
                value:0,
                change: function() { 
                    var oPG = $(this);
                    progressLabel.text( oPG.progressbar("option","value") + '/' + oPG.progressbar( "option", "max" ) );
                },
//              complete: function() {
//              progressLabel.text( "Complete!" );
//              }
            });  
            $('#modal_update_progress_content').modal({
                escClose : false,
                onShow: function () {
                    var modal = this;			
                    $('#closedialog').click(function () {								
                        modal.close();
                    });
		}
            });            
        };        
        return oUIRelayContorl;
    }
};

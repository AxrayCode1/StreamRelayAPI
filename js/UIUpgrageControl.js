var UIUpgradeControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        var eCheckStatus = {
            NoCheck: -1,
            CanUpdate:0,
            NoNewVersion:1
        };
        var eUpdateStatus = {
          UpdateSuccess:0,
          NoUpdate : 1,
          Updating : 2,
          WgetFail : -1,
          WrongVersion : -2,
          UpdateFail : -3
        };
        var CheckStatus;
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;   
        var TimerCheckUpdate;
        var oUIUpgradeContorl={};
        var oError = {};
        var bSetInterval;
        oUIUpgradeContorl.bCheckUpdateFlag;                
        oUIUpgradeContorl.Init = function(){   
            oError = ErrorHandle.createNew();     
            oUIUpgradeContorl.bCheckUpdateFlag = false;
            bSetInterval = false;
            $('#sup').click(function() {  
                CheckStatus = eCheckStatus.NoCheck;
                $('#txt_new_firmware').text('');
                oHtml.HideAllOption();
                oHtml.ShowOption(DivUpgrade);                
                oUIUpgradeContorl.ListVersion();
            });           
            $('#btn_check_firmware').click(function(){
                oUIUpgradeContorl.CheckNewVersion();
            });
            $('#btn_update_firmware').click(function(){
                oUIUpgradeContorl.Update();
            });
            oHtml.blockPageMsg('Please Wait. Checking...');            
            oUIUpgradeContorl.CheckUpdate();            
            TimerCheckUpdate = setInterval(function(){oUIUpgradeContorl.CheckUpdate();}, 8000);
        };                
        oUIUpgradeContorl.Update = function(){
            switch(CheckStatus)
            {
                case eCheckStatus.NoCheck:
                    alert('Please Click "Check New Firmware" to check new vesion.');
                    break
                case eCheckStatus.NoNewVersion:
                    alert('No new vesion can be updated.');
                    break;
                case eCheckStatus.CanUpdate:
                    var request = oRelayAjax.updatenewversion();
                    oUIUpgradeContorl.CallBackUpdate(request);
                    break;
            }
        };
        oUIUpgradeContorl.CallBackUpdate = function(request){     
            oHtml.blockPageMsg('Please Wait. System is updating.');
            oUIUpgradeContorl.CheckUpdate();
            TimerCheckUpdate = setInterval(function(){oUIUpgradeContorl.CheckUpdate();}, 8000);
        };
        
        oUIUpgradeContorl.CheckUpdate = function(){
            var request = oRelayAjax.checkupdate();
            oUIUpgradeContorl.CallBackCheckUpdate(request);
        };
        oUIUpgradeContorl.CallBackCheckUpdate = function(request){            
            request.done(function(msg, statustext, jqxhr) {  
                switch(msg['Result'])
                {
                    case eUpdateStatus.UpdateSuccess:
                        window.clearInterval(TimerCheckUpdate);   
                        alert('Successful to update system. Please relogin.');
                        window.location = '/ui/Logout.html';
                        break;
                    case eUpdateStatus.NoUpdate:
                        window.clearInterval(TimerCheckUpdate);   
                        oUIUpgradeContorl.bCheckUpdateFlag = true;
                        oHtml.stopPage();
                        break;
                    case eUpdateStatus.Updating:                        
                        oHtml.ChangeblockMsg('Please Wait. System is updating.');                        
                        break;
                    case eUpdateStatus.WgetFail:
                        window.clearInterval(TimerCheckUpdate);   
                        alert('Failed to update system. Please check your network configuration.');
                        oHtml.stopPage();
                        oUIUpgradeContorl.bCheckUpdateFlag = true;
                        break;                       
                    case eUpdateStatus.WrongVersion:
                        window.clearInterval(TimerCheckUpdate);   
                        alert('Failed to update system. New firmware version is not right.');
                        oHtml.stopPage();
                        oUIUpgradeContorl.bCheckUpdateFlag = true;
                        break;
                    case eUpdateStatus.UpdateFail:
                        window.clearInterval(TimerCheckUpdate);   
                        alert('Failed to update system.');
                        oHtml.stopPage();
                        oUIUpgradeContorl.bCheckUpdateFlag = true;
                        break;
                    default:
                        window.clearInterval(TimerCheckUpdate);   
                        alert('Failed to update system. Unknow Error.');
                        oHtml.stopPage();
                        oUIUpgradeContorl.bCheckUpdateFlag = true;
                        break;
                }
            });
            request.fail(function(jqxhr, textStatus) {   
                window.clearInterval(TimerCheckUpdate);
                oError.CheckAuth(jqxhr.status,ActionStatus.SystemCheckUpdate);
            });
        };
        oUIUpgradeContorl.ListVersion = function(){
            var request = oRelayAjax.listversion();
            oUIUpgradeContorl.CallBackListVersion(request);
        };
        oUIUpgradeContorl.CallBackListVersion = function(request){
            oHtml.blockPage();
            request.done(function(msg, statustext, jqxhr) {
                oHtml.stopPage();
                if(msg['Result'] === 0)
                {
                    $('#txt_now_firmware').text(msg['Version']);                    
                }
                else{
                    alert('Error : List Version Error.');
                }
            });
            request.fail(function(jqxhr, textStatus) {    
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.SystemListVersion);
            });
        };
        oUIUpgradeContorl.CheckNewVersion = function(){
            var request = oRelayAjax.checknewversion();
            oUIUpgradeContorl.CallBackCheckNewVersion(request);
        };
        oUIUpgradeContorl.CallBackCheckNewVersion = function(request){
            oHtml.blockPage();
            request.done(function(msg, statustext, jqxhr) {
                oHtml.stopPage();                
                if(msg['Result'] === 0)
                {
                    if(msg['Version'] !== $('#txt_now_firmware').text())
                    {
                        CheckStatus = eCheckStatus.CanUpdate;
                        $('#txt_new_firmware').text(msg['Version']);                    
                    }
                    else
                    {
                        CheckStatus = eCheckStatus.NoNewVersion;
                        $('#txt_new_firmware').text('No New Version');                    
                    }
                }
                else{
                    alert('Error : failed to check new version. Please check network configuration.');
                }
            });
            request.fail(function(jqxhr, textStatus) {           
                oHtml.stopPage();
                oError.CheckAuth(jqxhr.status,ActionStatus.SystemCheckNewVersion);
            });
        };
        oUIUpgradeContorl.UpdateNewVersion = function(){
            var request = oRelayAjax.updatenewversion()();
            oUIUpgradeContorl.CallBackUpdateNewVersion(request);
        };
        oUIUpgradeContorl.CallBackUpdateNewVersion = function(request){
            request.done(function(msg, statustext, jqxhr) {
            });
            request.fail(function(jqxhr, textStatus) {           
            });
        };
        return oUIUpgradeContorl;
    }
};

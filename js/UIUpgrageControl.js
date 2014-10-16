var UIUpgradeControl = {
    createNew:function(oInputHtml,oInputRelayAjax){
        
        var oHtml = oInputHtml;
        var oRelayAjax = oInputRelayAjax;   
        var TimerCheckUpdate;
        var oUIUpgradeContorl={};
        var oError = {};
        var bSetInterval;
        oUIUpgradeContorl.bCheckUpdateFlag;        
        var i=0;
        oUIUpgradeContorl.Init = function(){   
            oError = ErrorHandle.createNew();     
            oUIUpgradeContorl.bCheckUpdateFlag = false;
            bSetInterval = false;
            $('#sup').click(function() {                
                oHtml.HideAllOption();
                oHtml.ShowOption(DivUpgrade);                
                oUIUpgradeContorl.ListVersion();
            });           
            $('#btn_check_firmware').click(function(){
                oUIUpgradeContorl.CheckNewVersion();
            });
            $('#btn_update_firmware').click(function(){
                
            });
            oUIUpgradeContorl.CheckUpdate();
//            oUIUpgradeContorl.CheckNewVersion();
        };                    
        oUIUpgradeContorl.CheckUpdate = function(){
            var request = oRelayAjax.checkupdate();
            oUIUpgradeContorl.CallBackCheckUpdate(request);
        };
        oUIUpgradeContorl.CallBackCheckUpdate = function(request){            
            if(i<2)
            {
                if(!bSetInterval)
                {                    
                    oHtml.blockPageMsg('Please Wait. System is updating.');
                    TimerCheckUpdate = setInterval(function(){oUIUpgradeContorl.CheckUpdate();}, 4000);
                    bSetInterval = true;
                }
                ++i;
            }
            else
            {                
                window.clearInterval(TimerCheckUpdate);   
                oUIUpgradeContorl.bCheckUpdateFlag = true;
            }
//            request.done(function(msg, statustext, jqxhr) {                
//            });
//            request.fail(function(jqxhr, textStatus) {                
//            });
        };
        oUIUpgradeContorl.ListVersion = function(){
            var request = oRelayAjax.listversion();
            oUIUpgradeContorl.CallBackListVersion(request);
        };
        oUIUpgradeContorl.CallBackListVersion = function(request){
            request.done(function(msg, statustext, jqxhr) {                
            });
            request.fail(function(jqxhr, textStatus) {                
            });
        };
        oUIUpgradeContorl.CheckNewVersion = function(){
            var request = oRelayAjax.checknewversion();
            oUIUpgradeContorl.CallBackCheckNewVersion(request);
        };
        oUIUpgradeContorl.CallBackCheckNewVersion = function(request){
            request.done(function(msg, statustext, jqxhr) {
            });
            request.fail(function(jqxhr, textStatus) {           
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

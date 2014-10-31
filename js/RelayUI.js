var IPList;
var GatewayList;
var DNSList;
var relayList;
var oRelayAjax = {};
var oHtmlCreate = {};
var oUIRelay = {};
var oUIIP = {};
var oUISystem = {};
var oUIUpgrade = {};
var SortDirection = {
    ASC:0,
    Desc:1
};
var SortType={
    Num:0,
    String:1
};
//function MyError(message) {
//    this.message = message || "Default Message";
//    alert(this.message);
//    $(document).ajaxStop($.unblockUI);
//}
//MyError.prototype = new Error();
//MyError.prototype.constructor = MyError;
var TimerCheckUpdateFlag;
function main() {    
    oRelayAjax = Relay.createNew();
    oHtmlCreate = CreateHtml.createNew();
    oUIRelay = UIRelayControl.createNew(oHtmlCreate,oRelayAjax);
    oUIIP = UIIPControl.createNew(oHtmlCreate,oRelayAjax);
    oUISystem = UISystemControl.createNew(oHtmlCreate,oRelayAjax);
    oUIUpgrade = UIUpgradeControl.createNew(oHtmlCreate,oRelayAjax);
    oHtmlCreate.HideAllOption();
    oHtmlCreate.InitWaitDialog();
    oUIIP.Init();
    oUISystem.Init();    
    oUIUpgrade.Init();
    TimerCheckUpdateFlag = setInterval(function(){CheckUpdateFlag();}, 500);
//    oUIRelay.Init();   
}

function CheckUpdateFlag()
{
    if(oUIUpgrade.bCheckUpdateFlag)
    {        
        window.clearInterval(TimerCheckUpdateFlag);         
        oUIRelay.Init();
    }
}

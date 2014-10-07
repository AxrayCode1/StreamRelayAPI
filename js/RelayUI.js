var IPList;
var GatewayList;
var DNSList;
var relayList;
var oRelayAjax = {};
var oHtmlCreate = {};
var oUIRelay = {};
var oUIIP = {};
function MyError(message) {
    this.message = message || "Default Message";
    alert(this.message);
    $(document).ajaxStop($.unblockUI);
}
MyError.prototype = new Error();
MyError.prototype.constructor = MyError;
function main() {
    oRelayAjax = Relay.createNew();
    oHtmlCreate = CreateHtml.createNew();
    oUIRelay = UIRelayControl.createNew(oHtmlCreate,oRelayAjax);
    oUIIP = UIIPControl.createNew(oHtmlCreate,oRelayAjax);
    oUIRelay.Init();
    oUIIP.Init();
}

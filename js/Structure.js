var relayClass = function(id, source, port, channelname) {
    this.id = id;
    this.source = source;
    this.port = port;
    this.channelname = channelname;
};
var IPClass = function(id, displayname, name, ip, mask) {
    this.id = id;
    this.displayname = displayname;
    this.name = name;
    this.ip = ip;
    this.mask = mask;
};
var GatewayClass = function(id, ip, bindport) {
    this.id = id;
    this.ip = ip;
    this.bindport = bindport;
};
var DNSClass = function(id, ip) {
    this.id = id;
    this.ip = ip;
};

var relaySourceClass = function(id,flag,url,prior)
{
    this.id = id;
    this.flag = flag;
    this.url = url;
    this.prior = prior;
};
var relayClass = function(id, source, port, destname,channelnumber,name,description,fulldest,status) {
    this.id = id;
    this.source = source;
    this.port = port;
    this.destname = destname;
    this.name = name;
    this.channelnumber = channelnumber;
    this.description = description;
    this.fulldest = fulldest;
    this.status = status;
};
var LogClass = function(type,source,fulldest,name,time,description){
    this.type = type;
    this.source = source;
    this.fulldest = fulldest;
    this.name = name;
    this.time = time;
    this.description = description;
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
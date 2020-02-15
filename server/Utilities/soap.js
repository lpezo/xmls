"use strict";

var soap = require('soap');
var fs = require('fs');
var http = require('http');
//var url = 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService?wsdl';
//var url = 'https://www.sunat.gob.pe/ol-it-wsconscpegem/billConsultService?wsdl';
var url = 'https://e-factura.sunat.gob.pe/ol-it-wsconsvalidcpe/billValidService?wsdl';
var options = {
    forceSoap12Headers: false
};

let getStatus = () => {
    soap.createClient(url, options, function (err, client) {
        if (err){
            console.log(err.message);
            return;
        }
        var wsSecurity = new soap.WSSecurity("20532710066MODDATOS", "moddatos", {})
        client.setSecurity(wsSecurity);
        client.getStatus({
            rucComprobante: '20101281451',
            tipoComprobante: '01',
            serieComprobante: 'F001',
            numeroComprobante: '00005977'
        },(err, res) => {
            if(err){
                console.error(err);
            }else{
                console.log(res);
            }
        });
    });
}

module.exports = {
    getStatus
};
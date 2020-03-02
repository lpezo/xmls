let root = [{name: "Invoice"}, {name: "CreditNote", tipo: "07"}, {name: "DebitNote", tipo: "08"}];

let defDefault = 
    [

        {"name": "tipodoc", "path": "cbc:InvoiceTypeCode", "desc": "Tipo de Documento", "formats":[{"cmd":"fill", "value":"00"}]},
        {"name": "serie", "path": "cbc:ID", "desc": "Serie", "formats": [{"cmd": "extract", "index":0, "sep":"-"}]},
        {"name": "num", "path": "cbc:ID", "desc": "Número de Documento", "formats": [{"cmd": "extract", "index":1, "sep":"-"}]},
        {"name": "fecha", "path": "cbc:IssueDate", "desc": "Fecha de Emisión"},

        {"name": "doc", "path": ["cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification/cbc:ID",
                                 "cac:AccountingSupplierParty/cbc:CustomerAssignedAccountID"], "desc": "Ruc Emisor"},
        {"name": "razon", "path": "cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName", "desc": "Nombre Emisor"},

        {"name": "moneda", "path": ["cac:LegalMonetaryTotal/cbc:PayableAmount/attr/@_currencyID",
                                    "cac:RequestedMonetaryTotal/cbc:PayableAmount/attr/@_currencyID"], "desc": "Moneda"},

        {"name": "line", "path": ["cac:InvoiceLine", "cac:CreditNoteLine", "cac:DebitNoteLine"], "desc": "Linea", "items": [
            {"name": "base_imponible", "path": "cbc:LineExtensionAmount", "desc":"Base Imponible", "group": "first"},
        ]},
        {"name": "igv", "path": "cac:TaxTotal/cbc:TaxAmount", "desc": "Igv"},
        {"name": "total", "path": ["cac:LegalMonetaryTotal/cbc:PayableAmount",
                                    "cac:RequestedMonetaryTotal/cbc:PayableAmount"], "desc": "Total"},
        
        {"name": "ruccli", "path": ["cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID",
                                    "cac:AccountingCustomerParty/cbc:CustomerAssignedAccountID"], "desc": "Ruc Cliente"},

        {"name": "nomcli", "path": "cac:AccountingCustomerParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName", "desc": "Nombre Cliente"},
        
        {"name": "line", "path": ["cac:InvoiceLine", "cac:CreditNoteLine", "cac:DebitNoteLine"], "desc": "Linea", "items": [
            {"name": "glosa", "path": "cac:Item/cbc:Description", "desc": "Glosa", "group": "first"}
        ]},

    ];
/*
let defDebiNote = 
    [
        {"name": "num", "path": "cbc:ID", "desc": "Número de Documento"},
        {"name": "fecha", "path": "cbc:IssueDate", "desc": "Fecha de Documento"},
        {"name": "hora", "path": "cbc:IssueTime", "desc": "Hora de Documento"},

        {"name": "doc", "path": "cac:AccountingSupplierParty/cbc:CustomerAssignedAccountID", "desc": "Ruc"},
        {"name": "tipo", "path": "cac:AccountingSupplierParty/cbc:AdditionalAccountID", "desc": "Tipo Documento"},
        {"name": "razon", "path": "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name", "desc": "Nombre Empresa"},

        //{"name": "ref", "path": "cac:Signature/cac:DigitalSignatureAttachment/cac:ExternalReference/cbc:URI", "desc": "Número Referencia"},

        {"name": "moneda", "path": "cac:RequestedMonetaryTotal/cbc:PayableAmount/attr/@_currencyID", "desc": "Moneda"},
        {"name": "total", "path": "cac:RequestedMonetaryTotal/cbc:PayableAmount", "desc": "Total"},
        {"name": "subtotal", "path": "cac:TaxTotal/cac:TaxSubtotal/cbc:TaxableAmount", "desc": "Sub Total"},
        {"name": "igv", "path": "cac:TaxTotal/cbc:TaxAmount", "desc": "Igv"},

        {"name": "line", "path": "cac:InvoiceLine", "desc": "Linea", "items": [
            {"name": "id", "path": "cbc:ID", "desc":"ID"},
            {"name": "base_imponible", "path": "cbc:LineExtensionAmount", "desc":"Base Imponible"},
            {"name": "glosa", "path": "cac:Item/cbc:Description", "desc": "Glosa"}
        ]}
    ];
*/

const getDoc = (data) => {
    let result = {};
    let def = defDefault;
    for (let cadaroot of root){
        if (data.hasOwnProperty(cadaroot.name)){
            data = data[cadaroot.name];
            if (cadaroot.tipo){
                result.tipodoc = cadaroot.tipo;
                //if (cadaroot.tipo == '08')
                //    def = defDebiNote;
            }
            break;
        }
    }
    for (let item of def){
        let obj = getobj(data, item);
        if (obj != null){
            if (item.items){
                /*
                if (Array.isArray(obj)){
                    let lines = obj.map(function(cadaline){
                        let line = {};
                        for (let cadaitem of item.items){
                            let valor = getobj(cadaline, cadaitem);
                            line[cadaitem.name] = valor;
                        }
                        return line;
                    });
                    obj = lines;
                } else {
                    let line = {};
                    for (let cadaitem of item.items){
                        let valor = getobj(obj, cadaitem);
                        line[cadaitem.name] = valor;
                    }
                    obj = [line];
                }
                */
               let lines = [];
               if (Array.isArray(obj)){
                    lines = obj.map(function(cadaline){
                        let line = {};
                        for (let cadaitem of item.items){
                            let valor = getobj(cadaline, cadaitem);
                            line[cadaitem.name] = valor;
                        }
                        return line;
                    });
                } else {
                    let line = {};
                    for (let cadaitem of item.items){
                        let valor = getobj(obj, cadaitem);
                        line[cadaitem.name] = valor;
                    }
                    lines = [line];
                }
                for (let cadaitem of item.items){
                    if (cadaitem.group == 'first'){
                        if (lines.length > 0)
                            result[cadaitem.name] = lines[0][cadaitem.name];
                        else
                            result[cadaitem.name] = null;
                    }
                }
            } else if (item.formats) {
                for (let format of item.formats){
                    switch (format.cmd){
                    case 'extract':
                        if (typeof(obj) == 'string'){
                            let aobj = obj.split(format.sep);
                            if (format.index < aobj.length)
                                obj = aobj[format.index];
                        }
                        break;
                    case 'fill':
                        let filled = format.value + obj.toString();
                        obj = filled.substr(filled.length - format.value.length);
                    }
                }
            }
        }
        if (typeof(obj) == 'number')
            obj = obj.toString();
        if (!item.items){
            if (!result[item.name])
                result[item.name] = obj;
            
        }
    }
    /*
    if (typeof(result.tipodoc) == "string" && result.tipodoc.length == 1){
        result.tipodoc = "0" + result.tipodoc;
    }
    */
    /*
    if (result.num){
        let anum = result.num.split('-');
        if (anum.length > 0)
            result.serie = anum[0];
        if (anum.length > 1)
            result.num = anum[1];
    }
    */
    return result;
}

const getobj = (data, item) => {
    let obj = data;
    if (Array.isArray(item.path)){
        for (let cadapath of item.path){
            obj = data;
            cadapath.split('/').forEach(function(tag){
                if (obj != null && obj.hasOwnProperty(tag))
                    obj = obj[tag];
                else
                    obj = null;
            });
            if (obj != null)
                break;
        }
    }
    else {
        item.path.split('/').forEach(function(tag){
            if (obj != null && obj.hasOwnProperty(tag))
                obj = obj[tag];
            else
                obj = null;
        });
    }
    if (obj != null){
        if (obj.__cdata)
            obj = obj.__cdata;
        else if (obj["#text"])
            obj = obj["#text"];
    }
    return obj;
}

module.exports = {
    getDoc,
    def: defDefault
};

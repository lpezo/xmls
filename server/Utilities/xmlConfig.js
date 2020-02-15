let root = [{name: "Invoice"}, {name: "CreditNote", tipo: "07"}, {name: "DebitNote", tipo: "08"}];

let defDefault = 
    [
        {"name": "num", "path": "cbc:ID", "desc": "Número de Documento"},
        {"name": "fecha", "path": "cbc:IssueDate", "desc": "Fecha de Documento"},
        {"name": "hora", "path": "cbc:IssueTime", "desc": "Hora de Documento"},

        {"name": "doc", "path": "cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification/cbc:ID", "desc": "Numero Documento"},
        {"name": "razon", "path": "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name", "desc": "Nombre Empresa"},

        {"name": "ref", "path": "cac:Signature/cac:DigitalSignatureAttachment/cac:ExternalReference/cbc:URI", "desc": "Número Referencia"},

        {"name": "moneda", "path": "cac:LegalMonetaryTotal/cbc:PayableAmount/attr/@_currencyID", "desc": "Moneda"},
        {"name": "total", "path": "cac:LegalMonetaryTotal/cbc:PayableAmount", "desc": "Total"},
        {"name": "subtotal", "path": "cac:TaxTotal/cac:TaxSubtotal/cbc:TaxableAmount", "desc": "Sub Total"},
        {"name": "igv", "path": "cac:TaxTotal/cbc:TaxAmount", "desc": "Igv"},
    ];

let defDebiNote = 
    [
        {"name": "num", "path": "cbc:ID", "desc": "Número de Documento"},
        {"name": "fecha", "path": "cbc:IssueDate", "desc": "Fecha de Documento"},
        {"name": "hora", "path": "cbc:IssueTime", "desc": "Hora de Documento"},

        {"name": "doc", "path": "cac:AccountingSupplierParty/cbc:CustomerAssignedAccountID", "desc": "Ruc"},
        {"name": "tipo", "path": "cac:AccountingSupplierParty/cbc:AdditionalAccountID", "desc": "Tipo Documento"},
        {"name": "razon", "path": "cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name", "desc": "Nombre Empresa"},

        {"name": "ref", "path": "cac:Signature/cac:DigitalSignatureAttachment/cac:ExternalReference/cbc:URI", "desc": "Número Referencia"},

        {"name": "moneda", "path": "cac:RequestedMonetaryTotal/cbc:PayableAmount/attr/@_currencyID", "desc": "Moneda"},
        {"name": "total", "path": "cac:RequestedMonetaryTotal/cbc:PayableAmount", "desc": "Total"},
        {"name": "subtotal", "path": "cac:TaxTotal/cac:TaxSubtotal/cbc:TaxableAmount", "desc": "Sub Total"},
        {"name": "igv", "path": "cac:TaxTotal/cbc:TaxAmount", "desc": "Igv"},
    ];


const getDoc = (data) => {
    let result = {};
    let def = defDefault;
    for (let cadaroot of root){
        if (data.hasOwnProperty(cadaroot.name)){
            data = data[cadaroot.name];
            if (cadaroot.tipo){
                result.tipodoc = cadaroot.tipo;
                if (cadaroot.tipo == '08')
                    def = defDebiNote;
            }
            break;
        }
    }
    for (let item of def){
        let obj = data;
        item.path.split('/').forEach(function(tag){
            if (obj != null && obj.hasOwnProperty(tag))
                obj = obj[tag];
            else
                obj = null;
        });
        if (obj != null){
            if (obj.__cdata)
                obj = obj.__cdata;
            else if (obj["#text"])
                obj = obj["#text"];
        }
        if (typeof(obj) == 'number')
            obj = obj.toString();
        result[item.name] = obj;
    }
    return result;
}

module.exports = {
    getDoc
};

let root = ["Invoice", "CreditNote"];

let def = 
    [
        {"name": "num", "path": "cbc:ID", "desc": "Número de Documento"},
        {"name": "fecha", "path": "cbc:IssueDate", "desc": "Fecha de Documento"},
        {"name": "hora", "path": "cbc:IssueTime", "desc": "Hora de Documento"},

        {"name": "ruc", "path": "cac:Signature/cac:SignatoryParty/cac:PartyIdentification/cbc:ID", "desc": "Ruc"},
        {"name": "razon", "path": "cac:Signature/cac:SignatoryParty/cac:PartyName/cbc:Name", "desc": "Nombre Empresa"},
        {"name": "ref", "path": "cac:Signature/cac:DigitalSignatureAttachment/cac:ExternalReference/cbc:URI", "desc": "Número Referencia"},

        {"name": "total", "path": "cac:LegalMonetaryTotal/cbc:PayableAmount", "desc": "Total"},
        {"name": "subtotal", "path": "cac:TaxTotal/cac:TaxSubtotal/cbc:TaxableAmount", "desc": "Sub Total"},
        {"name": "igv", "path": "cac:TaxTotal/cbc:TaxAmount", "desc": "Igv"},
    ];

const getDoc = (data) => {
    let result = {};
    for (let cadaroot of root){
        if (data.hasOwnProperty(cadaroot)){
            data = data[cadaroot];
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
        result[item.name] = obj;
    }
    return result;
}

module.exports = {
    def, getDoc
};

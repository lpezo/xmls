let def = 
    [
        {"name": "num", "path": "Invoice/cbc:ID", "desc": "Número de Documento"},
        {"name": "fecha", "path": "Invoice/cbc:IssueDate", "desc": "Fecha de Documento"},
        {"name": "hora", "path": "Invoice/cbc:IssueTime", "desc": "Hora de Documento"},

        {"name": "ruc", "path": "Invoice/cac:Signature/cac:SignatoryParty/cac:PartyIdentification/cbc:ID", "desc": "Ruc"},
        {"name": "razon", "path": "Invoice/cac:Signature/cac:SignatoryParty/cac:PartyName/cbc:Name", "desc": "Nombre Empresa"},
        {"name": "ref", "path": "Invoice/cac:Signature/cac:DigitalSignatureAttachment/cac:ExternalReference/cbc:URI", "desc": "Número Referencia"},

        {"name": "total", "path": "Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount", "desc": "Total"},
        {"name": "subtotal", "path": "Invoice/cac:TaxTotal/cac:TaxSubtotal/cbc:TaxableAmount", "desc": "Sub Total"},
        {"name": "igv", "path": "Invoice/cac:TaxTotal/cbc:TaxAmount", "desc": "Igv"},
    ];

module.exports = {
    def
};

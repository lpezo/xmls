const mailjet = require ('node-mailjet')
    .connect("f623242b8aed2aad875b62661dad502a", "e741e29abdeca8ea8174617656b48592")
    
    const sendEmail = (recipient, subject, bodyhtml) => {
        return mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[
                {
                    "From": {
                        "Email": "support@xmlanalytic.com",
                        "Name": "xml analytic"
                    },
                    "To": [
                        {
                        "Email": recipient
                        }
                    ],
                    "Subject": subject,
                    "TextPart": "",
                    "HTMLPart": bodyhtml
                }
            ]
        })
        /*
        .then((result) => {
            // do something with the send result or ignore
        })
        .catch((err) => {
            // handle an error
        })
        */
    }

module.export = {
    sendEmail
}
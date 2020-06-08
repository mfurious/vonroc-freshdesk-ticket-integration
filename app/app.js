const BASE_URL_1 = "<%= iparam.url1 %>/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_email&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=Complete&searchCriteria[filterGroups][1][filters][0][conditionType]=in&searchCriteria[filterGroups][0][filters][0][value]=";
const BASE_URL_2 = "<%= iparam.url2 %>/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_email&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=Complete&searchCriteria[filterGroups][1][filters][0][conditionType]=in&searchCriteria[filterGroups][0][filters][0][value]=";
$(document).ready(() => {
    app.initialized().then(
        function(_client) {
        client = _client;
        client.events.on('app.activated', () => {
            console.log("app activated")
            getNewList()
        });
    });
});

getNewList = () => { 
    $(".links").remove();
    $("#title").remove();
    $(".orderM").remove();
    getContactData(client);

}

getContactData = client => {
    client.data.get('contact').then(data => {
        var userEmail = data.contact.email;
        getUser(userEmail);
    })
};

getUser = email => {
    var method = "get";
    var url = BASE_URL_1 + email;
    var options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer <%= iparam.a %>'
    }}

    client.request[method](url, options).then(data => {
        parsedResponseM = JSON.parse(data.response);
        console.log(parsedResponseM)
        // createQuicklist(i)
        createOrderList() 
    })  
};

createOrderList = () => {
    var i = 0
    if (parsedResponseM.items.length !== 0){
        if (parsedResponseM.items.length > 1) {
            $(".quickListTitle").append(
                `<h2 id="title"><b>Snel Zoeken</b></h2>`            
            )
            parsedResponseM.items.forEach(item => {
                $(".quickListBody").append(
                    `<div class=links>
                        <p> 
                            <b>Bestelling:</b>  
                            <a href=#bestelnummer-${i}>${item.increment_id}</a> 
                        <br> 
                        </p>
                    </div>`
                ) 
            i++
            });
            i = 0
        }
        
        while (parsedResponseM.items[i]) {
            $(".orderList").append(
                `<div class=orderM>
                    <div class=algemeen>
                        <h2 id=bestelnummer-${i}>Bestelling:</h2>
                        <br>
                        <p>
                            <b>Bestelnummer: </b><br>
                            <a href="https://vonroc.com/admin_8yhl9t/sales/order/view/order_id/${parsedResponseM.items[i].entity_id}" target="_blank" id=ordernummer>#${parsedResponseM.items[i].increment_id}</a>
                        </p>    
                    </div>

                    <div class=verzending>
                        <h3>Verzending</h3>
                        <p id=dpd>
                            <b>Track & Trace:</b> <br>
                            <i>track en trace code</i>
                        </p>
                    </div>

                    <div id=betaling>
                        <h3>Betaling</h3>
                        <p><b>Betalingskenmerk:</b>
                            <a href="https://ca-live.adyen.com/ca/ca/accounts/showTx.shtml?txType=Payment&pspReference=${parsedResponseM.items[i].payment.cc_trans_id}" target="_blank">${parsedResponseM.items[i].payment.cc_trans_id}</a>
                        </p>
                        <p>
                            <b>Bedrag exclusief BTW:</b> <br>
                            <i>€${parsedResponseM.items[i].base_subtotal}</i>
                        </p>
                        <p>
                            <b>BTW:</b> <br>
                            <i>€${parsedResponseM.items[i].base_tax_amount}</i>
                        </p>
                        <p>
                            <b>Bedrag inclusief BTW:</b> <br>
                            <i>€${parsedResponseM.items[i].base_subtotal_incl_tax}</i>
                        </p>
                    </div>
                <a href="#anchorpoint-top">Terug naar boven</a>
                <hr>
                </div>`
            );
            i++ 
        }    
    } else {
        $(".orderList").append(
            `<div class=orderM>
                <p>Er zijn geen bijbehorende orders gevonden</p>
            </div>`
        );
    }
};


//VV Beta functions VV


// Returns EDI orders
// getEdi = email => {
//     var method = "get";
//     var url = BASE_URL_2 + email;
//     var options = {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer <%= iparam.a2 %>`
//     }}
    
//     client.request[method](url, options).then(function (data) {
//         parsedResponseE = JSON.parse(data.response);
//         console.log(parsedResponseE)
//         createOrderList()
//     })
// };

// Prints the orderdetails in a HTML template


// End of script



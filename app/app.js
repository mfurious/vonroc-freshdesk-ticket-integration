const BASE_URL_1 =
  "<%= iparam.url1 %>/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_email&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=Complete&searchCriteria[filterGroups][1][filters][0][conditionType]=in&searchCriteria[filterGroups][0][filters][0][value]=";
const BASE_URL_2 =
  "<%= iparam.url2 %>/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_email&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=status&searchCriteria[filterGroups][1][filters][0][value]=Complete&searchCriteria[filterGroups][1][filters][0][conditionType]=in&searchCriteria[filterGroups][0][filters][0][value]=";

$(document).ready(() => {
  app
    .initialized()
    .then(function (_client) {
      client = _client;
      client.events.on("app.activated", () => {
        getNewList();
      });
    })
    .catch((e) => {
      console.log("Error: " + e);
    });
});

getNewList = () => {
  $(".links").remove();
  $("#title").remove();
  $(".orderM").remove();
  getContactData(client);
};

getContactData = (client) => {
  client.data.get("contact").then((data) => {
    getUser(data);
  });
};

getUser = (clientData) => {
  var email = clientData.contact.email;
  var method = "get";
  var url = BASE_URL_1 + email;
  var options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer <%= iparam.a %>",
    },
  };

  client.request[method](url, options).then((data) => {
    parsedData = JSON.parse(data.response);
    createOrderList(parsedData);
  });
};

createOrderList = (data) => {
  var i = 0;
  if (data.items.length !== 0) {
    if (data.items.length > 1) {
      $(".quickListTitle").append(`<h2 id="title"><b>Snel Zoeken</b></h2>`);
      data.items.forEach((item) => {
        $(".quickListBody").append(
          `<div class=links>
                        <p> 
                            <b>Bestelling:</b>  
                            <a href=#bestelnummer-${i}>${item.increment_id}</a>
                        <br> 
                        </p>
                    </div>`
        );
        i++;
      });
      i = 0;
    }

    while (data.items[i]) {
      console.log(data);
      var purchaseDateView = data.items[i].created_at
        .split(" ", 1)
        .reverse()
        .join("-"); //fix this bug
      var purchaseDate =
        Date.parse(data.items[i].created_at.split(" ", 1)) / 1000;
      var requestDate =
        Date.parse(data.items[i].created_at.split("T", 1)) / 1000;
      var warrantyDate = purchaseDate + 63113852;

      $(".orderList").append(
        `<div class=orderM>
                    <div class=algemeen>
                        <h2 id=bestelnummer-${i}>Bestelling:</h2>
                        <br>
                        <p>
                            <b>Bestelnummer: </b><br>
                            <a href="https://vonroc.com/admin_8yhl9t/sales/order/view/order_id/${data.items[i].entity_id}" target="_blank" id=ordernummer>#${data.items[i].increment_id}</a>
                            <br><br>
                            <b>Besteldatum: </b><br>
                            ${purchaseDateView} <br>
                            <div>
                            <p id="garantieControle${i}"><b>Klant heeft recht op garantie:</b><br></p>
                            <div>
                        </p>    
                    </div>

                    <div class="fw-divider"></div>
                
                    <div class="Verzending">
                        <h3>Verzending</h3>
                        <p id=dpd>
                            <b>Track & Trace:</b> <br>
                            <i>track en trace code</i>
                        </p>
                    </div>

                    <div class="fw-divider"></div>

                    <div id=betaling>
                        <h3>Betaling</h3>
                        <p><b>Betalingskenmerk:</b>
                            <a href="https://ca-live.adyen.com/ca/ca/accounts/showTx.shtml?txType=Payment&pspReference=${data.items[i].payment.cc_trans_id}" target="_blank">${data.items[i].payment.cc_trans_id}</a>
                        </p>
                        <p>
                            <b>Bedrag exclusief BTW:</b> <br>
                            <i>€${data.items[i].base_subtotal}</i>
                        </p>
                        <p>
                            <b>BTW:</b> <br>
                            <i>€${data.items[i].base_tax_amount}</i>
                        </p>
                        <p>
                            <b>Bedrag inclusief BTW:</b> <br>
                            <i>€${data.items[i].base_subtotal_incl_tax}</i>
                        </p>
                    </div>
                <a href="#anchorpoint-top">Terug naar boven</a>
                <hr>
                </div>`
      );

      if (warrantyDate < requestDate) {
        $(`#garantieControle${i}`).append(`
                <p style="color:red"><b>Nee</b></p>`);
      } else {
        $(`#garantieControle${i}`).append(`
                <p style="color:green"><b>Ja</b></p>`);
      }

      i++;
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

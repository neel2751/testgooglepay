

const canMakePaymentCache = 'canMakePaymentCache';

function onBuyClicked() {
    if (!window.PaymentRequest) {
        console.log('Web payments are not supported in this browser.');
        return;
    }


    const supportedInstruments = [
        {
            supportedMethods: ['https://tez.google.com/pay'],
            data: {
                pa: '9574448644@okbizaxis',
                pn: 'Mobile Market',
                tr: '564BCF56',  // your custom transaction reference ID
                url: 'https://neel2751.github.io/',
                mc: '0000', // your merchant category code
                tn: 'Purchase in Merchant',// your GSTIN
            },
        }
    ];


    const details = {
        total: {
            label: 'Total',
            amount: {
                currency: 'INR',
                value: '10.01', // sample amount
            },
        },
        displayItems: [{
            label: 'Original Amount',
            amount: {
                currency: 'INR',
                value: '10.01',
            },
        }],
    };


    let request = null;
    try {
        request = new PaymentRequest(supportedInstruments, details);
    } catch (e) {
        console.log('Payment Request Error: ' + e.message);
        return;
    }
    if (!request) {
        console.log('Web payments are not supported in this browser.');
        return;
    }


}



/**
    * Check whether can make payment with Google Pay or not. It will check session storage
    * cache first and use the cache directly if it exists. Otherwise, it will call
    * canMakePayment method from PaymentRequest object and return the result, the
    * result will also be stored in the session storage cache for future usage.
    *
    * @private
    * @param {PaymentRequest} request The payment request object.
    * @return {Promise} a promise containing the result of whether can make payment.
    */
function checkCanMakePayment(request) {
    // Check canMakePayment cache, use cache result directly if it exists.
    if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
        return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
    }

    // If canMakePayment() isn't available, default to assume the method is
    // supported.
    var canMakePaymentPromise = Promise.resolve(true);

    // Feature detect canMakePayment().
    if (request.canMakePayment) {
        canMakePaymentPromise = request.canMakePayment();
    }

    return canMakePaymentPromise
        .then((result) => {
            // Store the result in cache for future usage.
            sessionStorage[canMakePaymentCache] = result;
            return result;
        })
        .catch((err) => {
            console.log('Error calling canMakePayment: ' + err);
        });
}

function showPaymentUI(request, canMakePayment) {
    if (!canMakePayment) {
        handleNotReadyToPay();
        return;
    }

    // Set payment timeout.
    let paymentTimeout = window.setTimeout(function () {
        window.clearTimeout(paymentTimeout);
        request.abort()
            .then(function () {
                console.log('Payment timed out after 20 minutes.');
            })
            .catch(function () {
                console.log('Unable to abort, user is in the process of paying.');
            });
    }, 20 * 60 * 1000); /* 20 minutes */

    request.show()
        .then(function (instrument) {

            window.clearTimeout(paymentTimeout);
            processResponse(instrument); // Handle response from browser.
        })
        .catch(function (err) {
            console.log(err);
        });
}

function handleNotReadyToPay() {
    alert('Google Pay is not ready to pay.');
}

function processResponse(instrument) {
    var instrumentString = instrumentToJsonString(instrument);
    console.log(instrumentString);

    fetch('/buy', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: instrumentString,
    })
        .then(function (buyResult) {
            if (buyResult.ok) {
                return buyResult.json();
            }
            console.log('Error sending instrument to server.');
        })
        .then(function (buyResultJson) {
            completePayment(instrument, buyResultJson.status, buyResultJson.message);

        })
        .catch(function (err) {
            console.log('Unable to process payment. ' + err);
        });
}

function completePayment(instrument, result, msg) {
    instrument.complete(result)
        .then(function () {
            console.log('Payment succeeds.');
            console.log(msg);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function paymentResponseToJsonString(paymentResponse) {
    // PaymentResponse is an interface, JSON.stringify works only on dictionaries.
    var paymentResponseDictionary = {
        methodName: paymentResponse.methodName,
        details: paymentResponse.details,
        shippingAddress: addressToJsonString(paymentResponse.shippingAddress),
        shippingOption: paymentResponse.shippingOption,
        payerName: paymentResponse.payerName,
        payerPhone: paymentResponse.payerPhone,
        payerEmail: paymentResponse.payerEmail,
    };
    return JSON.stringify(paymentResponseDictionary, undefined, 2);
}
// document.addEventListener('DOMContentLoaded', async () => {
// Load the publishable key from the server. The publishable key
// is set in your .env file. In practice, most users hard code the
// publishable key when initializing the Stripe object.
// const { publishableKey } = await fetch('/config').then((r) => r.json());
// if (!publishableKey) {
//     addMessage(
//         'No publishable key returned from the server. Please check `.env` and try again'
//     );
//     alert('Please set your Stripe publishable API key in the .env file');
// }

// 1. Initialize Stripe
// const stripe = Stripe(publishableKey, {
//     apiVersion: '2020-08-27',
// });

var stripe = Stripe('pk_test_51JFXAbSGkyW1mtgfh190tvzrZmvMA2xJjoVOHeGiw37wxJRLOtL2WbzN1UfAV3dUfpecaDly4TWDq8qJU6E4slmI00riBVayKB', {
    apiVersion: "2020-08-27",
});

// 2. Create a payment request object
var paymentRequest = stripe.paymentRequest.create({
    country: 'IN',
    currency: 'inr',
    total: {
        label: 'Demo total',
        amount: 10000,
    },
    requestPayerName: true,
    requestPayerEmail: true,
});

// 3. Create a PaymentRequestButton element
const elements = stripe.elements();
const prButton = elements.create('paymentRequestButton', {
    paymentRequest: paymentRequest,
});

// Check the availability of the Payment Request API,
// then mount the PaymentRequestButton
paymentRequest.canMakePayment().then(function (result) {
    if (result) {
        prButton.mount('#payment-request-button');
    } else {
        document.getElementById('payment-request-button').style.display = 'none';
        console.log(result);
        console.log('google pay not found');
        // addMessage('Google Pay support not found. Check the pre-requisites above and ensure you are testing in a supported browser.');
    }
});

paymentRequest.on('paymentmethod', function (e) {
    // Make a call to the server to create a new
    // payment intent and store its client_secret.
    const { error: backendError, clientSecret } = fetch(
        './checkout.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currency: 'inr',
                paymentMethodType: 'card',
            }),
        }
    ).then((r) => r.json());

    if (backendError) {
        addMessage(backendError.message);
        e.complete('fail');
        return;
    }

    console.log(`Client secret returned.`);

    // Confirm the PaymentIntent without handling potential next actions (yet).
    let { error, paymentIntent } = stripe.confirmCardPayment(
        clientSecret,
        {
            payment_method: e.paymentMethod.id,
        },
        {
            handleActions: false,
        }
    );

    if (error) {
        console.log(error.message);

        // Report to the browser that the payment failed, prompting it to
        // re-show the payment interface, or show an error message and close
        // the payment interface.
        e.complete('fail');
        return;
    }
    // Report to the browser that the confirmation was successful, prompting
    // it to close the browser payment method collection interface.
    e.complete('success');

    // Check if the PaymentIntent requires any actions and if so let Stripe.js
    // handle the flow. If using an API version older than "2019-02-11" instead
    // instead check for: `paymentIntent.status === "requires_source_action"`.
    if (paymentIntent.status === 'requires_action') {
        // Let Stripe.js handle the rest of the payment flow.
        let { error, paymentIntent } = stripe.confirmCardPayment(
            clientSecret
        );
        if (error) {
            // The payment failed -- ask your customer for a new payment method.
            console.log(error.message);
            return;
        }
        console.log(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    }

    console.log(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
});
// });
// // var clientSecret = "ca_JtmYDMUVp4iUDjPWTsGIKGsLlZZfBXN7"; 

// // document.addEventListener('DOMContentLoaded', async () => {
//     // 1. Initialize Stripe

    
//     // var stripe = Stripe('pk_test_51JFXAbSGkyW1mtgfh190tvzrZmvMA2xJjoVOHeGiw37wxJRLOtL2WbzN1UfAV3dUfpecaDly4TWDq8qJU6E4slmI00riBVayKB', {
//     //     apiVersion: "2020-08-27",
//     // });

  
//     // // 2. Create a payment request object
//     // var paymentRequest = stripe.paymentRequest({
//     //   country: 'IN',
//     //   currency: 'inr',
//     //   total: {
//     //     label: 'Demo total',
//     //     amount: 1000,
//     //   },
//     //   requestPayerName: true,
//     //   requestPayerEmail: true,
//     // });
  
//     // 3. Create a PaymentRequestButton element
//     const elements = stripe.elements();
//     const prButton = elements.create('paymentRequestButton', {
//       paymentRequest: paymentRequest,
//     });
  
//     // Check the availability of the Payment Request API,
//     // then mount the PaymentRequestButton
//     paymentRequest.canMakePayment().then(function (result) {
//       if (result) {
//         prButton.mount('#payment-request-button');
//       } else {
//         document.getElementById('payment-request-button').style.display = 'none';
//         addMessage('Google Pay support not found. Check the pre-requisites above and ensure you are testing in a supported browser.');
//       }
//     });

//     paymentRequest.on('paymentmethod', function(ev) {
//         // Confirm the PaymentIntent without handling potential next actions (yet).
//         stripe.confirmCardPayment(
//           clientSecret,
//           {payment_method: ev.paymentMethod.id},
//           {handleActions: false}
//         ).then(function(confirmResult) {
//           if (confirmResult.error) {
//               console.log(ev);
//             // Report to the browser that the payment failed, prompting it to
//             // re-show the payment interface, or show an error message and close
//             // the payment interface.
//             ev.complete('fail');
//           } else {
//             // Report to the browser that the confirmation was successful, prompting
//             // it to close the browser payment method collection interface.
//             ev.complete('success');
//             // Check if the PaymentIntent requires any actions and if so let Stripe.js
//             // handle the flow. If using an API version older than "2019-02-11"
//             // instead check for: `paymentIntent.status === "requires_source_action"`.
//             if (confirmResult.paymentIntent.status === "requires_action") {
//               // Let Stripe.js handle the rest of the payment flow.
//               stripe.confirmCardPayment(clientSecret).then(function(result) {
//                 if (result.error) {
//                     console.log(result);
//                   // The payment failed -- ask your customer for a new payment method.
//                 } else {
//                   // The payment has succeeded.
//                 }
//               });
//             } else {
//               // The payment has succeeded.
//             }
//           }
//         });
//       });
  
// //     paymentRequest.on('paymentmethod', async (e) => {
// //         console.log(e);
// //       // Make a call to the server to create a new
// //       // payment intent and store its client_secret.
// //       const {error: backendError, clientSecret} = await fetch('https://neel2751.github.io/testgooglepay',
// //         {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({
// //             currency: 'inr',
// //             paymentMethodType: 'card',
// //           }),
// //         }
// //       ).then((r) => r.json());
// //       console.log(r);
  
// //       if (backendError) {
// //           console.log(e);
// //         addMessage(backendError.message);
// //         e.complete('fail');
// //         return;
// //       }
  
// //       addMessage(`Client secret returned.`);
  
// //       // Confirm the PaymentIntent without handling potential next actions (yet).
// //       let {error, paymentIntent} = await stripe.confirmCardPayment(
// //           console.log(clientSecret),
// //         clientSecret,
// //         {
// //           payment_method: e.paymentMethod.id,
// //         },
// //         {
// //           handleActions: false,
// //         }
// //       );
  
// //       if (error) {
// //         addMessage(error.message);
  
// //         // Report to the browser that the payment failed, prompting it to
// //         // re-show the payment interface, or show an error message and close
// //         // the payment interface.
// //         e.complete('fail');
// //         return;
// //       }
// //       // Report to the browser that the confirmation was successful, prompting
// //       // it to close the browser payment method collection interface.
// //       e.complete('success');
  
// //       // Check if the PaymentIntent requires any actions and if so let Stripe.js
// //       // handle the flow. If using an API version older than "2019-02-11" instead
// //       // instead check for: `paymentIntent.status === "requires_source_action"`.
// //       if (paymentIntent.status === 'requires_action') {
// //         // Let Stripe.js handle the rest of the payment flow.
// //         let {error, paymentIntent} = await stripe.confirmCardPayment(
// //           clientSecret
// //         );
// //         if (error) {
// //           // The payment failed -- ask your customer for a new payment method.
// //           addMessage(error.message);
// //           return;
// //         }
// //         addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
// //       }
  
// //       addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
// //     });
// //   });
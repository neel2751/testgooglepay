<?php

require_once('./stripe/init.php');

\Stripe\Stripe::setApiKey('sk_test_51JFXAbSGkyW1mtgfB7szsploYLMtaPMZChBA5PcF0egUZMsCAANE0S2HEUoSjLiZls1xF0vgPOV5IXcu5wb9p0co00FVAvxQcP');
\Stripe\Stripe::setApiKey('sk_test_tR3PYbcVNZZ796tH88S4VQ2u');

$intent = \Stripe\PaymentIntent::create([
    'amount' => 1099,
    'currency' => 'inr',
]);

// header('Content-Type: application/json');

// try {
//     // retrieve JSON from POST body
//     $json_str = file_get_contents('php://input');
//     $json_obj = json_decode($json_str);

//     $paymentIntent = \Stripe\PaymentIntent::create([
//         'paymentMethodType' => 'card',
//         'currency' => 'inr',
//     ]);

//     $output = [
//         'clientSecret' => $paymentIntent->client_secret,
//     ];

//     echo json_encode($output);
// } catch (Error $e) {
//     http_response_code(500);
//     echo json_encode(['error' => $e->getMessage()]);
// }

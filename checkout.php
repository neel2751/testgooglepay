<?php
// require_once 'shared.php';
require_once './stripe/init.php';

 \Stripe\Stripe::setApiKey('sk_test_51JFXAbSGkyW1mtgfB7szsploYLMtaPMZChBA5PcF0egUZMsCAANE0S2HEUoSjLiZls1xF0vgPOV5IXcu5wb9p0co00FVAvxQcP');

header('Content-Type: application/json');

try {
    $paymentIntent = $stripe->paymentIntents->create([
        'payment_method_types' => ['card'],
        'amount' => 1999,
        'currency' => 'inr',
    ]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    http_response_code(400);
    error_log($e->getError()->message);


echo json_encode($output);
} catch (Error $e) {
http_response_code(500);
echo json_encode(['error' => $e->getMessage()]);
}

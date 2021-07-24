<?php

require_once('./stripe/init.php');

\Stripe\Stripe::setApiKey('sk_test_51JFXAbSGkyW1mtgfB7szsploYLMtaPMZChBA5PcF0egUZMsCAANE0S2HEUoSjLiZls1xF0vgPOV5IXcu5wb9p0co00FVAvxQcP');

$intent = \Stripe\PaymentIntent::create([
    'amount' => 10000,
    'currency' => 'inr',
]);

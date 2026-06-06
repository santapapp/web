<?php

require 'C:/laragon/www/api-santap/vendor/autoload.php';
$app = require_once 'C:/laragon/www/api-santap/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$order = App\Models\Order::latest()->with('items')->first();

if ($order) {
    echo json_encode($order->toArray(), JSON_PRETTY_PRINT) . "\n";
} else {
    echo "No orders found\n";
}

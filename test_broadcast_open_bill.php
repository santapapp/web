<?php

require 'C:/laragon/www/api-santap/vendor/autoload.php';
$app = require_once 'C:/laragon/www/api-santap/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Order;
use App\Events\OpenBillRepeatOrderCreated;
use App\Enums\OrderType;
use App\Enums\BillStatus;

// Get Order ID from command line argument, or find latest active Open Bill
$orderId = isset($argv[1]) ? (int) $argv[1] : null;

if ($orderId) {
    $order = Order::with('items')->find($orderId);
    if (!$order) {
        echo "Error: Order with ID {$orderId} not found.\n";
        exit(1);
    }
} else {
    $order = Order::where('order_type', OrderType::OpenBill)
        ->where('bill_status', BillStatus::Open)
        ->latest()
        ->with('items')
        ->first();
        
    if (!$order) {
        echo "Error: No active Open Bill session found in database.\n";
        echo "Please create an open bill session from the cashier mobile app or DB first.\n";
        exit(1);
    }
}

echo "Found Open Bill:\n";
echo "  Order ID: {$order->id}\n";
echo "  Order Number: {$order->order_number}\n";
echo "  Public Token: {$order->public_token}\n";
echo "  Total Amount: {$order->total_amount}\n";
echo "  Bill Status: " . ($order->bill_status?->value ?? $order->bill_status) . "\n";
echo "  Total Items: " . $order->items->count() . "\n\n";

// Try to find the latest batch from existing items, or default to a new fake batch
$latestItem = $order->items->sortByDesc('id')->first();
$batchUuid = $latestItem ? $latestItem->batch_uuid : (string) Illuminate\Support\Str::uuid();
$batchNumber = $latestItem ? ($latestItem->batch_number ?? 1) : 1;

$batchItems = $order->items->where('batch_uuid', $batchUuid);
$itemsCount = $batchItems->count();
$batchTotal = (float) $batchItems->sum('subtotal');
$submittedAt = $latestItem && $latestItem->submitted_at 
    ? $latestItem->submitted_at->toIso8601String() 
    : now()->toIso8601String();

$batch = [
    'batch_uuid' => $batchUuid,
    'batch_number' => $batchNumber,
    'items_count' => $itemsCount,
    'batch_total' => $batchTotal,
    'submitted_at' => $submittedAt,
];

echo "Simulating repeat order broadcast with batch details:\n";
echo json_encode($batch, JSON_PRETTY_PRINT) . "\n\n";

// Construct and dispatch the event
$event = OpenBillRepeatOrderCreated::fromOrder($order, $batch);
event($event);

echo "Event 'repeat-order-created' has been successfully broadcasted!\n";
echo "Broadcast channels:\n";
foreach ($event->broadcastOn() as $channel) {
    echo "  - " . (string) $channel . "\n";
}
echo "\nPayload sent:\n";
$payload = [
    'billId' => $event->billId,
    'organizationId' => $event->organizationId,
    'tableId' => $event->tableId,
    'orderNumber' => $event->orderNumber,
    'batch' => $event->batch,
    'items' => $event->items,
    'orderTotal' => $event->orderTotal,
    'billStatus' => $event->billStatus,
];
echo json_encode($payload, JSON_PRETTY_PRINT) . "\n";

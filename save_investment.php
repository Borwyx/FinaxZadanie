<?php
$input = file_get_contents("php://input");
$investment = json_decode($input, true);

if ($investment) {
    $file = 'data/investments.json';

    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);
    } else {
        $data = [];
    }

    //new investment added
    $data[] = $investment;
    file_put_contents($file, json_encode($data));

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

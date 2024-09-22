<?php
header('Content-Type: application/json');

$file = 'data/investments.json';

//if data exist convert to JSON and send back to js
if (file_exists($file)) {
    $data = file_get_contents($file);
    $investments = json_decode($data, true);  
} else {
    $investments = [];  
}

echo json_encode($investments);

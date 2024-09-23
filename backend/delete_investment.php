<?php
header('Content-Type: application/json');

$input = file_get_contents("php://input");
$request = json_decode($input, true);

if (isset($request['index'])) {
    $file = '../data/investments.json';

    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);

        if (isset($data[$request['index']])) {
            //delete investment by index
            array_splice($data, $request['index'], 1); 

            file_put_contents($file, json_encode($data));

            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Wrong index']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'File does not exist']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Index not accepted']);
}

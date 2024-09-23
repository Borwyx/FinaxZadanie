<?php
//return data type
header('Content-Type: application/json');

//laod data from js
$input = file_get_contents("php://input");

//JSON decode to asociative array
$request = json_decode($input, true);


if (isset($request['index']) && isset($request['investment'])) {
    $file = 'data/investments.json';

    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);

        //check the posision (from js) in existing file
        if (isset($data[$request['index']])) {
            $data[$request['index']] = $request['investment'];

            file_put_contents($file, json_encode($data));

            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Wrong index']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'file does not exist']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Index or investment missong']);
}

<?php
$url = 'http://127.0.0.1:8000/api/auth/login';
$data = array('email' => 'admin@min5tulungagung.sch.id', 'password' => 'password');

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\nAccept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */ }

var_dump($result);

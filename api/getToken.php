<?php
use Firebase\JWT\JWT;

require('../vendor/autoload.php');
if($_POST['username'] !== $_POST['password']) {
    header('http/1.0 401 Unauthorized');
    die(json_encode([
        'meta' => ['success' => false, 'message' => 'Invalid Credentials', 'code'=>401]
    ]));
}
$key = 'YouWillNeverGuessThis';
$token = [
    'iss'=>'ogdenjs.org',
    'aud'=>'ogdenjs.org',
    'iat'=> time(),
    'user' => $_POST['username'],
    'access' => $_POST['username'] === 'ogdenjs' ? 'admin' : 'user'
];
$jwt = JWT::encode($token, $key);
echo json_encode([
    'meta'=> [
        'success' => true,
        'message' => 'You logged in!',
        'code'=> 200
    ] ,
    'token' => $jwt
]);
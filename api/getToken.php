<?php
use Firebase\JWT\JWT;

require('../vendor/autoload.php');

$config = json_decode(file_get_contents('../config.json'));
if($_POST['username'] !== $_POST['password']) {
    header('http/1.0 401 Unauthorized');
    die(json_encode([
        'meta' => ['success' => false, 'message' => 'Invalid Credentials', 'code'=>401]
    ]));
}
$token = [
    'iss'=>$config->issuer,
    'aud'=>$config->audience,
    'iat'=> time(),
    'user' => $_POST['username'],
    'access' => $_POST['username'] === $config->adminType ? 'admin' : 'user'
];
$jwt = JWT::encode($token, $config->secret, $config->algorithm);
echo json_encode([
    'meta'=> [
        'success' => true,
        'message' => 'You logged in!',
        'code'=> 200
    ] ,
    'token' => $jwt
]);
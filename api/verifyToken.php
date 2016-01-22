<?php
use Firebase\JWT\JWT;

require( '../vendor/autoload.php' );
$config = json_decode(file_get_contents('../config.json'));

if (empty( $_POST['token'] )) {
    badRequest();
}
try {
    JWT::decode($_POST['token'], $config->secret, [$config->algorithm]);
} catch (DomainException $e) {
    badRequest();
}
echo json_encode([
    'meta' => [
        'success' => true,
        'message' => 'Token is good',
        'code'    => 200
    ]
]);

function badRequest()
{
    header('http/1.0 404 Bad Request');
    die( json_encode([
        'meta' => ['success' => false, 'message' => 'Bad Request', 'code' => 404]
    ]) );
}
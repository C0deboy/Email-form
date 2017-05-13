<?php

require_once __DIR__ . '/functions.php';

if ($errors = validateContactForm($_POST)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['errors' => $errors]);
} else {
    if (sendMail($_POST)) {
        http_response_code(200);
    } else {
        http_response_code(500);
    }
}

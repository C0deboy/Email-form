<?php

require_once __DIR__ . '/functions.php';

if ($errors = validateContactForm($_POST)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['errors' => $errors]);
} else {
    if (sendMail($_POST)) {
        http_response_code(200);
        echo json_encode(['status' => 'Wysłano! Dzięki za wiadomość']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'Coś poszło nie tak :(']);
    }
}

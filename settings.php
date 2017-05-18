<?php

return [
    'reCaptcha' => [
        'secret' => '',
    ],
    'mailer'    => [
        'host'     => '',
        'port'     => '',
        'username' => '',
        'password' => '',
        'email'    => '',
    ],
    'validationMessages' => [
        'stringType'=> 'Musi być typu string',
        'length'    => 'Musi zawierać od {{minValue}} do {{maxValue}} znaków',
        'email'     => 'Niepoprawny email',
        'notEmpty'  => 'Pole nie może być puste',
        'NotSent'   => 'Coś poszło nie tak :(',
        'Sent'      => 'Wysłano! Dzięki za wiadomość!'
    ],
];

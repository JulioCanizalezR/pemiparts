<?php
require_once ('../../libs/PHPMailer/PHPMailer.php');
require_once ('../../libs/PHPMailer/SMTP.php');
require_once ('../../libs/PHPMailer/Exception.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendVerificationEmail($to, $random) {
    // Construir el cuerpo del correo
    $body = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Verificación de correo electrónico</title>
        <style>
            /* Estilos generales */
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            h1 {
                color: #333333;
            }
            p {
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Verificación de correo electrónico</h1>
            <p>Hola,</p>
            <p>Gracias por registrarte. Tu código de verificación es: <strong>' . $random . '</strong></p>
            <p>Utiliza este código para cambiar tu contraseña.</p>
            <p>Atentamente,</p>
            <p>El equipo de verificación</p>
        </div>
    </body>
    </html>
    ';

    // Llamar a la función para enviar el correo electrónico
    sendEmail($to, "Verificación de correo electrónico", $body);
}

function sendEmail($to, $subject, $body) {
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Cambia esto al host de tu servidor SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'partspemi@gmail.com'; // Cambia esto a tu usuario SMTP
        $mail->Password = 'quguntmejkjnrflw'; // Cambia esto a tu contraseña SMTP
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587; // Cambia esto al puerto de tu servidor SMTP

        // Configuración del remitente y destinatarios
        $mail->setFrom('partspemi@gmail.com', 'Mailer');
        $mail->addAddress($to);

        $mail->CharSet = 'UTF-8';

        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
    } catch (Exception $e) {
        echo "El mensaje no se pudo enviar. Mailer Error: {$mail->ErrorInfo}";
    }
}

?>
<?php
require_once ('../../libraries/phpmailer651/src/PHPMailer.php');
require_once ('../../libraries/phpmailer651/src/SMTP.php');
require_once ('../../libraries/phpmailer651/src/Exception.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Función para enviar correo con un mensaje personalizado
function sendVerificationEmail($to, $random, $useCase) {
    // Personalización del asunto y cuerpo del mensaje según el caso de uso
    switch ($useCase) {
        case 'login_verification':
            $subject = 'Verificación de cuenta - Registro';
            $messageBody = '
           <h1>Verificación de inicio de sesión</h1>
            <p>Tu código de verificación para completar el inicio de sesión es:</p>
            <p><strong>' . $random . '</strong></p>';
            break;

        case 'password_reset':
            $subject = 'Código para restablecer tu contraseña';
            $messageBody = '
            <h1>Restablecer contraseña</h1>
            <p>Parece que has solicitado un restablecimiento de contraseña. Usa este código para continuar:</p>
            <p><strong>' . $random . '</strong></p>';
            break;

        default:
            $subject = 'Código de verificación';
            $messageBody = '
            <h1>Verificación de seguridad</h1>
            <p>Tu código de verificación es:</p>
            <p><strong>' . $random . '</strong></p>';
            break;
    }

    // Plantilla de correo común
    $body = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>' . $subject . '</title>
        <style>
            body {
                font-family: Arial, sans-serif;
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
            ' . $messageBody . '
            <p>Este código es válido por un tiempo limitado. Si no solicitaste este correo, por favor ignóralo.</p>
            <p>Atentamente,</p>
            <p>El equipo de seguridad</p>
        </div>
    </body>
    </html>
    ';

    // Llamar a la función para enviar el correo
    sendEmail($to, $subject, $body);
}

// Función genérica para enviar un correo electrónico
function sendEmail($to, $subject, $body) {
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Cambia esto al host de tu servidor SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'partspemi@gmail.com'; // Cambia esto a tu usuario SMTP
        $mail->Password = 'jzlzmwchsqrovpxi'; // Cambia esto a tu contraseña SMTP
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Configuración del remitente y destinatario
        $mail->setFrom('partspemi@gmail.com', 'Mailer');
        $mail->addAddress($to);

        // Configuración del contenido del correo
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';  // Establecer la codificación UTF-8
        $mail->Subject = $subject;
        $mail->Body = $body;

        // Enviar el correo
        $mail->send();
    } catch (Exception $e) {
        echo "El mensaje no se pudo enviar. Error: {$mail->ErrorInfo}";
    }
}

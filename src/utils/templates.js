export const getEmailTemplate = (resetLink, userName = 'Usuario') => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: #f4f4f4; padding: 30px; border-radius: 10px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
                <h2>Hola ${userName},</h2>
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en nuestro ecommerce.</p>
                <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                <div style="text-align: center;">
                    <a href="${resetLink}" class="button">Restablecer Contraseña</a>
                </div>
                <div class="warning">
                    <strong>Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por motivos de seguridad.
                </div>
                <p>Si no solicitaste este cambio de contraseña, puedes ignorar este email. Tu contraseña actual seguirá siendo válida.</p>
                <p>Por tu seguridad, no podrás usar la misma contraseña que tenías anteriormente.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 14px; color: #666;">
                    <strong>¿No puedes hacer clic en el botón?</strong><br>
                    Copia y pega este enlace en tu navegador:<br>
                    <span style="word-break: break-all; color: #007bff;">${resetLink}</span>
                </p>
            </div>
            <div class="footer">
                <p>Este email fue enviado automáticamente, por favor no respondas a este mensaje.</p>
                <p>&copy; 2025 Ecommerce - Sistema de Recuperación de Contraseñas</p>
            </div>
        </div>
    </body>
    </html>
`;

export const getPasswordRecoveryEmailTemplate = (resetLink, expiresAt) => ({
  subject: "Recuperación de Contraseña",
  html: getEmailTemplate(resetLink, 'Usuario'),
  text: getPasswordRecoveryTextTemplate(resetLink, 'Usuario')
});

export const getPasswordRecoveryTextTemplate = (resetLink, userName = 'Usuario') => `
Hola ${userName},

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.

Para crear una nueva contraseña, visita el siguiente enlace:
${resetLink}

IMPORTANTE: Este enlace expirará en 1 hora por motivos de seguridad.

Si no solicitaste este cambio, puedes ignorar este email.

Por tu seguridad, no podrás usar la misma contraseña que tenías anteriormente.

---
Este email fue enviado automáticamente, por favor no respondas a este mensaje.
© 2025 Ecommerce - Sistema de Recuperación de Contraseñas
`;

export const getSuccessMessage = (type) => {
  const messages = {
    password_reset: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.',
    login: 'Inicio de sesión exitoso. Bienvenido de vuelta.',
    logout: 'Sesión cerrada correctamente. ¡Hasta pronto!',
    register: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.',
    recovery_sent: 'Hemos enviado un email con las instrucciones para restablecer tu contraseña.'
  };
  return messages[type] || 'Operación completada exitosamente.';
};

export const getErrorMessage = (type) => {
  const messages = {
    invalid_credentials: 'Email o contraseña incorrectos.',
    token_expired: 'El enlace de recuperación ha expirado. Solicita uno nuevo.',
    token_invalid: 'El enlace de recuperación no es válido.',
    same_password: 'La nueva contraseña debe ser diferente a la actual.',
    email_not_found: 'No existe una cuenta asociada a este email.',
    unauthorized: 'No tienes permisos para realizar esta acción.',
    server_error: 'Error interno del servidor. Intenta más tarde.'
  };
  return messages[type] || 'Ha ocurrido un error inesperado.';
};
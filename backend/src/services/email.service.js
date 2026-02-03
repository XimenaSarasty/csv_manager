const nodemailer = require('nodemailer');

// Configuración del transportador de email
const createTransporter = async () => {
  // Para producción: usar un servicio real como SendGrid, Mailgun, o SMTP de tu proveedor
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Desarrollo: generar cuenta de prueba con Ethereal automáticamente
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('📧 Usando cuenta de prueba Ethereal:');
    console.log('   User:', testAccount.user);
    console.log('   Pass:', testAccount.pass);
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (error) {
    console.error('⚠️ No se pudo crear cuenta de prueba Ethereal, usando configuración manual');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'test@ethereal.email',
        pass: process.env.EMAIL_PASS || 'test123'
      }
    });
  }
};

const sendVerificationEmail = async (email, nombre, verificationToken) => {
  try {
    const transporter = await createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      from: `"CSV Manager" <${process.env.EMAIL_FROM || 'noreply@csvmanager.com'}>`,
      to: email,
      subject: 'Verifica tu cuenta - CSV Manager',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a CSV Manager!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${nombre}</strong>,</p>
              <p>Gracias por registrarte en CSV Manager. Para completar tu registro y poder iniciar sesión, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verificar mi correo</a>
              </div>
              
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
              
              <p><strong>Este enlace expirará en 24 horas.</strong></p>
              
              <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
            </div>
            <div class="footer">
              <p>CSV Manager - Sistema de gestión de documentos CSV</p>
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    // En desarrollo con Ethereal, mostrar el preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email de verificación enviado a:', email);
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email de verificación:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail
};

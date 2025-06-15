package com.grvapp.backend.user.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendConfirmationEmail(String to, String token) {

        String subject = "¡Bienvenido a GRVApp! Confirma tu cuenta";
        String link = "http://localhost:5173/confirmar-email?token=" + token;
        String content = "<div style=\"font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px;\">"
                + "<h2 style=\"color:#2d7ff9;\">¡Bienvenido a <b>GRVApp</b>!</h2>"
                + "<p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón:</p>"
                + "<div style=\"text-align:center;margin:24px 0;\">"
                + "<a href=\"" + link
                + "\" style=\"background:#2d7ff9;color:#fff;padding:12px 24px;border-radius:5px;text-decoration:none;font-size:16px;\">Confirmar cuenta</a>"
                + "</div>"
                + "<p>O copia y pega este enlace en tu navegador:</p>"
                + "<p style=\"word-break:break-all;color:#555;\">" + link + "</p>"
                + "<hr style=\"margin:24px 0;\">"
                + "<p style=\"font-size:12px;color:#aaa;\">Si no creaste esta cuenta, puedes ignorar este correo.</p>"
                + "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true = HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """Send email using SendGrid."""
    try:
        if not settings.SENDGRID_API_KEY:
            logger.warning("SendGrid API key not configured. Email not sent.")
            return False
        
        sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        
        from_email = Email(settings.FROM_EMAIL)
        to_email = To(to_email)
        content = Content("text/html", html_content)
        mail = Mail(from_email, to_email, subject, content)
        
        response = sg.send(mail)
        return response.status_code in [202, 200]
        
    except Exception as e:
        logger.error(f"Email error: {e}")
        return False

def send_reset_password_email(to_email: str, token: str) -> bool:
    """Send password reset email."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Reset Password</title>
        <style>
            body {{ font-family: Arial, sans-serif; background: #f5f7fa; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; background: white; }}
            .header {{ background: #1a2a6c; padding: 20px; color: white; text-align: center; }}
            .content {{ padding: 20px; }}
            .button {{ display: inline-block; background: #1a2a6c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>EduPredict</h2>
            </div>
            <div class="content">
                <h3>Reset Your Password</h3>
                <p>You requested to reset your password. Click the button below:</p>
                <p><a href="{reset_url}" class="button">Reset Password</a></p>
                <p>If you didn't request this, ignore this email.</p>
                <p><small>This link expires in 1 hour.</small></p>
            </div>
            <div class="footer">
                <p>EduPredict</p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_email(to_email, "Reset Your Password", html_content)

def send_welcome_email(to_email: str, username: str) -> bool:
    """Send welcome email to new user."""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome</title>
        <style>
            body {{ font-family: Arial, sans-serif; background: #f5f7fa; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; background: white; }}
            .header {{ background: #1a2a6c; padding: 20px; color: white; text-align: center; }}
            .content {{ padding: 20px; }}
            .button {{ display: inline-block; background: #1a2a6c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🎓 EduPredict</h2>
            </div>
            <div class="content">
                <h3>Welcome, {username}!</h3>
                <p>Your account has been created successfully. You can now log in and start predicting your academic performance.</p>
                <p><a href="{settings.FRONTEND_URL}/login" class="button">Login Now</a></p>
                <p>Best regards,<br>Student Performance Team</p>
            </div>
            <div class="footer">
                <p>EduPredict</p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_email(to_email, "Welcome to EduPredict", html_content)
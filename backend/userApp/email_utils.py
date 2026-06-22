import logging

from django.conf import settings
from django.core.mail import send_mail


logger = logging.getLogger(__name__)


def send_mail_safe(*, subject, message, recipient_list, from_email=None, html_message=None):
    """
    Best-effort email sending.

    Returns True if Django reports at least one message sent; otherwise False.
    Never raises (logs exception instead).
    """
    if from_email is None:
        from_email = (
            getattr(settings, "DEFAULT_FROM_EMAIL", None)
            or getattr(settings, "EMAIL_HOST_USER", None)
            or "webmaster@localhost"
        )

    try:
        sent = send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
        if sent <= 0:
            logger.warning("Email send returned %s (subject=%r to=%s)", sent, subject, recipient_list)
            return False
        return True
    except Exception:
        logger.exception("Email send failed (subject=%r to=%s)", subject, recipient_list)
        return False


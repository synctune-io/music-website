document.addEventListener('DOMContentLoaded', function() {
    initCommonElements();

    if (typeof emailjs !== 'undefined') {
        emailjs.init('2FT4effYC4SSjt4jV');
    }

    document.querySelectorAll('.video-card').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const videoId = trigger.dataset.videoId;
            if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;

            const modal = document.createElement('div');
            modal.className = 'video-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-label', trigger.dataset.videoTitle);

            const content = document.createElement('div');
            content.className = 'modal-content';
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.type = 'button';
            closeButton.setAttribute('aria-label', 'Close video');
            closeButton.textContent = '×';

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.title = trigger.dataset.videoTitle;
            iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;

            const closeModal = () => {
                document.removeEventListener('keydown', onKeydown);
                modal.remove();
                document.body.classList.remove('modal-open');
                trigger.focus();
            };
            const onKeydown = event => {
                if (event.key === 'Escape') closeModal();
                if (event.key === 'Tab' && !modal.contains(document.activeElement)) {
                    event.preventDefault();
                    closeButton.focus();
                }
            };

            closeButton.addEventListener('click', closeModal);
            modal.addEventListener('click', event => {
                if (event.target === modal) closeModal();
            });
            content.append(closeButton, iframe);
            modal.appendChild(content);
            document.body.appendChild(modal);
            document.body.classList.add('modal-open');
            document.addEventListener('keydown', onKeydown);
            closeButton.focus();
        });
    });

    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', async event => {
        event.preventDefault();
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const status = document.getElementById('form-status');
        const originalButtonText = submitButton.textContent;
        const name = bookingForm.elements.name.value.trim();
        const email = bookingForm.elements.email.value.trim();
        const request = bookingForm.elements.request.value;
        const message = bookingForm.elements.message.value.trim();

        if (!name || message.length < 50) {
            status.textContent = 'Please enter your name and a message of at least 50 characters.';
            status.classList.add('error');
            return;
        }

        status.textContent = '';
        status.classList.remove('error');
        submitButton.textContent = 'Sending…';
        submitButton.disabled = true;

        try {
            if (typeof emailjs === 'undefined') throw new Error('Email service unavailable');
            await emailjs.send('service_7k7zuyd', 'template_pgu0qr7', {
                name: 'Matteo Bianchi',
                email: 'black.corekid00@gmail.com',
                from_name: name,
                from_email: email,
                form_request: request,
                message,
                reply_to: email
            });
            status.textContent = 'Message sent. I’ll get back to you soon!';
            bookingForm.reset();
        } catch (error) {
            status.textContent = 'Could not send your message. Please try again or email black.corekid00@gmail.com.';
            status.classList.add('error');
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
});

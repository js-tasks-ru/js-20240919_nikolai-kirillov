export default class NotificationMessage {
    static previousMessage;

    constructor(message = '', options = {}) {
        this.options = {...options};
        this.message = message;
        this.duration = options.duration;
        this.type = options.type;
        this.element = this.createNotificationElement();
    }

    createNotificationElement() {
        const element = document.createElement('div');
        element.innerHTML = this.createMessageTemplate();
        if (this.type) element.firstElementChild.classList.add(this.type);
        return element.firstElementChild;
    }

    createMessageTemplate() {
        return `<div id='notificationID' class="notification" style="--value:${this.duration / 1000}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                ${this.message}
                </div>
                </div>
                </div>
    `
    }

    show(container = document.body) {
        if (NotificationMessage.previousMessage) NotificationMessage.previousMessage.remove();
        NotificationMessage.previousMessage = this.element;
        this.messageTimer = setTimeout(() => this.remove(), this.duration);
        container.append(this.element);
    }

    remove() {
        this.destroy();
    }

    destroy() {
        if (this.element) this.element.remove();
        if (this.messageTimer) clearTimeout(this.messageTimer);
    }
}

export class BaseView {
    constructor(id)
    {
        this.element = document.getElementById(id);

        this.events = new EventTarget();

        this.intervals = [];
    }

    emit(eventName, detail) {
        this.events.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    on(eventName, callback) {
        this.events.addEventListener(eventName, callback);
    }

    off(eventName, callback) {
        this.events.removeEventListener(eventName, callback);
    }

    clearAllIntervals() {
        this.intervals.forEach(id => clearInterval(id));
        this.intervals = [];
    }

    show() {
        if(this.element) this.element.style.display = "block";
    }
    
    hide() {
        this.clearAllIntervals();

        if(this.element) this.element.style.display = "none";
    }
}
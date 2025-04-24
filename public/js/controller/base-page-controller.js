import { AvatarEvents, EventBus } from "../event-bus.js";

export class BasePageController {
    constructor(id, view) {
      this.id = id;
      this.view = view;
      this.isActive = false;

      this.events = new EventTarget();

      this.intervals = [];
    }

    emit(eventName, detail) {
      this.events.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    on(eventName, callback) {
        this.events.addEventListener(eventName, callback);
    }
  
    show() {
      this.view.show();
      this.onEnter();
    }
  
    hide() {
      this.clearAllIntervals();
      this.view.hide();
      this.onExit();
    }
    
    clearAllIntervals() {
      this.intervals.forEach(id => clearInterval(id));
      this.intervals = [];
    }
  
    onEnter() {
      this.isActive = true;
    }
  
    onExit() {
      this.isActive = false;

      EventBus.emit(AvatarEvents.STOP, {});
    }
  }
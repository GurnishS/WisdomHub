import { EventEmitter } from "events";

const store = {
  messages: [],
  eventEmitter: new EventEmitter(),

  addMessage(message) {
    this.messages.push(message);
    this.eventEmitter.emit("change");
  },

  clearMessages() {
    this.messages = [];
    this.eventEmitter.emit("change");
  },

  getMessages() {
    return this.messages;
  },

  removeMessage() {
    this.messages.shift();
  },

  subscribe(callback) {
    this.eventEmitter.on("change", callback);
    return () => this.eventEmitter.off("change", callback);
  },
};

export default store;

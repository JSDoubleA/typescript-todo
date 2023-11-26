export type EventData = Record<string, any>;
export type EventCallback = (eventType: string, data?: EventData) => void;

export default class EventEmitter<T extends string = string, D extends EventData = EventData> {
  readonly events: Map<T, Set<EventCallback>>;

  constructor() {
    this.events = new Map();
  }

  on(eventType: T, fn: EventCallback) {
    let event = this.events.get(eventType);

    if (!event) {
      this.events.set(eventType, new Set());
      event = this.events.get(eventType);
    }

    event?.add(fn);
  }

  off(eventType: T, fn: EventCallback) {
    const event = this.events.get(eventType);

    if (event) {
      event.delete(fn);
    }
  }

  emit(eventType: T, data?: D) {
    const event = this.events.get(eventType);

    if (event) {
      event.forEach((fn) => data ? fn(eventType, data) : fn(eventType));
    }
  }

  clear() {
    this.events.clear();
  }
}

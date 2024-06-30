type TypedEventListener<TEvent extends Event> = (evt: TEvent) => void;

interface TypedEventListenerObject<TEvent extends Event> {
  handleEvent(object: TEvent): void;
}

type TypedEventListenerOrEventListenerObject<TEvent extends Event> =
  | TypedEventListener<TEvent>
  | TypedEventListenerObject<TEvent>;

type EventsMap = Record<string, Event>;

type StringKeyOf<T> = keyof T extends string ? keyof T : never;

interface TypedEventTargetInterface<TEventsMap extends EventsMap> {
  dispatchEvent(evt: TEventsMap[StringKeyOf<TEventsMap>]): boolean;
  addEventListener<TType extends StringKeyOf<TEventsMap>>(
    type: TType,
    listener: TypedEventListenerOrEventListenerObject<TEventsMap[TType]>,
    options?: AddEventListenerOptions | boolean
  ): void;

  removeEventListener<TType extends StringKeyOf<TEventsMap>>(
    type: TType,
    listener: TypedEventListenerOrEventListenerObject<TEventsMap[TType]>,
    options?: AddEventListenerOptions | boolean
  ): void;
}

export function TypedEventTarget<TEventsMap extends EventsMap>() {
  return EventTarget as unknown as {
    new (): TypedEventTargetInterface<TEventsMap>;
    prototype: TypedEventTargetInterface<TEventsMap>;
  };
}

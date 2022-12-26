function TypedEvent<TType extends string = string, TData = unknown>(
    type: TType,
) {
    return class extends Event {
        constructor(public data: TData) {
            super(type);
        }
    };
}

type EventsMap = {
    [key: string]: Event;
};

type StringKeyOf<T> = string & keyof T;

type TypedEventListener<
    TEventsMap extends EventsMap,
    TType extends StringKeyOf<TEventsMap>,
> = EventListener & {
    (evt: TEventsMap[TType]): void;
};

type TypedEventListenerObject<
    TEventsMap extends EventsMap,
    TType extends StringKeyOf<TEventsMap>,
> = EventListenerObject & {
    handleEvent(object: TEventsMap[TType]): void;
};

type TypedEventListenerOrEventListenerObject<
    TEventsMap extends EventsMap,
    TType extends StringKeyOf<TEventsMap>,
> =
    | TypedEventListener<TEventsMap, TType>
    | TypedEventListenerObject<TEventsMap, TType>;

export class TypedEventTarget<
    TEventsMap extends EventsMap,
> extends EventTarget {
    public dispatch(evt: TEventsMap[StringKeyOf<TEventsMap>]): boolean {
        return this.dispatchEvent(evt);
    }

    public addEventListener<TType extends StringKeyOf<TEventsMap>>(
        type: TType,
        listener: TypedEventListenerOrEventListenerObject<TEventsMap, TType>,
        options?: AddEventListenerOptions | boolean,
    ) {
        super.addEventListener(type, listener, options);
    }

    public removeEventListener<TType extends StringKeyOf<TEventsMap>>(
        type: TType,
        listener: TypedEventListenerOrEventListenerObject<TEventsMap, TType>,
        options?: AddEventListenerOptions | boolean,
    ) {
        super.removeEventListener(type, listener, options);
    }
}

enum EventTypesEnum {
    EventOne = "event-one",
    EventTwo = "event-two",
}

class EventOne extends TypedEvent(EventTypesEnum.EventOne) {}
class EventTwo extends TypedEvent(EventTypesEnum.EventTwo) {}

interface EventsMapping {
    [EventTypesEnum.EventOne]: EventOne;
    [EventTypesEnum.EventTwo]: EventTwo;
}

const eventTarget = new TypedEventTarget<EventsMapping>();
eventTarget.dispatch(new EventOne({ test: "test" }));
eventTarget.addEventListener(EventTypesEnum.EventTwo, (event) => {});

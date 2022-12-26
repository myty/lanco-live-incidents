export function TypedEvent<TData>(type: string) {
    return class extends Event {
        constructor(public data: TData) {
            super(type);
        }
    };
}

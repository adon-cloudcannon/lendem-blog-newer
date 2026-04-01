export function isKeyboardEvent(event: Event): event is KeyboardEvent {
    return 'detail' in event;
}
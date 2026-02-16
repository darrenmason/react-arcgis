import { useEffect } from 'react';

type EventHandler = (...args: any[]) => void;

interface EventRegistration {
  eventName: string;
  handler: EventHandler | undefined;
}

export function useEventHandlers<T extends { on: (...args: any[]) => { remove: () => void } }>(
  instance: T | null,
  events: EventRegistration[]
) {
  useEffect(() => {
    if (!instance) return;

    const handles = events
      .filter(({ handler }) => handler !== undefined)
      .map(({ eventName, handler }) => (instance.on as any)(eventName, handler!));

    return () => {
      handles.forEach(handle => handle.remove());
    };
  }, [instance, ...events.map(e => e.handler)]);
}

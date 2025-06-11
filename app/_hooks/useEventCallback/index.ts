import { type SyntheticEvent, useState, useEffect } from "react";
import { Subject, type Observable } from "rxjs";

export default function useEventCallback<A extends SyntheticEvent, B>(
  callback: (event: Subject<A>) => Observable<B>,
  initialValue: B
) {
  const [value, setValue] = useState<B>(initialValue);
  const subject = new Subject<A>();

  useEffect(() => {
    const subscription = callback(subject).subscribe({
      next: setValue,
      error: console.error,
    });

    return () => {
      subscription.unsubscribe();
      subject.complete();
    };
  }, []);

  return [(event: A) => subject?.next(event), value] as const;
}

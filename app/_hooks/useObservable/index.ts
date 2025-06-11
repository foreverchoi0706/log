import { useState, useEffect } from "react";
import type { Observable } from "rxjs";

export default function useObservable<A>(
  observable: (initialValue: A) => Observable<A>,
  initialValue: A
) {
  const [value, setValue] = useState<A>(initialValue);

  useEffect(() => {
    const subscription = observable(value).subscribe({
      next: setValue,
      error: console.error,
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return value;
}

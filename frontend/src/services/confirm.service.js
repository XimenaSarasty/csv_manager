const subscribers = [];

export function subscribe(cb) {
  subscribers.push(cb);
  return () => {
    const idx = subscribers.indexOf(cb);
    if (idx !== -1) subscribers.splice(idx, 1);
  };
}

export function open(options) {
  subscribers.forEach(cb => cb(options));
}

export function confirm(message, opts = {}) {
  return new Promise((resolve) => {
    open({ message, ...opts, _resolve: resolve });
  });
}

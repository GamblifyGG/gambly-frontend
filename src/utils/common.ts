// Does not log the correct lines! :(
export const devlog = (() => {
  const devEnv = process.env.NODE_ENV === 'development';

  const handler: ProxyHandler<Console> = {
    get(target, prop: keyof Console) {
      const originalMethod = target[prop];
      if (typeof originalMethod === 'function') {
        return (...args: any[]) => {
          if (devEnv) {
            originalMethod.apply(target, [`[DEV]`, ...args]);
          }
        };
      }
      return originalMethod;
    },
  };

  return new Proxy(console, handler);
})();

// This version will log the correct lines
export const devLog = (() => {
  return process.env.NODE_ENV === 'development' || typeof window !== 'undefined' && localStorage.getItem('debug') === 'true' ? console.log : () => {}
})();

export async function awaiter(promise: Promise<any>) {
  try {
    const r = await promise
    return [null, r]
  } catch (error) {
    return [error, null];
  }
}

export function getExplorerLink(txHash, chainId) {
  const explorers = {
    1: 'https://etherscan.io/tx/', 
    11155111: 'https://sepolia.etherscan.io/tx/', 
    101: 'https://explorer.solana.com/tx/'
  };

  const baseUrl = explorers[chainId];
  
  if (!baseUrl) {
    throw new Error('Unsupported network');
  }

  return `${baseUrl}${txHash}`;
}

export function timeUntil(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((date - now) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `in ${count} ${interval.label}${count !== 1 ? "s" : ""}`;
    }
  }

  return "just now";
}

export function timeAgo(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function shortDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString);

  return date.toDateString()
}

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(()=> {
      resolve(true)
    }, ms)
  })
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

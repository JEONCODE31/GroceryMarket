export function loadIamportScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve(); // SSR 안전
  if (document.getElementById('iamport-cdn')) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.id = 'iamport-cdn';
    s.src = 'https://cdn.iamport.kr/v1/iamport.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load iamport.js'));
    document.head.appendChild(s);
  });
}


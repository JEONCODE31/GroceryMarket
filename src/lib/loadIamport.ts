// src/lib/loadIamport.ts
let iamportReadyPromise: Promise<void> | null = null;

export function loadIamportScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window is undefined'));
  }
  // 이미 전역에 IMP가 준비된 경우 즉시 성공
  if ((window as any).IMP) return Promise.resolve();

  if (iamportReadyPromise) return iamportReadyPromise;

  iamportReadyPromise = new Promise<void>((resolve, reject) => {
    const SRC = 'https://cdn.iamport.kr/v1/iamport.js';

    // 동일 src의 스크립트가 있는지 확인
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);

    const done = () => {
      // 로드 이후에도 방어적으로 확인
      if ((window as any).IMP) resolve();
      else reject(new Error('IMP not found after script load'));
    };

    if (existing) {
      // 이미 로드 완료된 경우(load 이벤트는 다시 안 뜸) 즉시 resolve
      if ((existing as any).dataset.loaded === 'true' || (window as any).IMP) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => {
        (existing as any).dataset.loaded = 'true';
        done();
      });
      existing.addEventListener('error', reject);
      return;
    }

    // 새로 삽입
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.addEventListener('load', () => {
      (s as any).dataset.loaded = 'true';
      done();
    });
    s.addEventListener('error', reject);
    document.head.appendChild(s);
  });

  return iamportReadyPromise;
}

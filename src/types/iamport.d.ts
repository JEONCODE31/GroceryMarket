// src/types/iamport.d.ts
export {};

declare global {
  interface Iamport {
    init: (impCode: string) => void;
    request_pay: (
      params: Record<string, any>,
      callback: (rsp: Record<string, any>) => void
    ) => void;
  }
  interface Window {
    IMP?: Iamport;
  }
}



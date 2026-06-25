'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

export default function TurnstileWidget({ siteKey }: { siteKey: string }) {
  return (
    <div className="pt-2 pb-4 flex justify-center sm:justify-start w-full">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark"></div>
    </div>
  );
}

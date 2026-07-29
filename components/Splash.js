"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Splash() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`splash${hidden ? " is-hidden" : ""}`} aria-hidden={hidden}>
      <div className="splash__inner">
        <Image
          src="/images/logo.png"
          alt="Modern Catering"
          width={104}
          height={104}
          className="splash__logo"
          priority
        />
        <div className="splash__bar" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}

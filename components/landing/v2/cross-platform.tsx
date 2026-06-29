import Image from "next/image"

export function V2CrossPlatform() {
  return (
    <>
      {/* Desktop version */}
      <section className="hidden flex-col items-center gap-3 px-8 py-10 lg:flex">
        <h2 className="text-center font-heading text-[3.75rem] font-bold leading-[0.95] tracking-tight text-white">
          trade from anywhere.
          <br />
          never lose a beat.
        </h2>
        <p className="text-center text-[1.375rem] leading-snug tracking-tight text-white/60">
          Open a trade on your phone, close it on your desktop — all in one app.
        </p>

        {/* App screenshots */}
        <div className="relative -mt-8 w-full max-w-5xl">
          <Image
            src="/images/fomo/fomo-desktop.webp"
            alt="ChadWallet desktop app"
            width={2889}
            height={2783}
            className="w-full"
            loading="lazy"
          />
          <Image
            src="/images/fomo/fomo-desktop-phone.webp"
            alt=""
            width={2825}
            height={3251}
            loading="lazy"
            className="absolute -right-[8%] bottom-[12%] w-[28%] animate-[float_4s_ease-in-out_infinite]"
            aria-hidden
          />
        </div>
      </section>

      {/* Mobile version */}
      <section className="relative flex text-center lg:hidden">
        <Image
          src="/images/fomo/fomo-mobile-app.webp"
          alt="ChadWallet mobile app"
          width={1197}
          height={1164}
          loading="lazy"
          className="w-full"
        />
        <div className="absolute bottom-0 flex flex-col gap-3 px-8 pb-6">
          <h2 className="font-heading text-[2.25rem] font-bold leading-none tracking-tighter text-white">
            trade from anywhere.
            <br />
            never lose a beat.
          </h2>
          <p className="leading-snug tracking-tight text-white/60">
            Pick up a trade on your phone, close it on your desktop — all in one
            app.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </>
  )
}

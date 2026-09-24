"use client";

import dynamic from "next/dynamic";
import AgendaHero from "./components/AgendaHero";

const LiveNowBanner = dynamic(() => import("./components/LiveNowBanner"), {
  ssr: false,
});
const PhaseNav = dynamic(() => import("./components/PhaseNav"), {
  ssr: false,
});
const AgendaSchedule = dynamic(() => import("./components/AgendaSchedule"), {
  ssr: false,
});
const AgendaFooter = dynamic(() => import("./components/AgendaFooter"), {
  ssr: false,
});

export default function AgendaClient() {
  return (
    <main
      style={{
        backgroundColor: "var(--color-dark, #0a0d14)",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "clip",
        boxSizing: "border-box",
      }}
    >
      <AgendaHero />
      <LiveNowBanner />
      <PhaseNav />
      <AgendaSchedule />
      <AgendaFooter />
    </main>
  );
}

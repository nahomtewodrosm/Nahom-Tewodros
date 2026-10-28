// @ts-expect-error CSS is handled by the framework bundler.
import "./globals.css";
export const metadata = {
  title: "NAHOM TEWODROS",
  description: "Portfolio",
};
export const viewport = { width: "device-width", initialScale: 1 };

// Runs before first paint: saved choice wins, otherwise follow the device setting.

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";
export const metadata = { title: "Your Name — Developer & Designer", description: "Portfolio" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}

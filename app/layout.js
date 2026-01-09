
import { Outfit, Playfair_Display, Great_Vibes, Bree_Serif } from "next/font/google";
import "./globals.css";
import MusicPlayer from "./components/MusicPlayer";
import DovesBackground from "./components/DovesBackground";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], variable: '--font-playfair' });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"], variable: '--font-vibes' });
const breeSerif = Bree_Serif({ subsets: ["latin"], weight: ["400"], variable: '--font-bree' });

export const metadata = {
  title: "Larissa & Gabriel",
  description: "Convite de Casamento - Larissa & Gabriel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${playfair.variable} ${greatVibes.variable} ${breeSerif.variable}`}>
      <body>
        <DovesBackground />
        <MusicPlayer />
        {children}
      </body>
    </html>
  );
}


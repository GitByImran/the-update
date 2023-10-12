import { Inter } from "next/font/google";
import RootLayout from "./root/rootLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <RootLayout />
    </main>
  );
}

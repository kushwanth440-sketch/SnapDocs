import Navbar from "@/components/ui/layout/Navbar";
import HeroSection from "@/components/ui/layout/HeroSection";
import ToolsGrid from "@/components/ui/layout/ToolsGrid";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#09090b" }}>
      <Navbar />
      <HeroSection />
      <ToolsGrid />
    </main>
  );
}

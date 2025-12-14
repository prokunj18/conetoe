import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import MainMenu from "./pages/MainMenu";
import Game from "./pages/Game";
import ClassicGame from "./pages/ClassicGame";
import Rules from "./pages/Rules";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Multiplayer from "./pages/Multiplayer";
import WaitingLobby from "./pages/WaitingLobby";
import Customization from "./pages/Customization";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MainMenu />} />
              <Route path="/game" element={<Game />} />
              <Route path="/classic-game" element={<ClassicGame />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />
              <Route path="/multiplayer" element={<Multiplayer />} />
              <Route path="/waiting-lobby" element={<WaitingLobby />} />
              <Route path="/customization" element={<Customization />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;

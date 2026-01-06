import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

interface CoinAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export const CoinAnimation = ({ amount, onComplete }: CoinAnimationProps) => {
  const [coins, setCoins] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const [showAmount, setShowAmount] = useState(false);

  useEffect(() => {
    // Generate random coin positions
    const newCoins = Array.from({ length: Math.min(amount / 5, 12) }, (_, i) => ({
      id: i,
      x: Math.random() * 60 - 30,
      delay: i * 0.08,
    }));
    setCoins(newCoins);
    
    // Show amount after coins animate
    setTimeout(() => setShowAmount(true), 400);
    
    // Complete animation
    setTimeout(() => onComplete?.(), 2000);
  }, [amount, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {/* Flying coins */}
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute animate-coin-fly"
          style={{
            left: `calc(50% + ${coin.x}px)`,
            animationDelay: `${coin.delay}s`,
          }}
        >
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-1 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
            <Coins className="w-4 h-4 text-amber-900" />
          </div>
        </div>
      ))}
      
      {/* Amount display */}
      {showAmount && (
        <div className="animate-bounce-in text-center">
          <div className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
            +{amount}
          </div>
          <div className="text-sm font-bold text-amber-400/80 tracking-wider">BLING</div>
        </div>
      )}
    </div>
  );
};

// Hook to trigger coin animation
export const useCoinAnimation = () => {
  const [animationData, setAnimationData] = useState<{ amount: number; key: number } | null>(null);

  const triggerCoinAnimation = (amount: number) => {
    setAnimationData({ amount, key: Date.now() });
  };

  const clearAnimation = () => {
    setAnimationData(null);
  };

  return { animationData, triggerCoinAnimation, clearAnimation };
};
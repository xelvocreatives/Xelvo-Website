import { useState, useEffect } from 'react';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: '#0B0B0B'
      }}
    >
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-pulse">
          <h1 className="tracking-[0.3em]" style={{
            fontSize: '2rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FF6600 0%, #E69700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            YELVO CREATIVES
          </h1>
        </div>

        {/* Loading Bar */}
        <div 
          className="w-64 h-1 rounded-full overflow-hidden mx-auto"
          style={{
            background: 'rgba(255, 102, 0, 0.1)'
          }}
        >
          <div 
            className="h-full animate-pulse"
            style={{
              background: 'linear-gradient(90deg, #FF6600 0%, #E69700 100%)',
              animation: 'loading 1.5s ease-in-out infinite',
              width: '50%'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}

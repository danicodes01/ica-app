// components/game/shared/loading-spinner.tsx
export default function LoadingSpinner() {
    return (
      <div className="fixed inset-0 bg-[#1C1C1EFF] flex items-center justify-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-[#64D2FFFF] rounded-full animate-spin border-t-transparent">
          </div>
          {/* Inner ring */}
          <div className="absolute top-1 left-1 w-14 h-14 border-4 border-[#EBEBF599] rounded-full animate-spin border-b-transparent" style={{ animationDirection: 'reverse' }}>
          </div>
          {/* Loading text */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <p className="font-ps2p text-[color:var(--game-text)] text-sm">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }
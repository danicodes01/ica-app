// app/game/planets/[slug]/stations/[stationId]/layout.tsx

// interface LayoutParams {
//     slug: string;
//     stationId: string;
//   }
  
  interface Props {
    children: React.ReactNode;
    // params: LayoutParams;
    // searchParams: { [key: string]: string | string[] | undefined };
  }
  
  export default async function StationLayout({
    children,
    // params,
  }: Props) {
    return (
      <div className="min-h-screen bg-[#1C1C1EFF]">
        <header className="fixed top-0 left-0 right-0 bg-[#1C1C1EFF]/80 backdrop-blur-sm border-b border-[#64D2FFFF]/20">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="font-ps2p text-[color:var(--game-text)] text-sm">
                {/* Planet: {params.slug} - Station: {params.stationId} */}
              </h1>
            </div>
          </div>
        </header>
        
        <main className="pt-16">
          {children}
        </main>
      </div>
    );
  }
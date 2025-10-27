"use client"
import { isLightSquare, RANKS, FILES } from "@/src/lib/chess/utils";

interface SquareGuessBoardProps {
  isVisible?: boolean;
  highlightedSquares?: string[];
  showWhiteBoard?: boolean
}



export default function SquareGuessBoard({ isVisible, highlightedSquares = [], showWhiteBoard = true }: SquareGuessBoardProps) {
  // const handleClick = (file: string, rank: number) => {
  //   const square = `${file}${rank}`;
  // };
  const ranks = showWhiteBoard? [...RANKS].reverse() : [...RANKS]


  return (
    <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px]">
      <div
        className={`grid grid-cols-8 border border-border w-full h-full transition-opacity duration-500
          ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {ranks.map((rank) =>
          FILES.map((file) => {
            const square = `${file}${rank}`;
            const isHighlighted = highlightedSquares.includes(square);
            return (
              <div
                key={square}
                // onClick={() => handleClick(file, rank)}
                className={`flex items-center justify-center 
                  ${isLightSquare(file, rank) ? "bg-white" : "bg-black"}
                  ${isHighlighted && isVisible ? "ring-4 ring-blue-400 animate-pulseGlow" : ""}`}
              >
                <span
                  className={`md:text-lg font-bold select-none ${
                    isLightSquare(file, rank) ? "text-black" : "text-white"
                  }`}
                >
                  {file.toUpperCase()}{rank}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div
        className={`absolute top-0 left-0 w-full h-full bg-secondary transition-opacity duration-500
          ${isVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      ></div>
    </div>
  );
}

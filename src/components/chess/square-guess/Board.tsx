"use client"

import { isLightSquare, RANKS, FILES } from "@/src/lib/chess/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "@/src/components/ui/skeleton"

interface SquareGuessBoardProps {
  isVisible?: boolean;
  isCoordinatesVisible?:boolean
  highlightedSquares?: string[];
  flipBoard?: boolean
}




export default function SquareGuessBoard({ isVisible = true, highlightedSquares = [], flipBoard = false, isCoordinatesVisible = true }: SquareGuessBoardProps) {
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted){
    return (
      <Skeleton className=" w-[300px] h-[300px] lg:w-[420px] lg:h-[420px]"/>
    )
  };

  const ranks = flipBoard ? [...RANKS] : [...RANKS].reverse();




  return (
    <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] select-none">
      <div
        className={`grid grid-cols-8 border border-border w-full h-full ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-500 rounded-lg
        `}
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
                  <span className={`${isCoordinatesVisible? "opacity-100":"opacity-0"} transition-opacity duration-500`}>{`${file.toUpperCase()}${rank}`}</span>
                  {/* {isVisible && `${file.toUpperCase()} ${rank}`} */}
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

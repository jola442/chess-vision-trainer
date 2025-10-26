"use client"
import { isLightSquare } from "@/src/lib/chess/utils";

interface SquareGuessBoardProps {
  isVisible?: boolean;
}

const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

export default function SquareGuessBoard({ isVisible }: SquareGuessBoardProps) {
  const handleClick = (file: string, rank: number) => {
    const square = `${file}${rank}`;
    console.log("Clicked:", square);
  };

  return (
    <div className="relative w-[30vw] h-[30vw]">
      <div
        className={`grid grid-cols-8 border border-border w-full h-full transition-opacity duration-500
          ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {ranks.map((rank) =>
          files.map((file) => (
            <div
              key={`${file}${rank}`}
              onClick={() => handleClick(file, rank)}
              className={`flex items-center justify-center ${
                isLightSquare(file, rank) ? "bg-white" : "bg-black"
              }`}
            >
              <span
                className={`md:text-lg font-bold select-none ${
                  isLightSquare(file, rank) ? "text-black" : "text-white"
                }`}
              >
                {file}{rank}
              </span>
            </div>
          ))
        )}
      </div>

      <div
        className={`absolute top-0 left-0 w-full h-full bg-black/50 transition-opacity duration-500
          ${isVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      ></div>
    </div>
  );
}

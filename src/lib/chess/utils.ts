import { FILES, RANKS } from "./constants";
import { FileType, RankType } from "./types";

function isLightSquare(file:string, rank:number):boolean {
    const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
    return (rank + fileIndex) % 2 === 0;
}

function isValidSquare(file:string, rank:number): boolean{
    if(rank > 8 || rank < 1 || !["a", "b", "c", "d", "e", "f", "g", "h"].includes(file)){
        return false
    }
    return true
}

// let availableSquares: string[] = [];

// function generateSquarePrompt(files: FileType[], ranks: RankType[]): string {
//   if (
//     ranks.length < 1 ||
//     ranks.length > 8 ||
//     ranks.some((rank) => rank < 1 || rank > 8) ||
//     files.length < 1 ||
//     files.length > 8 ||
//     files.some((file) => !FILES.includes(file))
//   ) {
//     throw new Error("Invalid coordinates");
//   }

//   if (availableSquares.length === 0) {
//     availableSquares = files.flatMap((file) =>
//       ranks.map((rank) => `${file}${rank}`)
//     );

//     // Fisher–Yates shuffle
//     for (let i = availableSquares.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [availableSquares[i], availableSquares[j]] = [availableSquares[j], availableSquares[i]];
//     }
//   }

//   return availableSquares.pop()!;
// }

export {
    isLightSquare,
    isValidSquare,
    // generateSquarePrompt,
    RANKS,
    FILES
}
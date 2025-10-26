const RANKS = [1,2,3,4,5,6,7,8]
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"]

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

function generateSquarePrompt(files: string[], ranks:number[]): string{
    if((ranks.length > 8 || ranks.length < 1) || ranks.some( (rank) => rank < 0 || rank > 8 ) || files.some( (file) => !FILES.includes(file) || files.length > 8 || files.length < 1)){
        throw new Error("Invalid co-ordinates")
    }

    else{
        const filePrompt = files[Math.floor(Math.random()*files.length)]
        const rankPrompt = String(ranks[Math.floor(Math.random()*ranks.length)])
        return filePrompt+rankPrompt
    }
}

export {
    isLightSquare,
    isValidSquare,
    generateSquarePrompt,
    RANKS,
    FILES
}
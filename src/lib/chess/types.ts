import { FILES, RANKS } from "./constants"


export type FileType = typeof FILES[number]
export type RankType = typeof RANKS[number]

export interface SquareGuesserSettings {
  files: FileType[],
  ranks: RankType[],
  showWhiteBoard: boolean
}

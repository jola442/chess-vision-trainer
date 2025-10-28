import { FILES, RANKS } from "./constants"


export type FileType = typeof FILES[number]
export type RankType = typeof RANKS[number]
export type Square = `${FileType}${RankType}` | `${Uppercase<FileType>}${RankType}`

export interface SquareGuesserSettings {
  files?: FileType[],
  ranks?: RankType[],
  showWhiteBoard: boolean,
  squares?: Square[],
}

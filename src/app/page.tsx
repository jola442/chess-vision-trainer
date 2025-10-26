"use client"

import Image from "next/image";
import Navbar from "@/src/components/navbar"
import Board from "../components/chess/squareGuessBoard";
import { Button } from "@/src/components/ui/button"
import { Settings, BadgeCheckIcon, BadgeX } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../components/ui/item";
import { useState, useRef, useEffect } from "react";
import { FILES, generateSquarePrompt, isLightSquare, RANKS } from "../lib/chess/utils";

export default function Home() {
  const [isBoardVisible, setIsBoardVisible] = useState(false)
  const [square, setSquare] = useState("")
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)


  const handleColorButtonClicked = (color: string) => {
    setIsBoardVisible(true)

    const isCorrect = (color === "light") === isLightSquare(square[0], Number(square[1]));
    setShowCorrectFeedback(isCorrect);
    setShowWrongFeedback(!isCorrect);


    // Clear any existing timeout before starting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsBoardVisible(false);
      setShowCorrectFeedback(false);
      setShowWrongFeedback(false);
      setSquare(generateSquarePrompt(FILES, RANKS))
    }, 2000)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

    useEffect(() => {
    setSquare(generateSquarePrompt(FILES, RANKS));
  }, []);

  return (
    <>
    <Navbar/>
    <div className="page-container flex justify-center">
      <div className="mt-12 mx-32 flex flex-col flex-1 w-full lg:w-1/2 gap-5 items-center lg:items-start lg:flex-row lg:justify-center lg:gap-20">
        <Board isVisible={isBoardVisible}/>
        <div className="flex flex-col gap-10 w-1/2">
          <div className="flex items-center justify-around">
            <h2 className="text-lg font-bold text-secondary-foreground lg:w-1/2 select-none">
              Square Color Drill
            </h2>

          <Button variant="outline" size="icon" className="">
            <Settings/>
          </Button>
          </div>


          <h3 className="self-center text-xl font-bold select-none">What color is <span className="font-extrabold text-3xl text-chart-3">{square}</span></h3>

          <div className="flex w-full justify-center gap-10">
          <Button onClick={() => handleColorButtonClicked("dark")} variant="square_guess_dark" size={"lg"} className="bg-black text-white select-none">
            Dark
          </Button>
          <Button onClick={() => handleColorButtonClicked("light")} variant="square_guess_light" size={"lg"} className="bg-white text-black select-none">
            Light
          </Button>
          </div>

<div className="relative w-full lg:w-3/4 lg:max-w-lg h-16 mx-auto">
  {/* Correct Feedback */}
  <Item
    variant="muted"
    size="sm"
    asChild
    className={`absolute top-0 left-0 w-full flex justify-center transition-opacity duration-500
                ${showCorrectFeedback ? "opacity-100" : "opacity-0 pointer-events-none"}`}
  >
    <div className="flex flex-row justify-items-center bg-green-500/10 text-green-600 dark:text-green-400 p-2 rounded">
      <ItemMedia>
        <BadgeCheckIcon className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-xl">Correct</ItemTitle>
      </ItemContent>
    </div>
  </Item>

  {/* Wrong Feedback */}
  <Item
    variant="muted"
    size="sm"
    asChild
    className={`absolute top-0 left-0 w-full flex justify-center transition-opacity duration-500
                ${showWrongFeedback ? "opacity-100" : "opacity-0 pointer-events-none"}`}
  >
    <div className="flex flex-row justify-items-center bg-red-500/10 text-red-600 dark:text-red-400 p-2 rounded">
      <ItemMedia>
        <BadgeX className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-xl">Wrong</ItemTitle>
      </ItemContent>
    </div>
  </Item>
</div>


        </div>

      </div>
    </div>

    </>
  );
}

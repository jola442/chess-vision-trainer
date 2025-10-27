"use client"

import Image from "next/image";
import Navbar from "@/src/components/navbar"
import SquareGuessBoard from "../components/chess/SquareGuessBoard";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import { FILES, generateSquarePrompt, isLightSquare, RANKS } from "../lib/chess/utils";

export default function Home() {
  const [isBoardVisible, setIsBoardVisible] = useState(false)
  const [square, setSquare] = useState("")
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);
  const [onCoolDown, setOnCoolDown] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)


  const handleColorButtonClicked = (color: string) => {
    if(onCoolDown){
      return;
    }
    setOnCoolDown(true)
    setIsBoardVisible(true)
    setHighlightedSquares([square])

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
      setOnCoolDown(false)
      setSquare(generateSquarePrompt(FILES, RANKS))
    }, 3000)
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
      <div className="mt-6 md:mt-12 flex flex-col w-full gap-5 md:gap-15 items-center md:items-start md:flex-row md:justify-center">
      <div className="flex flex-shrink-0 w-full md:w-fit justify-center md:justify-end">
        <SquareGuessBoard isVisible={isBoardVisible} highlightedSquares={highlightedSquares}/>
      </div>
        <div className="flex flex-1 md:max-w-[40%] flex-col md:gap-10 gap-4">
          <div className="flex items-center md:justify-around md:gap-20 justify-between">
            <h2 className="text-lg font-bold text-secondary-foreground lg:w-1/2 select-none">
              Square Color Drill
            </h2>

          <Sheet>
            <SheetTrigger>
              <Button variant="outline" size="icon">
                <Settings/>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Customize your practice session. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
        </SheetFooter>
          </SheetContent>
          </Sheet>

          </div>


          <h3 className="self-center text-xl font-bold select-none">What color is <span className="font-extrabold text-3xl text-chart-3">{square}?</span></h3>

          <div className="flex w-full justify-center gap-10">
          <Button disabled={onCoolDown} onClick={() => handleColorButtonClicked("dark")} variant="square_guess_dark" size={"lg"} className="bg-black text-white select-none">
            Dark
          </Button>
          <Button disabled={onCoolDown} onClick={() => handleColorButtonClicked("light")} variant="square_guess_light" size={"lg"} className="bg-white text-black select-none">
            Light
          </Button>
          </div>

<div className="relative flex justify-center w-3/4 md:max-w-lg h-16 mx-auto">
  <Item
    variant="muted"
    size="sm"
    asChild
    className={`absolute top-0 left-0 w-full flex justify-center transition-opacity duration-500
                ${showCorrectFeedback ? "opacity-100" : "opacity-0 pointer-events-none"}`}
  >
    <div className="flex flex-row items-center justify-center gap-2 bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-2 rounded">
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

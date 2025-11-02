"use client"

import SquareGuessBoard from "@/src/components/chess/square-guess/Board";
import { Button } from "@/src/components/ui/button";
import { BadgeCheckIcon, BadgeX, BadgeQuestionMark } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemMedia
} from "@/src/components/ui/item";
import { useState, useRef, useEffect } from "react";
import { FILES, RANKS, isLightSquare } from "@/src/lib/chess/utils";
import { useLocalStorage } from "usehooks-ts";
import { Square, SquareGuesserSettings } from "@/src/lib/chess/types";
import { toast } from "sonner"
import SquareGuessSkeleton from "./DrillSkeleton";
import SquareGuesserDrillSettings from "./Settings";
import { AnimatePresence, motion } from "framer-motion";

export default function SquareGuessGame() {
  const [mounted, setMounted] = useState(false);
  const [square, setSquare] = useState("");
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);
  const [onCoolDown, setOnCoolDown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const availableSquaresRef = useRef<string[]>([]);
  const lastSquareRef = useRef<string | null>(null);
  const [savedSettings, setSavedSettings] = useLocalStorage<SquareGuesserSettings>(
  "square-guess-settings",
  {
    files: [...FILES],
    ranks: [...RANKS],
    toggles:{
      flipBoard: false,
      showBoard: true,
      showCoordinates: true,
    },
    squares: [] as Square[],
  }
);
  const [drillStarted, setDrillStarted] = useState(false);
  const [isBoardVisible, setIsBoardVisible] = useState(savedSettings.toggles.showBoard);


function generateSquarePrompt(settings:SquareGuesserSettings): string {
  // Determine the pool of squares
  let pool = [...(settings.squares ?? [])]
  if(settings.ranks?.length !== 0 && settings.files?.length !== 0){
    pool = [...pool, ...(settings?.files?.flatMap(f => settings?.ranks?.map(r => `${f}${r}`)) ?? [])] as Square[]
  }

  // Refill availableSquares if empty or has only the last used square
  if (availableSquaresRef.current?.length === 0 || (availableSquaresRef.current?.length === 1 && availableSquaresRef.current[0] === lastSquareRef.current)) {
    availableSquaresRef.current = pool;
    
    // Fisher-Yates shuffle
    for (let i = availableSquaresRef.current?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableSquaresRef.current[i], availableSquaresRef.current[j]] =
        [availableSquaresRef.current[j], availableSquaresRef.current[i]];
    }
  }

  // Pick next square, avoiding consecutive repeat if possible
  let nextSquare = availableSquaresRef.current?.pop()!;
  if (nextSquare === lastSquareRef.current && availableSquaresRef.current.length > 0) {
    availableSquaresRef.current.unshift(nextSquare); // put it back
    nextSquare = availableSquaresRef.current.pop()!;
  }

  lastSquareRef.current = nextSquare;
  return nextSquare;
}


  const handleColorButtonClicked = (color: string) => {
    if (onCoolDown || (square && square?.length < 2)) return;
    setOnCoolDown(true);
    setIsBoardVisible(true);
    setHighlightedSquares([square]);
    const isCorrect = (color === "light") === isLightSquare(square[0], Number(square[1]));
    setShowCorrectFeedback(isCorrect);
    setShowWrongFeedback(!isCorrect);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if(!savedSettings.toggles.showBoard){
        setIsBoardVisible(false);
      }
      setHighlightedSquares([])
      setShowCorrectFeedback(false);
      setShowWrongFeedback(false);
      setOnCoolDown(false);
      setSquare(generateSquarePrompt(savedSettings));
    }, 3000);
  };

function handleSaveChanges(settings:SquareGuesserSettings) {
  if(settings.toggles.showBoard){
    setIsBoardVisible(true)
  }

  else{
    setIsBoardVisible(false)
  }

  setSavedSettings({...settings});
  availableSquaresRef.current = [];
  toast.success(`Your changes have been saved`);
}



useEffect(() => {
  setSquare(generateSquarePrompt(savedSettings));

}, [
  savedSettings
]);


  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if(!mounted){
    return <SquareGuessSkeleton/>
  }


  return (
    <> 
<div className="mt-6 lg:mt-12 flex flex-col w-full gap-5 lg:gap-20 items-center lg:items-stretch lg:flex-row lg:justify-center">

          <div className="flex flex-shrink-0 w-full lg:w-fit justify-center lg:justify-end">
            <SquareGuessBoard
              isVisible={isBoardVisible}
              highlightedSquares={highlightedSquares}
              flipBoard={savedSettings.toggles?.flipBoard}
              isCoordinatesVisible={savedSettings.toggles?.showCoordinates}
            />
          </div>

          <div className="flex flex-1 lg:max-w-[40%] flex-col gap-4 p-8 lg:p-0">
            <div className="flex items-center lg:p-0">
              <div className="flex flex-1 gap-2 items-center">
              <BadgeQuestionMark/>
                <h2 className="text-lg lg:text-xl font-bold text-secondary-foreground select-none whitespace-nowrap">
                  Square Guesser Drill
                </h2>
              </div>

              <SquareGuesserDrillSettings settings={savedSettings} onSettingsSaved={handleSaveChanges}/>
            </div>

      <AnimatePresence initial={false} mode="wait">
        {!drillStarted ? (
          <motion.div
            key="tips"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-muted/30 rounded-xl p-6 mt-3 lg:mt-0 text-sm leading-relaxed text-muted-foreground mx-4 mb-14 lg:mx-0 lg:mb-0"
          >
<p className="text-lg font-semibold mb-2 text-foreground">How to Play:</p>
<p className="my-3 text-muted-foreground">
  A square (like <strong>e4</strong>) will appear. Click <strong>Light</strong> if you think it’s a light square, or <strong>Dark</strong> if you think it’s a dark one. 
  The board flashes briefly to show the answer, then a new square appears.
</p>

<p className="text-lg font-semibold mt-6 mb-2 text-foreground">Tips for Training:</p>
<ul className="list-disc ml-5 space-y-1 my-3">
  <li>Try to <strong>see</strong> the color instantly — don’t calculate by file and rank.</li>
  <li>Visualize the board in your mind instead of relying on the screen.</li>
  <li>Hide the board to practice pure visualization.</li>
  <li>Focus on smaller sections (like one rank or file) to build accuracy.</li>
</ul>

<div className="flex justify-end">
  <Button size="lg" onClick={() => setDrillStarted(true)}>
    Start Drill
  </Button>
</div>
          </motion.div>
        ) : (
          <motion.div
            key="drill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center mt-4 space-y-4"
          >
            <h3 className="self-center text-xl font-bold select-none">
              What color is <span className="font-extrabold text-3xl text-chart-3">{square}?</span>
            </h3>

            <p className="text-sm text-muted-foreground text-center select-none mt-1">
  Don’t calculate. Picture the board and trust your first instinct.
</p>


            <div className="flex w-full justify-center gap-10">
              <Button
                disabled={onCoolDown}
                onClick={() => handleColorButtonClicked("dark")}
                variant="square_guess_dark"
                size="lg"
                className="bg-black text-white select-none"
              >
                Dark
              </Button>
              <Button
                disabled={onCoolDown}
                onClick={() => handleColorButtonClicked("light")}
                variant="square_guess_light"
                size="lg"
                className="bg-white text-black select-none"
              >
                Light
              </Button>
            </div>

            <div className="relative flex justify-center w-full lg:max-w-lg h-16 mx-auto">
              <Item variant="none"
                size="sm"
                asChild
                className={`absolute top-0 left-0 w-full flex self-center justify-center transition-opacity duration-500
                  ${showCorrectFeedback ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <div className="flex flex-row items-center justify-center gap-2 bg-green-300/30 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-2 rounded">
                  <ItemMedia>
                    <BadgeCheckIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-xl select-none">Correct</ItemTitle>
                  </ItemContent>
                </div>
              </Item>

              <Item variant="none"
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
                    <ItemTitle className="text-xl select-none">Wrong</ItemTitle>
                  </ItemContent>
                </div>
              </Item>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


          </div>

          
        </div>
    </>
  );
}




"use client"

import Image from "next/image";
import Navbar from "@/src/components/navbar";
import SquareGuessBoard from "../components/chess/square-guess/Board";
import { Button } from "@/src/components/ui/button";
import { Settings, BadgeCheckIcon, BadgeX } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../components/ui/item";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";

import { useState, useRef, useEffect } from "react";
import { FILES, RANKS, isLightSquare } from "../lib/chess/utils";
import { useLocalStorage } from "usehooks-ts";
import { FileType, RankType, SquareGuesserSettings } from "../lib/chess/types";
import { toast } from "sonner"

export default function Home() {
  const [isBoardVisible, setIsBoardVisible] = useState(false);
  const [square, setSquare] = useState("");
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);
  const [onCoolDown, setOnCoolDown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const availableSquaresRef = useRef<string[]>([]);

  const [squareGuesserSettings, setSquareGuesserSettings] = useState<SquareGuesserSettings>({
    files: [...FILES],
    ranks: [...RANKS],
    showWhiteBoard: true,
  });

  const [savedSettings, setSavedSettings] = useLocalStorage<SquareGuesserSettings>(
    "square-guess-settings",
    squareGuesserSettings
  );

  function generateSquarePrompt(files: FileType[], ranks: RankType[]): string {
    if (availableSquaresRef.current.length === 0) {
      availableSquaresRef.current = files.flatMap((f) =>
        ranks.map((r) => `${f}${r}`)
      );
      for (let i = availableSquaresRef.current.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableSquaresRef.current[i], availableSquaresRef.current[j]] =
          [availableSquaresRef.current[j], availableSquaresRef.current[i]];
      }
    }
    return availableSquaresRef.current.pop()!;
  }

  function handleFileCheckboxClicked(file: FileType, checked: boolean | "indeterminate") {
    setSquareGuesserSettings((prev) => ({
      ...prev,
      files: checked
        ? [...prev.files, file]
        : prev.files.filter((f) => f !== file),
    }));
  }

  function handleRankCheckboxClicked(rank: RankType, checked: boolean | "indeterminate") {
    setSquareGuesserSettings((prev) => ({
      ...prev,
    ranks: checked
        ? [...prev.ranks, rank]
        : prev.ranks.filter((r) => r !== rank),
    }));
  }

  function handleSwitchChange(checked: boolean) {
    setSquareGuesserSettings((prev) => ({
      ...prev,
      showWhiteBoard: checked,
    }));
  }

  const handleColorButtonClicked = (color: string) => {
    if (onCoolDown) return;
    setOnCoolDown(true);
    setIsBoardVisible(true);
    setHighlightedSquares([square]);
    const isCorrect = (color === "light") === isLightSquare(square[0], Number(square[1]));
    setShowCorrectFeedback(isCorrect);
    setShowWrongFeedback(!isCorrect);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsBoardVisible(false);
      setShowCorrectFeedback(false);
      setShowWrongFeedback(false);
      setOnCoolDown(false);
      setSquare(generateSquarePrompt(savedSettings.files, savedSettings.ranks));
    }, 3000);
  };

  function saveChanges() {
    setSavedSettings(squareGuesserSettings);
    availableSquaresRef.current = [];
    toast.success("Your changes have been saved")
  }

  useEffect(() => {
    setSquare(generateSquarePrompt(savedSettings.files, savedSettings.ranks));
  }, [savedSettings.files, savedSettings.ranks]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setSquare(generateSquarePrompt([...FILES], [...RANKS]));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-container flex justify-center">
        <div className="mt-6 md:mt-12 flex flex-col w-full gap-5 md:gap-15 items-center md:items-start md:flex-row md:justify-center">
          <div className="flex flex-shrink-0 w-full md:w-fit justify-center md:justify-end">
            <SquareGuessBoard
              isVisible={isBoardVisible}
              highlightedSquares={highlightedSquares}
              showWhiteBoard={squareGuesserSettings.showWhiteBoard}
            />
          </div>

          <div className="flex flex-1 md:max-w-[40%] flex-col md:gap-10 gap-4">
            <div className="flex items-center md:justify-around md:gap-20 justify-between">
              <h2 className="text-lg font-bold text-secondary-foreground lg:w-1/2 select-none">
                Square Color Drill
              </h2>

              <Sheet>
                <SheetTrigger>
                  <Button variant="outline" size="icon">
                    <Settings />
                  </Button>
                </SheetTrigger>

                <SheetContent className="flex flex-col h-full">
                  <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <ItemDescription>
                      Customize your practice session. Click save when you're done.
                    </ItemDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-auto">
                    <Item variant="muted" className="mt-5">
                      <ItemContent>
                        <ItemTitle className="mb-2 font-bold">Ranks</ItemTitle>
                        <div className="grid grid-cols-4 gap-2 mb-5">
                          {RANKS.map((rank) => (
                            <div key={rank} className="flex items-center gap-2">
                              <Checkbox
                                checked={squareGuesserSettings.ranks.includes(rank)}
                                id={String(rank)}
                                onCheckedChange={(checked) => handleRankCheckboxClicked(rank, checked)}
                              />
                              <Label htmlFor={String(rank)}>{rank}</Label>
                            </div>
                          ))}
                        </div>

                        <ItemTitle className="mb-2 font-bold">Files</ItemTitle>
                        <div className="grid grid-cols-4 gap-2 mb-5">
                          {FILES.map((file) => (
                            <div key={file} className="flex items-center gap-2">
                              <Checkbox
                                checked={squareGuesserSettings.files.includes(file)}
                                id={file}
                                onCheckedChange={(checked) => handleFileCheckboxClicked(file, checked)}
                              />
                              <Label htmlFor={file}>{file.toUpperCase()}</Label>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-4">
                          <div>
                            <ItemTitle>Play as White</ItemTitle>
                            <ItemDescription>Show the board from White's perspective</ItemDescription>
                          </div>
                          <Switch
                            checked={squareGuesserSettings.showWhiteBoard}
                            onCheckedChange={handleSwitchChange}
                          />
                        </div>
                      </ItemContent>
                    </Item>
                  </div>

                  <SheetFooter className="mt-auto gap-5">
                    <SheetClose asChild>
                      <Button type="submit" onClick={saveChanges}>Save changes</Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="outline">Close</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <h3 className="self-center text-xl font-bold select-none">
              What color is <span className="font-extrabold text-3xl text-chart-3">{square}?</span>
            </h3>

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

            <div className="relative flex justify-center w-full md:max-w-lg h-16 mx-auto">
              <Item
                variant="muted"
                size="sm"
                asChild
                className={`absolute top-0 left-0 w-full flex self-center justify-center transition-opacity duration-500
                  ${showCorrectFeedback ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <div className="flex flex-row items-center justify-center gap-2 bg-green-300/50 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-2 rounded">
                  <ItemMedia>
                    <BadgeCheckIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-xl select-none">Correct</ItemTitle>
                  </ItemContent>
                </div>
              </Item>

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
                    <ItemTitle className="text-xl select-none">Wrong</ItemTitle>
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

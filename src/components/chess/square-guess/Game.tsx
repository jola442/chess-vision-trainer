"use client"

import SquareGuessBoard from "@/src/components/chess/square-guess/Board";
import { Button } from "@/src/components/ui/button";
import { Settings, BadgeCheckIcon, BadgeX, Eye } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/src/components/ui/item";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs"
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";

import { useState, useRef, useEffect } from "react";
import { FILES, RANKS, isLightSquare } from "@/src/lib/chess/utils";
import { useLocalStorage } from "usehooks-ts";
import { FileType, RankType, Square, SquareGuesserSettings } from "@/src/lib/chess/types";
import { toast } from "sonner"
import { KEY_SQUARE_SETS, WHITE_BOTTOM_RANKS, WHITE_LEFT_FILES, WHITE_RIGHT_FILES, WHITE_TOP_RANKS } from "@/src/lib/chess/constants";
import SquareGuessSkeleton from "./GameSkeleton";

const settingTabs = {
  "key-squares": "Key Squares",
  "coordinates": "Coordinates"
} as const;

type SettingTabType = keyof typeof settingTabs;
// type RanksAndFilesType = (RankType | FileType)[] 

type GenerateSquareArgs = 
  | { squares: Square[] } 
  | { files: FileType[], ranks: RankType[] };

const sections = [
  "Top Half",
  "Bottom Half",
  "Top Left",
  "Top Right",
  "Bottom Left",
  "Bottom Right",
] as const;

export type SectionType = typeof sections[number];

export const whiteSections: Record<SectionType, (string | number)[]> = {
  "Top Half": [...WHITE_TOP_RANKS, ...WHITE_LEFT_FILES, ...WHITE_RIGHT_FILES],
  "Bottom Half": [...WHITE_BOTTOM_RANKS, ...WHITE_LEFT_FILES, ...WHITE_RIGHT_FILES],
  "Top Left": [...WHITE_TOP_RANKS, ...WHITE_LEFT_FILES],
  "Top Right": [...WHITE_TOP_RANKS, ...WHITE_RIGHT_FILES],
  "Bottom Left": [...WHITE_BOTTOM_RANKS, ...WHITE_LEFT_FILES],
  "Bottom Right": [...WHITE_BOTTOM_RANKS, ...WHITE_RIGHT_FILES],
};

export const blackSections: Record<SectionType, (string | number)[]> = {
  "Top Half": whiteSections["Bottom Half"],
  "Bottom Half": whiteSections["Top Half"],
  "Top Left": whiteSections["Bottom Right"],
  "Top Right": whiteSections["Bottom Left"],
  "Bottom Left": whiteSections["Top Right"],
  "Bottom Right": whiteSections["Bottom Left"]
};




export default function SquareGuessGame() {
  const [mounted, setMounted] = useState(false);
  const [isBoardVisible, setIsBoardVisible] = useState(false);
  const [square, setSquare] = useState("");
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);
  const [onCoolDown, setOnCoolDown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const availableSquaresRef = useRef<string[]>([]);
  const lastSquareRef = useRef<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
const [savedSettings, setSavedSettings] = useLocalStorage<SquareGuesserSettings>(
  "square-guess-settings",
  {
    files: [...FILES],
    ranks: [...RANKS],
    showWhiteBoard: true,
    squares: [] as Square[],
  }
);


const [squareGuesserSettings, setSquareGuesserSettings] = useState<SquareGuesserSettings>(() => {
  return savedSettings || {
    files: [...FILES],
    ranks: [...RANKS],
    showWhiteBoard: true,
    squares: [] as Square[],
  };
});


const [activeTab, setActiveTab] = useState<SettingTabType>(savedSettings.squares?.length !== 0? "key-squares" : "coordinates")

function generateSquarePrompt(args: GenerateSquareArgs): string {
  // Determine the pool of squares
  let pool: string[];
  if ("squares" in args) {
    pool = [...args.squares];
  } else {
    pool = args.files?.flatMap(f => args.ranks.map(r => `${f}${r}`));
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




  function handleFileCheckboxClicked(file: FileType, checked: boolean | "indeterminate") {
    setSquareGuesserSettings((prev) => ({
      ...prev,
      files: checked
        ? [...(prev.files ?? []), file]
        : (prev.files ?? []).filter((f) => f !== file),
    }));
  }

  function handleRankCheckboxClicked(rank: RankType, checked: boolean | "indeterminate") {
    setSquareGuesserSettings((prev) => ({
      ...prev,
    ranks: checked
        ? [...prev.ranks ?? [], rank]
        : (prev.ranks ?? []).filter((r) => r !== rank),
    }));
  }

  
  function handleKeySquareClicked(squares: Square[], checked: boolean | "indeterminate") {
    setSquareGuesserSettings((prev) => ({
      ...prev,
    squares: checked
        ? [...(prev.squares ?? []), ...squares]
        : (prev.squares ?? []).filter((sq) => !squares.includes(sq)),
    }));
  }

  function handleSwitchChange(checked: boolean) {
    setSquareGuesserSettings((prev) => ({
      ...prev,
      showWhiteBoard: checked,
    }));
  }

  const handleColorButtonClicked = (color: string) => {
    if (onCoolDown || square.length < 2) return;
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
      let squarePromptInput = {} as GenerateSquareArgs;
      if(savedSettings.files?.length !== 0 && savedSettings.ranks,length !== 0){
        squarePromptInput = {files: savedSettings.files ?? [], ranks:savedSettings.ranks ?? []}
      }

      else if(savedSettings.squares?.length !== 0){
        squarePromptInput = {squares: savedSettings.squares ?? []}
      }

      setSquare(generateSquarePrompt(squarePromptInput));
    }, 3000);
  };

function handleSaveChanges() {
  const newSettings = {
    ...squareGuesserSettings,
    squares: activeTab === "coordinates" ? [] : squareGuesserSettings.squares,
    files: activeTab === "key-squares" ? [] : squareGuesserSettings.files,
    ranks: activeTab === "key-squares" ? [] : squareGuesserSettings.ranks,
  };

  setSavedSettings(newSettings);
  availableSquaresRef.current = [];
  toast.success(`Your changes have been saved`);
}



useEffect(() => {
  let squarePromptInput: GenerateSquareArgs;

  if (savedSettings.squares?.length) {
    squarePromptInput = { squares: savedSettings.squares };
  } else if (savedSettings.files?.length && savedSettings.ranks?.length) {
    squarePromptInput = { files: savedSettings.files, ranks: savedSettings.ranks };
  } else {
    squarePromptInput = { files: [...FILES], ranks: [...RANKS] };
  }

  setSquare(generateSquarePrompt(squarePromptInput));
  setSquareGuesserSettings(savedSettings)
}, [
  savedSettings.files,
  savedSettings.ranks,
  savedSettings.squares,
  savedSettings.showWhiteBoard,
]);


  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    setSquare(generateSquarePrompt({files:[...FILES], ranks: [...RANKS]}))
  }, []);

  if(!mounted){
    return <SquareGuessSkeleton/>
  }


  return (
    <> 
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

              <Sheet open={isSettingsOpen} onOpenChange={(open) => {
                if(!open){
                  setSquareGuesserSettings(savedSettings)
                  setIsSettingsOpen(false)
                }

                }}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
                    <Settings />
                  </Button>
                </SheetTrigger>

                <SheetContent className="flex flex-col h-full">
                  <SheetHeader>
                    <SheetTitle className="text-xl">Settings</SheetTitle>
                    {/* <ItemDescription>
                      Customize your practice session. Click save when you're done.
                    </ItemDescription> */}
                  </SheetHeader>

                  <div className="flex-1 overflow-auto">
                    <SheetTitle className="text-md">Mode</SheetTitle>
                    <SheetDescription className="mb-2">Select one method for generating square prompts</SheetDescription>
                    <Tabs defaultValue={activeTab} onValueChange={(val) => setActiveTab(val as SettingTabType)}>
                      <TabsList>
                        <TabsTrigger value="coordinates">Coordinates</TabsTrigger>
                        <TabsTrigger value="key-squares">Key Squares</TabsTrigger>
                      </TabsList>
                      <TabsContent value="coordinates">
                    <Item variant="muted" className="mt-5">
                      <ItemContent>
                      {/* <ItemTitle className="mb-2 font-bold">Sections</ItemTitle>
                        <div className="grid grid-cols-4 gap-2 mb-5">
                          {sections.map((section) => (
                            <div key={section} className="flex items-center gap-2">
                              <Checkbox
                                checked={squareGuesserSettings.showWhiteBoard? whiteSections[section].some( (sec) )}
                                id={String(section)}
                                onCheckedChange={(checked) => handleSectionCheckboxClicked(section, checked)}
                              />
                              <Label htmlFor={String(section)}>{section}</Label>
                            </div>
                          ))}
                        </div> */}
                        <ItemTitle className="mb-2 font-bold">Ranks</ItemTitle>
                        <div className="grid grid-cols-4 gap-2 mb-5">
                          {RANKS.map((rank) => (
                            <div key={rank} className="flex items-center gap-2">
                              <Checkbox
                                checked={squareGuesserSettings?.ranks?.includes(rank)}
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
                                checked={squareGuesserSettings?.files?.includes(file)}
                                id={file}
                                onCheckedChange={(checked) => handleFileCheckboxClicked(file, checked)}
                              />
                              <Label htmlFor={file}>{file.toUpperCase()}</Label>
                            </div>
                          ))}
                        </div>
                      </ItemContent>
                    </Item>

                      </TabsContent>
                      <TabsContent value="key-squares">
                    <Item variant="muted" className="mt-5">
                      <ItemContent>
                        <ItemTitle className="mb-2 font-bold">Common Squares</ItemTitle>
                        <div className="grid grid-cols-1 gap-2 mb-5">
                              {Object.entries(KEY_SQUARE_SETS).map( ([label, squares]) => (
                                  <div key={label} className="flex items-center">
                                    <Checkbox
                                      checked={squares.every( (square) => squareGuesserSettings.squares?.includes(square as Square))}
                                      id={label}
                                      className="mr-2"
                                      onCheckedChange={(checked) => handleKeySquareClicked(squares as Square[], checked)}
                                    />
                                    <Label className="" htmlFor={String(label)}>{label}</Label>
                                  <div className="flex ml-2 gap-1">
                                    {squares.map((square, i) => (
                                      <span key={i}>
                                        {i === 0 ? `(${square},` : i === squares.length - 1 ? `${square})` : `${square},`}
                                      </span>
                                    ))}
                                  </div>
                                  </div>
                              ))}
                            </div>
                      </ItemContent>
                    </Item>

                      </TabsContent>
                    </Tabs>

                    <Item variant="muted" className="mt-5">
                      <ItemContent>
                        <div className="flex items-center justify-between gap-4">
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
                      <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
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
          </div>
        </div>
    </>
  );
}

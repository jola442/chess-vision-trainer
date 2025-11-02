"use client"

import { Button } from "@/src/components/ui/button";
import { Settings } from "lucide-react";
import {
  Item,
  ItemContent,
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

import { useState } from "react";
import { FILES, RANKS } from "@/src/lib/chess/utils";
import { FileType, RankType, Square } from "@/src/lib/chess/types";
import { KEY_SQUARE_SETS, WHITE_BOTTOM_RANKS, WHITE_LEFT_FILES, WHITE_RIGHT_FILES, WHITE_TOP_RANKS } from "@/src/lib/chess/constants";

const settingTabs = {
  "key-squares": "Key Squares",
  "coordinates": "Coordinates"
} as const;

type SettingTabType = keyof typeof settingTabs;

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

import { SquareGuesserSettings } from "@/src/lib/chess/types";

interface SquareGuesserDrillSettingsProps{
    settings: SquareGuesserSettings,
    onSettingsSaved: (newSettings: SquareGuesserSettings) => void
}

function SquareGuesserDrillSettings( {settings, onSettingsSaved}: SquareGuesserDrillSettingsProps) {
    const [localSettings, setLocalSettings] = useState(settings);
    const [activeTab, setActiveTab] = useState<SettingTabType>(settings.squares?.length !== 0? "key-squares" : "coordinates");

    
    function handleFileCheckboxClicked(file: FileType, checked: boolean | "indeterminate") {
        setLocalSettings((prev) => ({
        ...prev,
        files: checked
            ? [...(prev.files ?? []), file]
            : (prev.files ?? []).filter((f) => f !== file),
        }));
    }

    function handleRankCheckboxClicked(rank: RankType, checked: boolean | "indeterminate") {
        setLocalSettings((prev) => ({
        ...prev,
        ranks: checked
            ? [...prev.ranks ?? [], rank]
            : (prev.ranks ?? []).filter((r) => r !== rank),
        }));
    }


    function handleKeySquareClicked(squares: Square[], checked: boolean | "indeterminate") {
        setLocalSettings((prev) => ({
        ...prev,
        squares: checked
            ? [...(prev.squares ?? []), ...squares]
            : (prev.squares ?? []).filter((sq) => !squares.includes(sq)),
        }));
    }

    type SquareGuesserToggles = keyof typeof localSettings.toggles;

    function handleSwitchChange(toggle: SquareGuesserToggles, checked: boolean) {
        setLocalSettings((prev) => ({
        ...prev,
        toggles: {...prev.toggles, [toggle]:checked},
        }));
    }

    function handleSaveChanges(){
			if (activeTab === "key-squares") {
				onSettingsSaved({ ...localSettings, files: [], ranks: [] });
				return;
			}

			if (activeTab === "coordinates") {
				onSettingsSaved({ ...localSettings, squares: [] });
				return;
			}

			const _exhaustive: never = activeTab;
			throw new Error(`Unhandled tab: ${_exhaustive}`);
    }

    
    

  return (
        <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline" size="icon">
            <Settings />
            </Button>
        </SheetTrigger>

        <SheetContent className="flex flex-col h-full">
            <SheetHeader>
            <SheetTitle className="text-xl">Settings</SheetTitle>

            </SheetHeader>
                                <SheetDescription className="text-sm text-muted-foreground">
    Customize your practice area and visualization settings.  
Choose your focus: <strong>Coordinates</strong> or <strong>Key Squares</strong>.
Begin with smaller areas (e.g. ranks 1–4 or central/fianchetto squares).
As you progress, hide the board to train pure visualization.
    </SheetDescription>

            <div className="flex-1 overflow-auto">
            {/* <SheetTitle className="text-md">Mode</SheetTitle> */}


            {/* <SheetDescription className="mb-2">Select one method for generating square prompts</SheetDescription> */}
            <Tabs defaultValue={activeTab} onValueChange={(val) => setActiveTab(val as SettingTabType)}>
                <TabsList>
                <TabsTrigger value="coordinates">Coordinates</TabsTrigger>
                <TabsTrigger value="key-squares">Key Squares</TabsTrigger>
                </TabsList>
                <TabsContent value="coordinates">
            <Item variant="muted" className="mt-5 h-[30vh]">
                <ItemContent>
                {/* <ItemTitle className="mb-2 font-bold">Sections</ItemTitle>
                <div className="grid grid-cols-4 gap-2 mb-5">
                    {sections.map((section) => (
                    <div key={section} className="flex items-center gap-2">
                        <Checkbox
                        checked={squareGuesserSettings.toggles?.showBoard? whiteSections[section].some( (sec) )}
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
                        checked={localSettings?.ranks?.includes(rank)}
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
                        checked={localSettings?.files?.includes(file)}
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
            <Item variant="muted" className="mt-5 h-[30vh]">
                <ItemContent>
                <ItemTitle className="mb-2 font-bold">Common Squares</ItemTitle>
                <div className="grid grid-cols-1 gap-2 mb-5">
                        {Object.entries(KEY_SQUARE_SETS).map( ([label, squares]) => (
                            <div key={label} className="flex items-center">
                            <Checkbox
                                checked={squares.every( (square) => localSettings.squares?.includes(square as Square))}
                                id={label}
                                className="mr-2"
                                onCheckedChange={(checked) => handleKeySquareClicked(squares as Square[], checked)}
                            />
                            <Label className="whitespace-nowrap" htmlFor={String(label)}>{label}</Label>
                            <div className="flex ml-2 gap-1">
                            {squares.map((square, i) => (
                                <span className="whitespace-break-spaces" key={i}>
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
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {([
                { title: "Flip Sides", key: "flipBoard" },
                { title: "Show Board", key: "showBoard" },
                { title: "Show Coordinates", key: "showCoordinates" },
                ] as const).map(({ title, key }) => (
                <div key={key} className="flex items-center">
                    <div className="flex-1">
                    <ItemTitle>{title}</ItemTitle>
                    </div>
                    <Switch className="flex-grow-0"
                    checked={localSettings.toggles?.[key]}
                    onCheckedChange={(checked) => handleSwitchChange(key, checked)}
                    />
                </div>
                ))}
                </div>

            </ItemContent>
            </Item>

            </div>

            <SheetFooter className="mt-auto gap-2">
            <SheetClose asChild>
                <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
            </SheetClose>
            <SheetClose asChild>
                <Button variant="outline">Close</Button>
            </SheetClose>
            </SheetFooter>
        </SheetContent>
        </Sheet>
  )
}

export default SquareGuesserDrillSettings
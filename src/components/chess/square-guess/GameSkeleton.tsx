"use client"

import { Skeleton } from "@/src/components/ui/skeleton"

export default function SquareGuessSkeleton() {
  return (
    <div className="mt-6 md:mt-12 flex flex-col w-full gap-5 md:gap-15 items-center md:items-start md:flex-row md:justify-center">
      
      {/* Board placeholder */}
      <div className="flex flex-shrink-0 w-full md:w-fit justify-center md:justify-end rounded-lg">
        <Skeleton className="w-[360px] h-[360px] md:w-[420px] md:h-[420px] rounded-2xl" />
      </div>

      {/* Right panel */}
      <div className="flex flex-1 md:max-w-[40%] flex-col md:gap-10 gap-4">
        
        {/* Header row */}
        <div className="flex items-center md:justify-around md:gap-20 justify-between">
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-10 w-16 rounded-lg" />
        </div>

        {/* Title block */}
        <div className="flex justify-center">
          <Skeleton className="h-10 w-3/4 rounded-lg" />
        </div>

        {/* Buttons */}
        <div className="flex w-full justify-center gap-10">
          <Skeleton className="h-14 w-32 rounded-xl" />
          <Skeleton className="h-14 w-32 rounded-xl" />
        </div>

        {/* Feedback area */}
        <div className="relative flex justify-center w-full md:max-w-lg h-16 mx-auto">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

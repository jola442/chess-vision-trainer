"use client"

import { Skeleton } from "@/src/components/ui/skeleton"

export default function SquareGuessSkeleton() {
  return (
    <div className="mt-6 lg:mt-12 flex flex-col w-full gap-5 lg:gap-20 items-center lg:items-stretch lg:flex-row lg:justify-center">
      
      {/* Board placeholder */}
      <div className="flex flex-shrink-0 w-full lg:w-fit justify-center lg:justify-end">
        {/* smaller on mobile, larger on desktop */}
        <Skeleton className="w-[260px] h-[260px] md:w-[340px] md:h-[340px] lg:w-[420px] lg:h-[420px] rounded-2xl" />
      </div>

      {/* Right panel */}
      <div className="flex flex-1 lg:max-w-[40%] w-full flex-col gap-6 px-4 md:px-8 lg:px-0">
        
        {/* Header row */}
        <div className="flex items-center justify-between py-2 lg:py-0">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-40 md:w-48 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>

        {/* Training Tips / Drill Section */}
        <div
          className="bg-muted/30 rounded-xl p-4 md:p-6 mt-2 lg:mt-0 text-sm leading-relaxed mx-0 lg:mx-0 mb-6 lg:mb-0 flex flex-col justify-between"
        >
          <div>
            <Skeleton className="h-6 w-36 mb-3 rounded-md" />
            <div className="space-y-2 mb-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <Skeleton className="h-6 w-32 mb-3 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-3/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

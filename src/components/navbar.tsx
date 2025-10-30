"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/src/components/ui/navigation-menu";
import { ModeToggle } from "@/src/components/ui/mode-toggle";


type Props = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

function Logo({ className = "h-8 w-auto text-foreground", ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      {...props}
    >
      <circle cx="50" cy="18.280" r="13.530" />
      <path d="M81.143 89.937a5.151 5.151 0 01-5.151 5.151H24.008a5.151 5.151 0 01-5.151-5.151 5.151 5.151 0 015.151-5.151h51.984a5.151 5.151 0 015.151 5.151z" />
      <path d="M69.046 50.006a3.845 3.845 0 01-3.846 3.843H34.797a3.845 3.845 0 01-3.843-3.843 3.845 3.845 0 013.843-3.844h30.403a3.845 3.845 0 013.846 3.844z" />
      <path d="M70.968 39.216a3.844 3.844 0 01-3.845 3.843H32.875a3.844 3.844 0 01-3.843-3.843 3.844 3.844 0 013.843-3.845h34.248a3.844 3.844 0 013.845 3.845z" />
      <path d="M27.885 81.862c11.995-8.386 8.456-24.828 8.456-24.828h27.059s-2.638 16.114 8.714 24.828H27.885z" />
    </svg>
  );
}


export default function Navbar() {
  return (
<nav className="fixed top-0 left-0 w-full h-[68px] z-50 
  bg-card-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex-nowrap">
        <div className="flex items-center justify-between gap-4 flex-nowrap">
          <Link href="/" className="flex items-end gap-1 group">
            <Logo className="h-8 w-auto text-primary transition-transform group-hover:scale-105 duration-200" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-foreground/90 text-2xl">Chess</span>
              <span className="dark:text-muted-foreground text-gray-500">
                Vision
              </span>
            </span>
          </Link>


          <div className="flex items-center gap-6 font-medium">
            <div className="hidden md:flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-6">
                  {[
                    { href: "/", label: "Home" },
                    // { href: "#practice", label: "Practice" },
                    // { href: "#leaderboard", label: "Leaderboard" },
                    { href: "/#about", label: "About" },
                  ].map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink
                        asChild
                      >
                        <a className="font-bold text-lg"
                          href={item.href}
                        >
                          {item.label}
                        </a>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-6">
              <ModeToggle />
              <Link href="/train">
                <Button
                  variant="default"
                  size="default"
                  data-testid="button-start-training"
                >
                  Start Training
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

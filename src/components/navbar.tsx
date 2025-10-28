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
import Image from "next/image";
import Logo from "@/public/logo.svg"; // your SVG file

export default function Navbar() {
  return (
    <nav className="border-solid-border bg-secondary text-foreground h-[68px]">
      <div className="container mx-auto px-4 py-4 flex-nowrap">
        <div className="flex items-center justify-between gap-4 flex-nowrap">
          {/* Logo / Branding */}
          <div className="flex items-center">
            <Link href="/home" aria-label="Go to homepage">
              <Image
                src={Logo}
                alt="Logo"
                width={120} // adjust width
                height={32} // adjust height
                className="object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links + CTA */}
          <div className="flex items-center gap-6 font-medium">
            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-6">
                  {[
                    { href: "#home", label: "Home" },
                    // { href: "#practice", label: "Practice" },
                    // { href: "#leaderboard", label: "Leaderboard" },
                    { href: "#about", label: "About" },
                  ].map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <a href={item.href}>{item.label}</a>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-3">
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

"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import {  
  Card,
//   CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { Palette, Brain, FlaskConical } from "lucide-react";

const process = [
  {
    title: "Memorize Square Colors",
    desc: "Start with a board that flashes individual squares and gives instant feedback. Focus on identifying whether a square is light or dark. No timer, no calculations, just learning.",
    href: "/square-guesser",
    icon: <Palette/>
  },
  {
    title: "Master Piece Movement",
    desc: "Visualize piece movements and calculate positions mentally. Practice calculating knight moves, bishop diagonals, and complex patterns.",
    href: "/color-test",
    icon: <Brain/>
  },
  {
    title: "Test Your Blindfold Skills",
    desc: "Measure your progress by completing timed challenges that test your square and move recognition speed.",
    href: "/coordinate-clicker",
    icon:<FlaskConical/>
  },
//   {
//     title: "Piece Manoeuvre",
//     desc: "Visualize every possible move for each piece.",
//     href: "/piece-manoeuvre",
//   },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  return (
    <div className="page-container">
<section className="relative flex flex-col items-center justify-center text-center flex-1 px-6 py-24 overflow-hidden h-3/4  lg:h-full">
  <motion.div
    className="absolute inset-0"
    initial={{ opacity: 0 }}
    animate={{
        opacity: 0.05,
        backgroundPositionX: ["0%", "100%"],
        backgroundPositionY: ["0%", "100%"],
    }}
    transition={{
        opacity: { duration: 0.5 },
        backgroundPositionX: { duration: 20, repeat: Infinity, repeatType: "mirror" },
        backgroundPositionY: { duration: 20, repeat: Infinity, repeatType: "mirror" },
    }}
    style={{
      backgroundImage: `
        linear-gradient(45deg, hsl(var(--foreground)) 25%, transparent 25%),
        linear-gradient(-45deg, hsl(var(--foreground)) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, hsl(var(--foreground)) 75%),
        linear-gradient(-45deg, transparent 75%, hsl(var(--foreground)) 75%)
      `,
      backgroundSize: "40px 40px",
      backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
    }}
  />

  <motion.h2
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-4xl md:text-6xl font-extrabold mb-4 z-10"
  >
    See the board without seeing the board.
  </motion.h2>

  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.6 }}
    className="text-lg text-muted-foreground max-w-2xl mb-8 z-10"
  >
    Train your chess vision and pattern recognition with interactive process designed to sharpen your mind.
  </motion.p>

    <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay:0.6, duration: 1 }}
    className="text-4xl md:text-6xl font-extrabold mb-4 flex gap-4 z-10"
  >
    <Button asChild size="lg">
      <Link href="#process">Start Training</Link>
    </Button>
    <Button asChild size="lg" variant="outline">
      <Link href="#about">Learn More</Link>
    </Button>
  </motion.div>
</section>


      <section id="about" className="px-12 py-20 bg-secondary/30 mx-auto">
  <motion.h3
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{once:true, amount:1}}
    transition={{ duration:0.5 }}
    className="text-3xl font-bold mb-6 z-10 text-center"
  >
    How it works
  </motion.h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 justify-items-center place-items-center gap-6">
          {process.map((process, i) => (
            <motion.div
              key={process.title}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{once:true, amount:1}}
              transition={{ delay: i * 0.3, duration:1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 border-none lg:h-[275px] min-h-[35vh]"> 
                  <div className="relative top-4 left-5 mb-2 bg-muted w-fit p-3 rounded-xl">
                    {process.icon}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{process.title}</CardTitle>
                    <CardDescription className="text-lg">{process.desc}</CardDescription>
                  </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-6">About ChessVision</h3>
        <p className="text-muted-foreground text-lg mb-4">
          ChessVision is built to train your ability to visualize the chessboard — even when it’s not in front of you.
          Improve your pattern recognition, board memory, and reaction time through focused mini-games.
        </p>
        {/* <p className="text-sm text-muted-foreground">
          Free for now. Ads may be added later to support development. Premium features coming soon.
        </p> */}
        <div className="mt-8">
          <Badge variant="outline">Made with ♟️ by Jola Ajayi</Badge>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t text-center py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} VisionChess. All rights reserved.
      </footer>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import {  
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import Link from "next/link";
import { Palette, Brain, FlaskConical } from "lucide-react";
import Image from "next/image";
import ChessArrows from "@/public/ChessArrows.png"
import Blunder from "@/public/Blunder.jpeg"
import Calculate from "@/public/Calculate.jpg"
import { useMediaQuery } from "usehooks-ts";


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
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      <Link href="/drills/square-guesser">Start Training</Link>
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
              transition={{ delay: isMobile? 0: i * 0.3, duration:1 }}
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

<section id="why" className="px-6 py-20 mx-auto max-w-6xl">
  <h3 className="text-3xl font-bold mb-12 text-center">Why You Should Learn</h3>
  <motion.div
  className="grid grid-cols-1 lg:grid-cols-3 gap-10"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.6,
      },
    },
  }}
>
  <motion.div
    variants={{
hidden: { opacity: 0, x: -50, y: 20 },
visible: { opacity: 1, x: 0, y: 0 }

    }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="flex flex-col items-center text-center"
  >
      <div className="w-full rounded-xl overflow-hidden shadow-md mb-4">
        <Image
          src={Calculate}
          alt="See patterns on the chessboard"
          width={400}
          height={300}
          className="w-full h-auto object-cover"
        />
      </div>
      <h4 className="text-xl font-semibold mb-2">Calculate Like a Grandmaster</h4>
      <p className="text-muted-foreground">Calculate variations deeper and faster to have your opponents mashing the Report button</p>
  </motion.div>

  {/* Reason 2 */}
  <motion.div
    variants={{
hidden: { opacity: 0, x: -50, y: 30 },
visible: { opacity: 1, x: 0, y: 0 }

    }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="flex flex-col items-center text-center"
  >
      <div className="w-full rounded-xl overflow-hidden shadow-md mb-4">
        <Image
          src={ChessArrows}
          alt="Play like a pro"
          width={400}
          height={300}
          className="w-full h-auto object-cover"
        />
      </div>
      <h4 className="text-xl font-semibold mb-2">Follow Chess Commentary</h4>
      <p className="text-muted-foreground">When top players are explaining variations, you’ll actually see it in your mind instead of getting lost in the arrows..</p>
  </motion.div>

  {/* Reason 3 */}
  <motion.div
    variants={{
hidden: { opacity: 0, x: -50, y: 40 },
visible: { opacity: 1, x: 0, y: 0 }

    }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="flex flex-col items-center text-center"
  >
      <div className="w-full rounded-xl overflow-hidden shadow-md mb-4">
        <Image
          src={Blunder}
          alt="Improve memory and cognition"
          width={400}
          height={300}
          className="w-full h-auto object-cover"
        />
      </div>
      <h4 className="text-xl font-semibold mb-2">Reduce One-Move Blunders</h4>
      <p className="text-muted-foreground">No more playing like Stockfish for 20+ moves and blundering your Queen to a Bishop in the corner</p>
    </motion.div>
  </motion.div>
  </section>










      {/* Footer */}
      <footer className="border-t text-center py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} VisionChess. All rights reserved.
      </footer>
    </div>
  );
}

"use client";

import { motion, useScroll, useTransform, easeOut } from "framer-motion";
import { useRef } from "react";
import {
  UserPlus,
  Store,
  Package,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface OperationStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const operations: OperationStep[] = [
  {
    icon: <UserPlus size={24} />,
    title: "Create Account",
    description: "Sign up and verify your identity",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Store size={24} />,
    title: "Setup Vendor Store",
    description: "Create your vendor account",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <Package size={24} />,
    title: "List Products",
    description: "Add products to your store",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Start Selling",
    description: "Connect with buyers and close deals",
    color: "from-green-500 to-green-600",
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: "Get Verified",
    description: "Build trust and grow your business",
    color: "from-emerald-500 to-emerald-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0 },
  },
};

const arrowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

const browserFrameVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: easeOut },
  },
};

export default function BrowserMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen -mt-32 md:mt-24 flex items-center justify-center px-2 sm:px-4"
    >
      {/* Browser frame */}
      <motion.div
        variants={browserFrameVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-neutral-800"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between bg-neutral-100 px-3 sm:px-4 py-2">
          {/* Dots */}
          <div className="flex gap-1.5 sm:gap-2">
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400" />
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400" />
          </div>

          {/* URL bar */}
          <div className="px-3 sm:px-6 py-1 text-xs sm:text-sm rounded-full bg-neutral-200 text-neutral-600">
            www.siiqo.com
          </div>

          {/* Spacer */}
          <div className="w-6 sm:w-10" />
        </div>

        {/* Content area */}
        <div className="relative min-h-[400px] sm:h-[460px] bg-gradient-to-br from-[#f0f1ff] via-white to-[#e6fbff] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
          {/* Decorative glow */}
          <motion.div
            style={{ y: bgY }}
            className="absolute -top-24 -right-24 w-48 sm:w-72 h-48 sm:h-72 bg-purple-400/20 rounded-full blur-3xl"
          />

          <motion.div
            style={{ y: bgY }}
            className="absolute -bottom-24 -left-24 w-48 sm:w-72 h-48 sm:h-72 bg-blue-400/20 rounded-full blur-3xl"
          />

          <motion.div
            className="relative w-full max-w-5xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Title */}
            <motion.div
              style={{ y: titleY }}
              variants={itemVariants}
              className="text-center mb-6 sm:mb-12"
            >
              <h3 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                How Siiqo Works
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm mt-1 sm:mt-2">
                A simple flow designed for growth
              </p>
            </motion.div>

            {/* Timeline */}
            <motion.div
              style={{ y: cardsY }}
              className="relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10 md:gap-4"
            >
              {/* Timeline line */}
              <div
                className="absolute md:top-1/2 md:left-0 md:right-0 md:h-[2px] md:bg-gradient-to-r md:from-blue-900 md:via-blue-800 md:to-blue-900
                      left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 md:translate-y-[-50%] translate-x-[-50%]"
              />

              {operations.map((operation, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative z-10 flex flex-col items-center text-center w-full sm:w-auto"
                >
                  {/* Connection dot */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white border-4 border-blue-500 shadow-lg mb-3 sm:mb-4"
                  />

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-lg sm:rounded-xl px-3 sm:px-4 py-4 sm:py-5 shadow-xl w-[110px] sm:w-[140px]"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg bg-gradient-to-br ${operation.color} flex items-center justify-center text-white mb-2 sm:mb-3`}
                    >
                      <motion.div style={{ scale: 0.85 }}>
                        {operation.icon}
                      </motion.div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                      {operation.title}
                    </h4>

                    <p className="text-[10px] sm:text-xs text-neutral-600 mt-0.5 sm:mt-1 leading-tight">
                      {operation.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              className="text-center mt-8 sm:mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-xl"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Start Your Journey
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

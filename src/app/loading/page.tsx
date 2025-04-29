'use client';

import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

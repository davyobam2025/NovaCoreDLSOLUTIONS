'use client';

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import NewsletterPopup from "@/components/NewsletterPopup";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroNovaCore from "@/components/HeroNovaCore";
import HeroDL from "@/components/HeroDL";
import ServicesSection from "@/components/ServicesSection";

const NewsSection = dynamic(() => import('@/components/NewsSection'));
const PricingGrid = dynamic(() => import('@/components/PricingGrid'));
const ProjectsShowcase = dynamic(() => import('@/components/ProjectsShowcase'));
const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'));
const Chatbot = dynamic(() => import('@/components/Chatbot'));
const ReservationPopup = dynamic(() => import('@/components/ReservationPopup'));
const VoiceAssistant = dynamic(() => import('@/components/VoiceAssistant'));

export default function HomeClient() {
  return (
    <>
      <Navbar />
      <NewsletterPopup />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <HeroNovaCore />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <HeroDL />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <ServicesSection />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <NewsSection />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <PricingGrid />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <ProjectsShowcase />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <ReviewsSection />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <Chatbot />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <ReservationPopup />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <VoiceAssistant />
        </motion.div>
      </motion.div>

      <Footer />
    </>
  );
}

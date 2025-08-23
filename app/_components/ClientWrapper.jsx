'use client';

import { AppProviders } from '@/lib/providers/AppProviders';
import { CartProvider } from "@/lib/contexts/CartContext";
import { NavigationLoadingProvider } from '@/lib/contexts/NavigationLoadingContext';
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";


export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  
  return (

    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
      >
        <AppProviders>
      <NavigationLoadingProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </NavigationLoadingProvider>
    </AppProviders>
      </motion.div>
    </AnimatePresence>
    
  );
}
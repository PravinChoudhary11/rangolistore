// header.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import GolbalApi from "../_utils/GlobalApi";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import Link from 'next/link';

const headerThemes = {
  oceanDepthGradient: {
    name: "Ocean Depth Gradient",
    primary: "#173961",
    accent: "#0f2d4e",
    secondary: "#1e4b87",
    text: "#ffffff",
    highlight: "#64b5f6"
  },
};

function Header({ themeKey = "oceanDepthGradient" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); 

  const colors = headerThemes[themeKey] || headerThemes.oceanDepthGradient;
  const isGradient = themeKey === "oceanDepthGradient";

  // Safely detect mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const getCategoryImageUrl = useCallback((category) => {
    if (!category?.icon?.[0]?.url) return "/placeholder-icon.png";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${category.icon[0].url}`;
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await GolbalApi.getCategory();
        const categoriesWithUrls = response.data.data.map(cat => ({
          ...cat,
          imageUrl: getCategoryImageUrl(cat)
        }));
        setCategories(categoriesWithUrls);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Category fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [getCategoryImageUrl]);

  if (!hasMounted) return null;

  return (
    <header 
      className="relative h-[80px] md:h-[100px] shadow-lg flex items-center justify-between px-4 md:px-6"
      style={{
        background: isGradient 
          ? `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
          : colors.primary,
        boxShadow: `0 4px 12px ${colors.secondary}80`
      }}
    >
      {/* Left: Logo */}
      <Link href="/" className="flex-shrink-0 z-10">
        <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] cursor-pointer">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
      </Link>

      {/* Center: Brand name (mobile only) */}
      <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 z-10">
        <h1 
          className="text-xl font-bold"
          style={{ color: colors.text }}
        >
          Rangoli Store
        </h1>
      </div>

      {/* Right: Navbar (conditionally rendered) */}
      {isMobile ? (
        <MobileNavbar 
          categories={categories}
          isLoading={isLoading}
          error={error}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          colors={colors}
        />
      ) : (
        <div className="flex-1 flex justify-end md:justify-center">
          <DesktopNavbar 
            categories={categories}
            isLoading={isLoading}
            error={error}
            colors={colors}
          />
        </div>
      )}
    </header>
  );
}

export default Header;
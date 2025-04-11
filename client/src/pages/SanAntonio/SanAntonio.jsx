"use client";

import React, { useState, useRef, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useProperties from "../../components/hooks/useProperties.js";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import SearchArea from "@/components/SearchArea/SearchArea";
import { Button } from "@/components/ui/button";

export default function SanAntonioProperty() {
  const { data, isError, isLoading } = useProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);

  // State to track whether there is scrollable content on the left/right
  const [scrollState, setScrollState] = useState({
    showLeft: false,
    showRight: false,
  });

  // Update search query from URL parameters on mount
  // (This code remains unchanged.)

  // Optional: Handle Search submission (if needed)
  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Function to update the scrollState based on the container's measurements
  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setScrollState({
        showLeft: scrollLeft > 0,
        showRight: scrollLeft + clientWidth < scrollWidth,
      });
    }
  };

  // Check scroll state on mount and on window resize
  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => {
      window.removeEventListener("resize", updateScrollState);
    };
  }, [data]);

  // Error State
  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-red-600 text-xl font-semibold">
          Error fetching properties.
        </h2>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

  // Filter properties to only include those in "SanAntonio"
  const SanAntonioProperties = data.filter(
    (property) => property.area === "San Antonio"
  );

  // Further filter using the search query across multiple fields
  const filteredSanAntonioProperties = SanAntonioProperties.filter(
    (property) => {
      const query = searchQuery.toLowerCase();
      return (
        property.title?.toLowerCase().includes(query) ||
        property.streetAddress?.toLowerCase().includes(query) ||
        property.state?.toLowerCase().includes(query) ||
        property.zip?.toLowerCase().includes(query) ||
        property.area?.toLowerCase().includes(query) ||
        property.apnOrPin?.toLowerCase().includes(query) ||
        property.ltag?.toLowerCase().includes(query) ||
        property.rtag?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query) ||
        property.county?.toLowerCase().includes(query)
      );
    }
  );

  // Determine which properties to display: if there are any filtered, use them; otherwise, fall back to all properties.
  const displayProperties =
    filteredSanAntonioProperties.length > 0
      ? filteredSanAntonioProperties
      : data;

  // Set header text based on whether we're showing just "SanAntonio" or all properties.
  const headerText =
    filteredSanAntonioProperties.length > 0
      ? "Properties in San Antonio"
      : "All Properties";

  // Handlers for horizontal scrolling
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
      // Update state after a short delay for smooth scrolling
      setTimeout(updateScrollState, 300);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
      setTimeout(updateScrollState, 300);
    }
  };

  return (
    <div className="bg-[#FDF8F2] min-h-screen py-12 text-[#4b5b4d]">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Title, Subtitle & Search */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{headerText}</h1>
          <p className="text-lg mb-6">
            {filteredSanAntonioProperties.length > 0 ? (
              "Browse through properties available in the San Antonio."
            ) : (
              <>
                Sorry! We sold through everything in San Antonio! <br />
                Maybe you would be interested in these properties:
              </>
            )}
          </p>
          <SearchArea
            query={searchQuery}
            setQuery={setSearchQuery}
            placeholder="Search by title, address, state, zip, area, APN, tags, city, or county"
          />
        </div>

        {displayProperties.length > 0 ? (
          // Display properties in a horizontal slider (on desktop; vertical on mobile)
          <div className="relative">
            {/* Left Scroll Button: Only appears if there's content to scroll left */}
            {scrollState.showLeft && (
              <button
                onClick={handleScrollLeft}
                className="hidden sm:block sm:absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              className="px-2 py-4 overflow-y-auto overflow-x-hidden sm:overflow-x-auto sm:overflow-y-hidden no-scrollbar"
              ref={scrollRef}
              onScroll={updateScrollState}
            >
              <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-20">
                {displayProperties.map((card) => (
                  <div
                    key={card.id}
                    className="w-72 flex-shrink-0 transition hover:scale-105"
                  >
                    <PropertyCard card={card} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Scroll Button: Only appears if there's content to scroll right */}
            {scrollState.showRight && (
              <button
                onClick={handleScrollRight}
                className="hidden sm:block sm:absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-4">No properties found.</p>
        )}

        {/* "All Properties" Button */}
        <div className="mt-10 text-center">
          <Button
            onClick={() => (window.location.href = "/properties")}
            className="bg-[#324c48] hover:bg-[#3f4f24] text-white px-6 py-3 text-lg font-semibold rounded-lg shadow transition transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#3f4f24] focus:ring-offset-2"
            >
            All Properties
          </Button>
        </div>
      </div>
    </div>
  );
}

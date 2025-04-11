"use client";

import React, { useContext } from "react";
import { Card } from "@/components/ui/card";
import { UserContext } from "../../utils/UserContext";

// Function to assign status colors
function getStatusClasses(status) {
  switch (status) {
    case "Available":
      return { circle: "bg-green-500", text: "text-green-500" };
    case "Pending":
      return { circle: "bg-yellow-500", text: "text-yellow-500" };
    case "Not Available":
    case "Sold":
      return { circle: "bg-red-500", text: "text-red-500" };
    case "Testing":
      return { circle: "bg-blue-500", text: "text-blue-500" };
    default:
      return { circle: "bg-gray-400", text: "text-gray-400" };
  }
}

export default function PropertyHeaderRight({ propertyData }) {
  const { currentUser } = useContext(UserContext);
  const {
    status,
    disPrice,
    askingPrice,
    acre,
    streetAddress,
    city,
    state,
    zip,
  } = propertyData || {};

  const { circle, text } = getStatusClasses(status);

  // If user is logged in and discount price is available, we display the discount
  const mainPrice = currentUser && disPrice ? disPrice : askingPrice;

  return (
    <Card className="border-0 bg-transparent shadow-none p-0">
      {/* Top Row: Status */}
      <div className="flex items-center gap-2 mb-6">
        <span className={`w-3 h-3 rounded-full animate-pulse-slow ${circle}`} />
        <span className={`text-lg capitalize ${text}`}>
          {status || "Unknown Status"}
        </span>
      </div>

      {/* Price Row (All prices aligned in one line) */}

      <div className="flex items-center text-3xl font-bold text-gray-900 whitespace-nowrap mb-4">
        {/* Main Price */}
        {mainPrice ? `$${mainPrice.toLocaleString()}` : "$0"}

        {/* Blurred Discount Price (Only if user is NOT logged in) */}
        {!currentUser && disPrice && (
          <span className="relative ml-6 inline-flex items-center">
            {/* Overlay Button (Triggers Login) */}
            <button
              className="
          absolute inset-0 z-10 bg-transparent text-sm font-semibold
          hover:bg-gray-200 transition-colors px-2 py-1 rounded-md
          flex items-center justify-center w-full h-full whitespace-nowrap
        "
              onClick={() => {
                // Handle login or redirect
              }}
            >
              Login For Discount
            </button>

            {/* Blurred Discount Price (Behind the button) */}
            <span className="filter blur-[2px] text-3xl text-gray-400 font-thin ml-2">
              ${disPrice.toLocaleString()}
            </span>
          </span>
        )}

        {/* Crossed Out Original Price (Only for logged-in users with a discount) */}
        {currentUser && disPrice && (
          <span className="text-gray-500 line-through text-xl ml-3">
            ${askingPrice?.toLocaleString()}
          </span>
        )}
      </div>

      {/* Acre Row */}
      {acre && (
        <div
          className="text-2xl font-nnormal text-gray-500 mb-4"
        >
          {acre} Acre Lot
        </div>
      )}

      {/* Address Row */}
      {(streetAddress || city || state || zip) && (
        <div className="text-lg text-gray-700 mt-1">
          {streetAddress}, {city}, {state} {zip}
        </div>
      )}
    </Card>
  );
}

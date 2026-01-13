"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/AppIcon";
import { Facebook, MessageCircle, Link2, Copy, X } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | number;
  productName?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName = "My Product",
}) => {
  const [copied, setCopied] = useState(false);

  // Construct the product URL
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://siiqo.com";
  const productUrl = `${baseUrl}/products/${productId}`;

  const shareOptions = [
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          productUrl
        )}&quote=${encodeURIComponent(`Check out: ${productName} on Siiqo!`)}`;
        window.open(url, "_blank", "width=600,height=400");
        toast.success("Opening Facebook...");
      },
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600 hover:bg-green-700",
      action: () => {
        const text = `Check out "${productName}" on Siiqo! ${productUrl}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
        toast.success("Opening WhatsApp...");
      },
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: () => (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
        </svg>
      ),
      color: "bg-blue-400 hover:bg-blue-500",
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `Check out "${productName}" on Siiqo! ${productUrl}`
        )}`;
        window.open(url, "_blank", "width=600,height=400");
        toast.success("Opening Twitter...");
      },
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: () => (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ),
      color: "bg-blue-700 hover:bg-blue-800",
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          productUrl
        )}`;
        window.open(url, "_blank", "width=600,height=400");
        toast.success("Opening LinkedIn...");
      },
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: () => (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.5-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.365-1.337.185-.437-.148-1.33-.414-1.98-.742-.796-.34-1.428-.52-1.372-.82.03-.15.457-.464 1.159-.907 2.807-1.93 4.678-3.195 5.619-4.071.987-.88 1.783-1.33 2.191-1.358z" />
        </svg>
      ),
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(
          productUrl
        )}&text=${encodeURIComponent(`Check out "${productName}" on Siiqo!`)}`;
        window.open(url, "_blank");
        toast.success("Opening Telegram...");
      },
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 transition-colors rounded-full hover:bg-gray-100"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
            <Icon name="Share2" size={24} className="text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tell People About Your Brand
          </h2>
          <p className="text-gray-600 text-sm">
            Share "{productName}" with your network
          </p>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {shareOptions.map((option) => {
            const IconComp = option.icon;
            return (
              <button
                key={option.id}
                onClick={option.action}
                className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-lg text-white transition-all duration-200 ${option.color}`}
              >
                <IconComp />
                <span className="text-xs font-semibold">{option.name}</span>
              </button>
            );
          })}
        </div>

        {/* Copy link section */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              readOnly
              value={productUrl}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-colors rounded-lg hover:bg-gray-200"
              title="Copy link"
            >
              <Copy
                size={18}
                className={copied ? "text-green-600" : "text-gray-600"}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            {copied ? "✓ Link copied!" : "Click to copy product link"}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-lg bg-gray-100 text-gray-800 font-semibold transition-colors hover:bg-gray-200"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
};

export default ShareModal;

import React, { useState } from 'react';
import Icon, { type LucideIconName } from '@/components/AppIcon';
import Image from '@/components/ui/alt/AppImageAlt';
import Button from '@/components/ui/new/Button';

// --- TYPES ---

interface Business {
  coverImage: string;
  logo: string;
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  isOpen: boolean;
  nextOpenTime?: string;
  address: string;
  todayHours: string;
  phone: string;
}

interface BusinessHeroProps {
  business: Business | any;
  onContactClick: () => void;
  onDirectionsClick: () => void;
  onShareClick: () => void;
}

// --- COMPONENT ---

const BusinessHero: React.FC<BusinessHeroProps> = ({
  business,
  onContactClick,
  onDirectionsClick,
  onShareClick,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const handleFavoriteToggle = (): void => {
    setIsFavorite(!isFavorite);
  };

  const getStatusColor = (isOpen: boolean): string => {
    return isOpen ? 'text-success' : 'text-error';
  };

  const getStatusText = (isOpen: boolean, nextOpenTime?: string): string => {
    if (isOpen) return 'Open now';
    return nextOpenTime ? `Closed • Opens ${nextOpenTime}` : 'Closed';
  };

  return (
    <div className="relative bg-white border-b border-border">
      {/* ✅ FACEBOOK-STYLE COVER */}
      <div className="relative h-52 sm:h-64 lg:h-80 overflow-hidden">
        <Image
          src={business.coverImage}
          alt={`${business.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex space-x-2 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            className="bg-white/90 hover:bg-white"
          >
            <Icon
              name={'Heart' as LucideIconName}
              size={20}
              className={isFavorite ? 'text-error fill-current' : 'text-text-secondary'}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onShareClick}
            className="bg-white/90 hover:bg-white"
          >
            <Icon
              name={'Share2' as LucideIconName}
              size={20}
              className="text-text-secondary"
            />
          </Button>
        </div>
      </div>

      {/* ✅ PROFILE OVERLAY + INFO */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Image */}
        <div className="absolute -top-12 sm:-top-14 lg:-top-16 left-4 sm:left-6 lg:left-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
            <Image
              src={business.logo}
              alt={`${business.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Main Info */}
        <div className="pt-16 sm:pt-20 lg:pt-24 pb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          {/* Left Info */}
          <div className="min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
              {business.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name={'Star' as LucideIconName}
                    size={16}
                    className={`${
                      i < Math.floor(business.rating)
                        ? 'text-warning fill-current'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>

              <span className="text-sm font-medium">{business.rating}</span>
              <span className="text-sm text-text-secondary">
                ({business.reviewCount} reviews)
              </span>
            </div>

            {/* Category */}
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={'Tag' as LucideIconName} size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">
                {business.category}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  business.isOpen ? 'bg-success' : 'bg-error'
                }`}
              />
              <span className={`text-sm font-medium ${getStatusColor(business.isOpen)}`}>
                {getStatusText(business.isOpen, business.nextOpenTime)}
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={onContactClick}
              iconName={'Phone' as LucideIconName}
              iconPosition="left"
            >
              Call Now
            </Button>

            <Button
              variant="outline"
              onClick={onDirectionsClick}
              iconName={'Navigation' as LucideIconName}
              iconPosition="left"
            >
              Directions
            </Button>
          </div>
        </div>

        {/* ✅ INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6">
          <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
            <Icon name={'MapPin' as LucideIconName} size={20} className="text-primary" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-text-secondary">{business.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
            <Icon name={'Clock' as LucideIconName} size={20} className="text-primary" />
            <div>
              <p className="text-sm font-medium">Hours</p>
              <p className="text-xs text-text-secondary">{business.todayHours}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
            <Icon name={'Phone' as LucideIconName} size={20} className="text-primary" />
            <div>
              <p className="text-sm font-medium">Contact</p>
              <p className="text-xs text-text-secondary">{business.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHero;

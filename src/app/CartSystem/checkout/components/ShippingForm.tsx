"use client";

import { useState } from "react";
import { User, Mail, Phone, Home, Building } from "lucide-react";
import Button from "@/components/Button";

interface ShippingFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onBack?: () => void; // optional back handler
}

export default function ShippingForm({
  initialData,
  onSubmit,
  onBack,
}: ShippingFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-4 border border-gray-100 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="logicalsam@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="+234 800 000 0000"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Street Address *
          </label>
          <div className="relative">
            <Home className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="123 Main Street"
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-xs text-red-500">{errors.address}</p>
          )}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              City *
            </label>
            <div className="relative">
              <Building className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Lagos"
              />
            </div>
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full py-2 px-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Lagos"
            />
            {errors.state && (
              <p className="mt-1 text-xs text-red-500">{errors.state}</p>
            )}
          </div>
        </div>

        {/* ZIP and Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              ZIP Code *
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={`w-full py-2 px-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.zipCode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="100001"
            />
            {errors.zipCode && (
              <p className="mt-1 text-xs text-red-500">{errors.zipCode}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Kenya">Kenya</option>
              <option value="South Africa">South Africa</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-between gap-3 pt-10 border-t">
          {onBack && (
            <Button
              variant="outline"
              type="button"
              onClick={onBack}
              className="w-full px-6 py-2 text-sm"
            >
              Back to Cart
            </Button>
          )}
          
          <Button
            variant="orange"
            type="submit"
            className="w-full px-6 py-2 text-sm"
          >
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
}

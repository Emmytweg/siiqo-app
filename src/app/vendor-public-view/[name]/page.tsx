
"use client";

import React, { useEffect, useState } from "react";
import Icon from "@/components/ui/AppIcon";
import Image from "@/components/ui/AppImage";
import { storefrontService } from "@/services/storefrontService";
import { toast } from "sonner";
import { switchMode } from "@/services/api";
import MyListings from "@/app/user-profile/components/MyListings";
import ContactVendorModal from "./ContactVendorModal";

interface ProfileData {
	name: string;
	ownerName: string;
	email: string;
	phone: string | null;
	avatar: string;
	cover: string;
	primaryColor: string;
	location: string;
	bio: string;
	isPublished: boolean;
	workingHours: Record<string, { start?: string; end?: string }>;
	socialLinks: Record<string, string>;
}

const VendorPublicProfile = () => {
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

	const fetchVendorSettings = async () => {
		try {
			setLoading(true);
			const response = await storefrontService.getStorefrontData();

			if (response.status === "success") {
				const { personal_info, store_settings } = response.data;

				const mappedData: ProfileData = {
					name: store_settings.business_name,
					ownerName: personal_info.fullname,
					email: personal_info.email,
					phone: personal_info.phone,
					avatar:
						store_settings.logo_url ||
						"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
					cover:
						store_settings.banner_url ||
						"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
					primaryColor: store_settings.template_options?.primary_color || "#000000",
					location: store_settings.address,
					bio: store_settings.description,
					isPublished: store_settings.is_published,
					workingHours: store_settings.working_hours || {},
					socialLinks: store_settings.social_links || {},
				};

				setProfileData(mappedData);
			}
		} catch (err) {
			toast.error("Failed to load store details.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchVendorSettings();
	}, []);

	useEffect(() => {
		switchMode("buyer");
	}, []);

	if (loading || !profileData)
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
				<p className="mt-4 text-sm text-text-secondary">Loading Profile...</p>
			</div>
		);

	return (
		<div className="min-h-screen bg-background pb-12">
			<div className="relative">
				<div
					className="h-44 md:h-64 w-full bg-center bg-cover relative"
					style={{ backgroundImage: `url(${profileData.cover})` }}
				/>
				<div className="absolute -bottom-12 left-6 md:left-12">
					<div className="w-24 h-24 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl">
						<Image src={profileData.avatar} alt="Store Logo" fill className="object-cover" />
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
				<div className="flex flex-col md:flex-row justify-between items-start gap-6">
					<div className="space-y-2 w-full max-w-lg">
						<h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
							{profileData.name}
							<Icon name="ShieldCheck" size={24} className="text-blue-500" />
						</h1>
						<p className="text-text-secondary text-sm font-medium">Owned by {profileData.ownerName}</p>

						<div className="flex items-center gap-4 text-xs text-text-secondary mt-2">
							<span className="flex items-center gap-1">
								<Icon name="MapPin" size={14} />
								{profileData.location}
							</span>
						</div>
					</div>

					{/* <div className="flex gap-3 items-center">
						<span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ borderColor: profileData.primaryColor }}>
							{profileData.isPublished ? "Live Store" : "Offline"}
						</span>
					</div> */}				<div className="flex gap-3 items-center flex-wrap">
					
					<button
						onClick={() => setIsContactModalOpen(true)}
						className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs font-bold transition"
					>
						Contact Vendor
					</button>
				</div>				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
					<aside className="lg:col-span-4 space-y-6">
						<div className="p-6 border rounded-2xl bg-surface shadow-sm">
							<h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">About Store</h3>
							<p className="text-sm leading-relaxed">{profileData.bio}</p>
						</div>

						<div className="p-6 border rounded-2xl bg-surface shadow-sm">
							<h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Contact Info</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3 text-sm">
									<Icon name="Mail" size={16} />
									{profileData.email}
								</div>
								{profileData.phone && (
									<div className="flex items-center gap-3 text-sm">
										<Icon name="Phone" size={16} />
										{profileData.phone}
									</div>
								)}
							</div>
						</div>

						{Object.keys(profileData.workingHours).length > 0 && (
							<div className="p-6 border rounded-2xl bg-surface shadow-sm">
								<h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Working Hours</h3>
								<div className="space-y-2">
									{Object.entries(profileData.workingHours).map(([day, hours]) => (
										<div key={day} className="flex justify-between text-sm">
											<span className="font-medium">{day}</span>
											<span className="text-text-secondary">
												{hours.start && hours.end
													? `${hours.start} - ${hours.end}`
													: hours.start
														? `From ${hours.start}`
														: "Closed"}
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{Object.keys(profileData.socialLinks).length > 0 && (
							<div className="p-6 border rounded-2xl bg-surface shadow-sm">
								<h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Follow Us</h3>
								<div className="flex gap-3 flex-wrap">
									{Object.entries(profileData.socialLinks).map(([platform, url]) => {
										const getSocialIcon = (platform: string): React.ReactNode => {
											const platform_lower = platform.toLowerCase();
											switch (platform_lower) {
												case "facebook":
													return <Icon name="Facebook" size={18} />;
												case "twitter":
													return <Icon name="Twitter" size={18} />;
												case "instagram":
													return <Icon name="Instagram" size={18} />;
												case "linkedin":
													return <Icon name="Linkedin" size={18} />;
												case "whatsapp":
													return <Icon name="MessageCircle" size={18} />;
												case "tiktok":
													return <Icon name="Music" size={18} />;
												case "youtube":
													return <Icon name="Youtube" size={18} />;
												default:
													return <Icon name="Link" size={18} />;
											}
										};
										return (
											<a
												key={platform}
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												className="p-2 border rounded-lg hover:bg-gray-50 transition"
												title={`Visit ${platform}`}
											>
												{getSocialIcon(platform)}
											</a>
										);
									})}
								</div>
							</div>
						)}
					</aside>

					<main className="lg:col-span-8">
						<div className="border rounded-2xl bg-surface shadow-sm overflow-hidden">
							<div className="p-6 mb-4 border-b bg-gray-50/50">
								<h3 className="text-base font-bold">Products</h3>
								<p className="text-xs text-text-secondary">Browse items this seller offers.</p>
							</div>
							<div className="p-6 mb-20">
								<MyListings />
							</div>
						</div>
					</main>
				</div>
			</div>

			<ContactVendorModal
				isOpen={isContactModalOpen}
				onClose={() => setIsContactModalOpen(false)}
				vendorName={profileData.name}
				phone={profileData.phone}
				socialLinks={profileData.socialLinks}
				workingHours={profileData.workingHours}
			/>
		</div>
	);
};

export default VendorPublicProfile;
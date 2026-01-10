import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/alt/ButtonAlt';
import AppImage from '@/components/ui/alt/AppImageAlt';
import { vendorService } from '@/services/vendorService';

interface ProductItem {
	id: number;
	name: string;
	category: string;
	condition: string;
	final_price: number;
	original_price: number;
	quantity: number;
	rating: number;
	status: string;
	images: string[];
	discount_percent: number;
	crypto_price: number | null;
}

interface CatalogGroup {
	catalog_id: number | null;
	catalog_name: string;
	products: ProductItem[];
}

interface ApiResponse {
	data: CatalogGroup[];
	status: string;
}

interface ProductOverviewProps {
	products?: ProductItem[];
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ products: propProducts }) => {
	const router = useRouter();
	const [products, setProducts] = useState<ProductItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchProducts = async () => {
			if (propProducts) {
				setProducts(propProducts);
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				const response: ApiResponse = await vendorService.getMyProducts() as any;
				
				// Flatten all products from all catalogs and get the most recent ones
				const allProducts: ProductItem[] = [];
				if (response.data && Array.isArray(response.data)) {
					response.data.forEach((catalog) => {
						if (catalog.products && Array.isArray(catalog.products)) {
							allProducts.push(...catalog.products);
						}
					});
				}

				// Sort by ID descending (most recent first) and take top 5
				const recentProducts = allProducts
					.sort((a, b) => b.id - a.id)
					.slice(0, 5);

				setProducts(recentProducts);
			} catch (error) {
				console.error("Error fetching products:", error);
				setProducts([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, [propProducts]);

	if (isLoading) {
		return (
			<div className="bg-card rounded-lg border border-border p-6">
				<h2 className="font-heading font-semibold text-lg text-text-primary mb-6">
					My Products
				</h2>
				<div className="text-center py-8">
					<div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
					<p className="text-text-muted">Loading products...</p>
				</div>
			</div>
		);
	}

	if (!products || products.length === 0) {
		return (
			<div className="bg-card rounded-lg border border-border p-6">
				<h2 className="font-heading font-semibold text-lg text-text-primary mb-6">
					My Products
				</h2>
				<div className="text-center py-8">
					<Icon name="Package" size={48} className="text-text-muted mx-auto mb-4" />
					<p className="text-text-muted">No products yet</p>
					<p className="text-sm text-text-muted mt-1 mb-4">
						Add your first product to get started
					</p>
					                        																						<Button
					                        																							variant="primary"
					                        																							size="sm"
					                        																							onClick={() => router.push('/vendor/products')}
					                        																						>
					                        																							<span>
					                        																								<Icon name="Plus" size={16} className="mr-2" />
					                        																								Add Product
					                        																							</span>
					                        																						</Button>				</div>
			</div>
		);
	}

	return (
		<div className="bg-card rounded-lg border border-border p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="font-heading font-semibold text-lg text-text-primary">
					My Products
				</h2>
				<Button
					variant="outline"
					size="sm"
					onClick={() => router.push('/vendor/products')}
				>
					View All
				</Button>
			</div>

			<div className="space-y-4">
				{products.map((product, index) => (
					<div
						key={product.id}
						className="flex items-center space-x-4 p-3 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
						onClick={() => router.push(`/products/${product.id}`)}
					>
						<div className="relative">
							<AppImage
								src={product.images?.[0] || '/images/placeholder.png'}
								alt={product.name}
								className="w-12 h-12 rounded-lg object-cover"
							/>
							<div className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
								{index + 1}
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<p className="font-medium text-text-primary truncate">
								{product.name}
							</p>
							<div className="flex items-center space-x-3 mt-1">
								<span className="text-sm text-text-muted">
									{product.quantity} in stock
								</span>
								<span className="text-sm font-medium text-success">
									₦{product.final_price.toLocaleString()}
								</span>
							</div>
						</div>

						<div className="text-right">
							<div className="flex items-center space-x-1">
								<Icon name="Star" size={14} className="text-warning fill-current" />
								<span className="text-sm font-medium text-warning">
									{product.rating.toFixed(1)}
								</span>
							</div>
							<span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
								product.status === 'active' 
									? 'bg-success/10 text-success' 
									: 'bg-text-muted/10 text-text-muted'
							}`}>
								{product.status}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Add Product Button */}
			<div className="mt-6 pt-4 flex items-center justify-center border-t border-border">
				<Button
					variant="outline"
					                    className="w-full"
					                    onClick={() => router.push('/vendor/products')}				>
					<Icon name="Plus" size={16} className="mr-2" />
				<p>Add New Product</p>	
				</Button>
			</div>
		</div>
	);
};

export default ProductOverview;
import React, { useState, useMemo } from 'react';
import Icon from '@/components/AppIcon';

interface Category {
	id: number;
	name: string;
}

interface CategoryWithCount extends Category {
	count: number;
}

interface CategoryTreeProps {
	onCategorySelect: (name: string | null) => void;
	selectedCategory: string | null;
	categories: Category[];
	products: any[];
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ 
	onCategorySelect, 
	selectedCategory, 
	categories,
	products 
}) => {
	// Calculate category counts based on products
	const categoriesWithCounts: CategoryWithCount[] = useMemo(() => {
		return categories.map(cat => {
			const count = products.filter(p => 
				p.category?.toLowerCase() === cat.name.toLowerCase()
			).length;
			return {
				...cat,
				count
			};
		});
	}, [categories, products]);

	const totalProducts = products.length;

	const handleCategoryClick = (categoryName: string | null) => {
		onCategorySelect(categoryName);
	};

	if (categories.length === 0) {
		return (
			<div className="bg-card border border-border rounded-lg p-4 h-fit">
				<h3 className="font-semibold text-foreground mb-4">Categories</h3>
				<div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
					<Icon name="Loader2" size={20} className="animate-spin mr-2" />
					Loading categories...
				</div>
			</div>
		);
	}

	return (
		<div className="bg-card border border-border rounded-lg p-4 h-fit">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-semibold text-foreground">Categories</h3>
				<button
					onClick={() => onCategorySelect(null)}
					className="text-xs text-primary hover:text-primary/80 transition-smooth"
				>
					Clear Filter
				</button>
			</div>

			<div className="space-y-1">
				<button
					onClick={() => handleCategoryClick(null)}
					className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-smooth ${selectedCategory === null
							? 'bg-primary text-primary-foreground'
							: 'text-muted-foreground hover:text-foreground hover:bg-muted'
						}`}
				>
					<span>All Products</span>
					<span className="text-xs">{totalProducts}</span>
				</button>

				{categoriesWithCounts.map((category) => (
					<button
						key={category.id}
						onClick={() => handleCategoryClick(category.name)}
						className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-smooth ${selectedCategory?.toLowerCase() === category.name.toLowerCase()
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:text-foreground hover:bg-muted'
							}`}
					>
						<span>{category.name}</span>
						<span className="text-xs">{category.count}</span>
					</button>
				))}
			</div>

		</div>
	);
};

export default CategoryTree;

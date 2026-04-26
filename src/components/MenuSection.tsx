import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronDown, Filter, Info, Star, MessageSquare } from 'lucide-react';
import { MenuItem, Review, Ingredient } from '../types';

const CollapsibleIngredients = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showMore = ingredients.length > 4;
  const items = isExpanded ? ingredients : ingredients.slice(0, 4);

  return (
    <div className="space-y-3">
      {items.map((ing, idx) => (
        <div key={idx} className="flex justify-between items-center gap-4 border-b border-white/5 pb-2 last:border-0 last:pb-0">
          <span className="text-[10px] text-white font-medium">{ing.name}</span>
          <span className="text-[9px] text-stone-500 italic">
            {ing.origin || 'Origin unavailable'}
          </span>
        </div>
      ))}
      {showMore && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-full py-1.5 text-[8px] uppercase tracking-widest text-accent font-bold hover:text-white transition-colors border-t border-white/5 mt-2"
        >
          {isExpanded ? 'Show Less' : `+ ${ingredients.length - 4} more ingredients`}
        </button>
      )}
    </div>
  );
};

interface MenuSectionProps {
  items: MenuItem[];
  onAdd: (item: MenuItem, sourceRect: DOMRect) => void;
}

type SortOption = 'none' | 'price-low' | 'price-high';

const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isInView && (
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full object-cover"
        />
      )}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900 flex items-center justify-center"
          >
            <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NutritionMetric = ({ label, value, max, unit, colorClass }: { label: string, value: string | number, max: number, unit: string, colorClass: string }) => {
  const numericValue = typeof value === 'string' ? parseInt(value) : value;
  const percentage = Math.min((numericValue / max) * 100, 100);

  return (
    <div className="space-y-1.5 flex-1 relative group/metric">
      <div className="flex justify-between items-end px-0.5">
        <p className="text-[7px] uppercase tracking-tighter text-stone-500 font-bold">{label}</p>
        <p className="text-[10px] text-white font-serif">{value}{unit}</p>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`h-full ${colorClass}`}
        />
      </div>
      <div className="absolute top-0 left-0 -translate-y-full opacity-0 group-hover/metric:opacity-100 transition-opacity bg-stone-900 border border-white/10 p-2 rounded-lg pointer-events-none z-50 mb-1 shadow-2xl">
        <p className="text-[7px] text-stone-400 whitespace-nowrap">
          Approx. <span className="text-accent font-bold">{Math.round(percentage)}%</span> of recommended daily intake
        </p>
      </div>
    </div>
  );
};

const ReviewSection = ({ itemId, reviews, onAddReview }: { itemId: string, reviews: Review[], onAddReview: (itemId: string, review: Omit<Review, 'id' | 'date'>) => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !userName) return;
    onAddReview(itemId, { rating, comment, userName });
    setComment('');
    setUserName('');
    setIsAdding(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="pt-4 border-t border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={12} className="text-stone-500" />
          <p className="text-[8px] uppercase tracking-widest text-stone-500 font-bold">Reviews ({reviews.length})</p>
          {averageRating && (
            <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full">
              <Star size={8} className="fill-accent text-accent" />
              <span className="text-[8px] text-accent font-bold">{averageRating}</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-[8px] uppercase tracking-widest text-accent font-bold hover:text-white transition-colors"
        >
          {isAdding ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <p className="text-[8px] uppercase tracking-widest text-stone-500 font-bold">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      size={14} 
                      className={`${star <= rating ? 'fill-accent text-accent' : 'text-stone-700'} hover:scale-110 transition-transform`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            <input 
              type="text" 
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-stone-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent/40 transition-colors"
              required
            />
            <textarea 
              placeholder="Your thoughts on this dish..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-stone-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent/40 transition-colors h-20 resize-none"
              required
            />
            <button 
              type="submit"
              className="w-full p-2 bg-accent text-brand-primary rounded-lg text-[9px] font-bold uppercase tracking-widest"
            >
              Post Review
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {reviews.slice(0, 2).map((review) => (
          <div key={review.id} className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-[10px] text-stone-200 font-medium">{review.userName}</p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={8} 
                    className={i < review.rating ? 'fill-accent text-accent' : 'text-stone-700'} 
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-400 italic line-clamp-2">"{review.comment}"</p>
          </div>
        ))}
        {reviews.length > 2 && (
          <p className="text-[7px] text-stone-600 text-center uppercase tracking-widest">
            + {reviews.length - 2} more reviews
          </p>
        )}
        {reviews.length === 0 && !isAdding && (
          <p className="text-[9px] text-stone-600 text-center italic">No reviews yet. Be the first to share your experience.</p>
        )}
      </div>
    </div>
  );
};

export const MenuSection: React.FC<MenuSectionProps> = ({ items, onAdd }) => {
  const [activeCategory, setActiveCategory] = useState<MenuItem['category'] | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [localItems, setLocalItems] = useState<MenuItem[]>(items);
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  });

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleAddReview = (itemId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    setLocalItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newReview: Review = {
          ...reviewData,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString()
        };
        return {
          ...item,
          reviews: [...(item.reviews || []), newReview]
        };
      }
      return item;
    }));
  };

  const categories: (MenuItem['category'] | 'All')[] = ['All', 'Appetizers', 'Mains', 'Desserts', 'Drinks'];

  const filteredAndSortedItems = useMemo(() => {
    let result = [...localItems];

    if (activeCategory !== 'All') {
      result = result.filter(item => item.category === activeCategory);
    }

    if (dietaryFilters.vegetarian) {
      result = result.filter(item => item.isVegetarian);
    }
    if (dietaryFilters.vegan) {
      result = result.filter(item => item.isVegan);
    }
    if (dietaryFilters.glutenFree) {
      result = result.filter(item => item.isGlutenFree);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [items, activeCategory, sortBy, dietaryFilters, localItems]);

  return (
    <section id="menu" className="py-32 px-6 max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-serif"
        >
          Les Collections
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          className="text-stone-400 max-w-md mx-auto text-sm"
        >
          Curated seasonal selections for the discerning palate.
        </motion.p>
        <div className="w-12 h-px bg-accent/50" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                activeCategory === cat 
                  ? 'bg-accent text-brand-primary shadow-lg shadow-accent/20' 
                  : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setDietaryFilters(prev => ({ ...prev, vegetarian: !prev.vegetarian }))}
            className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${
              dietaryFilters.vegetarian 
                ? 'bg-green-500/20 border-green-500/40 text-green-300' 
                : 'bg-white/5 border-white/5 text-stone-500 hover:text-stone-300'
            }`}
          >
            Vegetarian
          </button>
          <button
            onClick={() => setDietaryFilters(prev => ({ ...prev, vegan: !prev.vegan }))}
            className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${
              dietaryFilters.vegan 
                ? 'bg-green-600/20 border-green-600/40 text-green-400' 
                : 'bg-white/5 border-white/5 text-stone-500 hover:text-stone-300'
            }`}
          >
            Vegan
          </button>
          <button
            onClick={() => setDietaryFilters(prev => ({ ...prev, glutenFree: !prev.glutenFree }))}
            className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${
              dietaryFilters.glutenFree 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                : 'bg-white/5 border-white/5 text-stone-500 hover:text-stone-300'
            }`}
          >
            Gluten-Free
          </button>
        </div>

        <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
          <Filter size={12} className="text-accent" />
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300 outline-none cursor-pointer pr-6 appearance-none"
            >
              <option value="none" className="bg-stone-900">Sort by: Default</option>
              <option value="price-low" className="bg-stone-900">Price: Low to High</option>
              <option value="price-high" className="bg-stone-900">Price: High to Low</option>
            </select>
            <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedItems.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group frosted-glass p-6 rounded-[32px] flex flex-col sm:flex-row gap-6 hover:bg-white/10 transition-all duration-500 cursor-pointer"
            >
              <div className="relative w-full sm:w-40 h-40 flex-shrink-0">
                <LazyImage
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full rounded-2xl grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 border border-white/5"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(item, (e.currentTarget as HTMLElement).getBoundingClientRect());
                  }}
                  className="absolute -bottom-2 -right-2 sm:bottom-2 sm:right-2 w-10 h-10 bg-accent text-brand-primary flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 shadow-xl"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg md:text-xl font-medium tracking-tight group-hover:text-amber-200 transition-colors uppercase">{item.name}</h4>
                  <span className="font-serif text-accent text-base md:text-lg">${item.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{item.category}</p>
                  {item.reviews && item.reviews.length > 0 && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/5 border border-accent/20 rounded-full">
                      <Star size={10} className="fill-accent text-accent" />
                      <span className="text-[10px] text-accent font-bold">
                        {(item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs md:text-sm text-stone-400 font-light leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.allergens && item.allergens.length > 0 ? (
                    item.allergens.map(allergen => (
                      <span key={allergen} className="text-[7px] uppercase tracking-widest bg-red-400/5 text-red-300/60 px-1.5 py-0.5 rounded border border-red-400/10">
                        {allergen}
                      </span>
                    ))
                  ) : (
                    <span className="text-[7px] uppercase tracking-widest text-stone-600 font-bold">
                      No allergens
                    </span>
                  )}
                </div>
                
                <div className="pt-2">
                  <details className="group/details" onClick={(e) => e.stopPropagation()}>
                    <summary className="text-[9px] uppercase tracking-widest text-stone-500 font-bold cursor-pointer hover:text-stone-300 transition-colors list-none flex items-center gap-1">
                      Product Details
                      <motion.span animate={{ rotate: 0 }} className="group-open/details:rotate-180 transition-transform">▼</motion.span>
                    </summary>
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="pt-3 space-y-2"
                    >
                      {/* Nutritional Information Collapsible */}
                      <details className="group/nutrition border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
                        <summary className="px-4 py-3 text-[9px] uppercase tracking-widest text-stone-400 font-bold cursor-pointer list-none flex items-center justify-between group-open/nutrition:bg-white/5 transition-colors">
                          <div className="flex items-center gap-2">
                            <span>Nutritional Profile</span>
                            <div className="group/info relative">
                              <Info size={10} className="text-stone-600 cursor-help hover:text-stone-400 transition-colors" />
                              <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-stone-900 border border-white/10 rounded-lg opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl">
                                <p className="text-[7px] text-stone-400 leading-normal">
                                  <span className="text-accent font-bold">Calories:</span> Energy provided by the selection.<br/>
                                  <span className="text-accent font-bold">Protein:</span> Essential for tissue repair.<br/>
                                  <span className="text-accent font-bold">Fat:</span> Includes healthy unsaturated fats.
                                </p>
                              </div>
                            </div>
                          </div>
                          <ChevronDown size={12} className="group-open/nutrition:rotate-180 transition-transform text-stone-600" />
                        </summary>
                        <div className="p-4 bg-black/20">
                          {item.nutritionalInfo ? (
                            <div className="flex gap-4">
                              <NutritionMetric label="Calories" value={item.nutritionalInfo.calories} max={800} unit="" colorClass="bg-accent" />
                              <NutritionMetric label="Protein" value={item.nutritionalInfo.protein} max={50} unit="g" colorClass="bg-stone-300" />
                              <NutritionMetric label="Fat" value={item.nutritionalInfo.fat} max={70} unit="g" colorClass="bg-stone-500" />
                            </div>
                          ) : (
                            <div className="py-2 text-center">
                              <p className="text-[9px] text-stone-600 italic">Nutritional profile pending detailed analysis</p>
                            </div>
                          )}
                        </div>
                      </details>

                      {/* Allergens Collapsible */}
                      <details className="group/allergens border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
                        <summary className="px-4 py-3 text-[9px] uppercase tracking-widest text-stone-400 font-bold cursor-pointer list-none flex items-center justify-between group-open/allergens:bg-white/5 transition-colors">
                          <span>Safety & Allergens</span>
                          <ChevronDown size={12} className="group-open/allergens:rotate-180 transition-transform text-stone-600" />
                        </summary>
                        <div className="p-4 bg-black/20">
                          <div className="flex flex-wrap gap-1.5">
                            {item.allergens && item.allergens.length > 0 ? (
                              item.allergens.map(allergen => (
                                <span key={allergen} className="text-[8px] bg-red-400/10 text-red-300 px-3 py-1 rounded-full border border-red-400/20 font-medium tracking-wide">
                                  {allergen}
                                </span>
                              ))
                            ) : (
                              <div className="w-full py-2 flex items-center justify-center gap-2 text-stone-500 bg-white/5 rounded-lg border border-white/5 italic">
                                <span className="text-[8px]">No common allergens identified for this selection</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </details>

                      {/* Ingredients & Origin Collapsible */}
                      <details className="group/ingredients border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
                        <summary className="px-4 py-3 text-[9px] uppercase tracking-widest text-stone-400 font-bold cursor-pointer list-none flex items-center justify-between group-open/ingredients:bg-white/5 transition-colors">
                          <span>Ingredients & Origin</span>
                          <ChevronDown size={12} className="group-open/ingredients:rotate-180 transition-transform text-stone-600" />
                        </summary>
                        <div className="p-4 bg-black/20 space-y-3">
                          {item.ingredients && item.ingredients.length > 0 ? (
                            <CollapsibleIngredients ingredients={item.ingredients} />
                          ) : (
                            <div className="w-full py-2 flex items-center justify-center gap-2 text-stone-500 bg-white/5 rounded-lg border border-white/5 italic">
                              <span className="text-[8px]">Detailed ingredient origins pending seasonal verification</span>
                            </div>
                          )}
                        </div>
                      </details>

                      <div className="mt-4 pt-4 border-t border-white/5">
                        <ReviewSection 
                          itemId={item.id} 
                          reviews={item.reviews || []} 
                          onAddReview={handleAddReview} 
                        />
                      </div>
                    </motion.div>
                  </details>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(item, (e.currentTarget as HTMLElement).getBoundingClientRect());
                  }}
                  className="md:hidden w-full py-3 bg-stone-100 text-brand-primary rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] mt-4 active:scale-95 transition-transform"
                >
                  Add to Selection
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-32 text-center"
        >
          <p className="text-stone-500 italic font-serif text-lg">No culinary stories match your selection.</p>
          <button 
            onClick={() => setActiveCategory('All')} 
            className="mt-4 text-accent text-[10px] uppercase tracking-widest font-bold border-b border-accent/30 hover:border-accent transition-all"
          >
            Clear Selection
          </button>
        </motion.div>
      )}
    </section>
  );
};

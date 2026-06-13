import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, getIngredientById } from '@/store/useStore';
import { Link } from 'react-router-dom';
import { Clock, ChefHat, X, ChevronDown, ChevronUp, Filter, Sparkles, UtensilsCrossed, AlertCircle, Carrot } from 'lucide-react';
import type { MatchedRecipe, FilterKey } from '@/types';

const FILTERS: { key: FilterKey; label: string; emoji: string }[] = [
  { key: 'onePot', label: '一锅优先', emoji: '🍲' },
  { key: 'quickMeal', label: '十分钟内', emoji: '⚡' },
  { key: 'lessDishes', label: '少洗碗', emoji: '🧽' },
  { key: 'vegetarian', label: '素食', emoji: '🥗' },
];

export function Recipes() {
  const { getFilteredRecipes, getMatchedRecipes, preferences, togglePreference, stockIngredients } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const filtered = getFilteredRecipes();
  const allMatched = getMatchedRecipes();

  const displayRecipes = useMemo(() => {
    if (shuffleSeed === 0) return filtered;
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [filtered, shuffleSeed]);

  const activeFilters = Object.values(preferences).filter(Boolean).length;

  return (
    <div className="min-h-screen pb-36">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display text-3xl mb-1">
            🍳 <span className="text-gradient">菜谱拼配</span>
          </h1>
          <p className="text-sm text-gray-500">
            基于你冰箱里的 <span className="text-brand-500 font-medium">{stockIngredients.length}</span> 种食材，
            找到了 <span className="text-brand-500 font-medium">{allMatched.length}</span> 道菜谱
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter size={16} className="text-brand-500" />
              做饭偏好
              {activeFilters > 0 && (
                <span className="chip-blue !py-0.5">{activeFilters}项生效中</span>
              )}
            </div>
            {allMatched.length > 2 && (
              <button
                onClick={() => setShuffleSeed(Date.now())}
                className="text-xs text-brand-500 font-medium flex items-center gap-1 hover:text-brand-600 transition-colors"
              >
                <Sparkles size={14} />
                随机一下
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(({ key, label, emoji }) => {
              const active = preferences[key];
              return (
                <motion.button
                  key={key}
                  onClick={() => togglePreference(key)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${
                    active
                      ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-soft'
                      : 'bg-white text-gray-600 border border-cream-200 hover:border-brand-300'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {displayRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center"
          >
            {stockIngredients.length === 0 ? (
              <>
                <div className="text-6xl mb-4">🧊</div>
                <h3 className="font-display text-xl text-gray-800 mb-2">还没有食材哦</h3>
                <p className="text-sm text-gray-500 mb-5">先去盘点冰箱里的食材，我才能帮你拼菜谱～</p>
                <Link to="/ingredients">
                  <button className="btn-primary">
                    <Carrot size={18} /> 去盘点食材
                  </button>
                </Link>
              </>
            ) : activeFilters > 0 ? (
              <>
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="font-display text-xl text-gray-800 mb-2">暂无符合条件的菜谱</h3>
                <p className="text-sm text-gray-500 mb-5">试试减少一些筛选条件，或者添加更多食材</p>
                <div className="flex gap-2 justify-center">
                  {FILTERS.filter((f) => preferences[f.key]).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => togglePreference(key)}
                      className="chip-red hover:bg-danger/20 transition-colors"
                    >
                      {label} <X size={12} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🥲</div>
                <h3 className="font-display text-xl text-gray-800 mb-2">食材太少啦</h3>
                <p className="text-sm text-gray-500 mb-5">再多添加几种食材，会有更多菜谱选择哦</p>
                <Link to="/ingredients">
                  <button className="btn-primary">
                    <Plus size={18} /> 添加更多
                  </button>
                </Link>
              </>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {displayRecipes.map((recipe, idx) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  index={idx}
                  expanded={expandedId === recipe.id}
                  onToggle={() =>
                    setExpandedId(expandedId === recipe.id ? null : recipe.id)
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeCard({
  recipe,
  index,
  expanded,
  onToggle,
}: {
  recipe: MatchedRecipe;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { matchPercentage, tags, cookTimeMinutes, potCount, coverEmoji, name, description, requiredIngredients, matchedIngredients, missingIngredients, steps } = recipe;

  const matchColor =
    matchPercentage >= 80
      ? 'text-fresh-dark stroke-fresh'
      : matchPercentage >= 50
      ? 'text-warn-dark stroke-warn'
      : 'text-brand-600 stroke-brand-500';

  const bgColor =
    matchPercentage >= 80
      ? 'stroke-fresh'
      : matchPercentage >= 50
      ? 'stroke-warn'
      : 'stroke-brand-400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="card overflow-hidden hover:shadow-float transition-all duration-300">
        <button onClick={onToggle} className="w-full text-left p-5">
          <div className="flex gap-4">
            <div className="relative flex-shrink-0">
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-5xl overflow-hidden"
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                {coverEmoji}
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#FFE8D1"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className={bgColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(matchPercentage / 100) * 94.2} 94.2`}
                    initial={{ strokeDasharray: '0 94.2' }}
                    animate={{ strokeDasharray: `${(matchPercentage / 100) * 94.2} 94.2` }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.05, ease: 'easeOut' }}
                  />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${matchColor}`}>
                  {matchPercentage}%
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-display text-xl text-gray-800 truncate">{name}</h3>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                </motion.div>
              </div>
              {description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-1">{description}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="chip-blue">
                  <Clock size={11} /> {cookTimeMinutes}分钟
                </span>
                <span className="chip-yellow">
                  <UtensilsCrossed size={11} /> {potCount}口锅
                </span>
                {tags.onePot && <span className="chip-green">🍲 一锅出</span>}
                {tags.quickMeal && <span className="chip-green">⚡ 快手</span>}
                {tags.lessDishes && <span className="chip-green">🧽 少洗</span>}
                {tags.vegetarian && <span className="chip-green">🥗 素</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {requiredIngredients.slice(0, 5).map((id) => {
                  const ing = getIngredientById(id);
                  const matched = matchedIngredients.includes(id);
                  if (!ing) return null;
                  return (
                    <span
                      key={id}
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] ${
                        matched
                          ? 'bg-fresh/10 text-fresh-dark'
                          : 'bg-gray-100 text-gray-400 line-through'
                      }`}
                    >
                      <span>{ing.emoji}</span>
                      {ing.name}
                    </span>
                  );
                })}
                {requiredIngredients.length > 5 && (
                  <span className="text-[10px] text-gray-400">
                    +{requiredIngredients.length - 5}
                  </span>
                )}
              </div>
            </div>
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-cream-200"
            >
              <div className="p-5 pt-4 space-y-5">
                {missingIngredients.length > 0 && (
                  <div className="bg-warn/5 border border-warn/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-warn-dark text-xs font-medium mb-2">
                      <AlertCircle size={14} />
                      还需要这些食材
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missingIngredients.map((id) => {
                        const ing = getIngredientById(id);
                        if (!ing) return null;
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-warn/30 text-xs text-gray-600"
                          >
                            <span>{ing.emoji}</span>
                            {ing.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <ChefHat size={16} className="text-brand-500" />
                    烹饪步骤
                  </div>
                  <ol className="space-y-3">
                    {steps.map((step, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-3"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 text-white text-xs font-bold flex items-center justify-center shadow-soft">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-600 pt-0.5 flex-1">{step}</p>
                      </motion.li>
                    ))}
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-brand-50 to-amber-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">你已拥有的食材</div>
                  <div className="flex flex-wrap gap-2">
                    {matchedIngredients.map((id) => {
                      const ing = getIngredientById(id);
                      if (!ing) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white shadow-sm text-xs font-medium text-gray-700"
                        >
                          <span className="text-base">{ing.emoji}</span>
                          {ing.name}
                          <span className="text-fresh-dark">✓</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Plus({ size }: { size: number }) {
  return <span style={{ width: size, height: size }} className="inline-flex items-center justify-center">+</span>;
}

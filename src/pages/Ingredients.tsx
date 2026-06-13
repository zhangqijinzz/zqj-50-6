import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { CATEGORY_LABELS } from '@/data/ingredients';
import { Plus, Calendar, Check, X, PlusCircle } from 'lucide-react';
import type { IngredientCategory, Ingredient } from '@/types';

const categories: IngredientCategory[] = ['vegetable', 'protein', 'staple', 'seasoning'];

export function Ingredients() {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('vegetable');
  const [showAddModal, setShowAddModal] = useState(false);
  const [datePickerFor, setDatePickerFor] = useState<string | null>(null);

  const {
    getIngredientsByCategory,
    isInStock,
    addStockIngredient,
    removeStockIngredient,
    updatePurchaseDate,
    stockIngredients,
    addCustomIngredient,
  } = useStore();

  const ingredients = getIngredientsByCategory(activeCategory);
  const categoryInfo = CATEGORY_LABELS[activeCategory];

  const handleToggle = (ingredientId: string) => {
    if (isInStock(ingredientId)) {
      removeStockIngredient(ingredientId);
    } else {
      addStockIngredient(ingredientId);
    }
  };

  const totalCount = stockIngredients.length;

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display text-3xl mb-1">
            <span className={categoryInfo.color.split(' ')[0].replace('from-', 'text-').replace('-400', '-600')}>
              {categoryInfo.emoji}
            </span>{' '}
            <span className="text-gradient">食材盘点</span>
          </h1>
          <p className="text-sm text-gray-500">
            勾选你冰箱里有的，我来帮你拼菜谱～
            {totalCount > 0 && (
              <span className="ml-2 chip-blue !py-0.5">
                已选 {totalCount} 种
              </span>
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4">
            {categories.map((cat) => {
              const info = CATEGORY_LABELS[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? `bg-gradient-to-r ${info.color} text-white shadow-soft scale-105`
                      : 'bg-white text-gray-600 hover:bg-cream-100'
                  }`}
                >
                  <span className="text-lg">{info.emoji}</span>
                  <span className="whitespace-nowrap">{info.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6"
        >
          {ingredients.map((ing, idx) => {
            const selected = isInStock(ing.id);
            const stock = stockIngredients.find((s) => s.id === ing.id);
            return (
              <motion.div
                key={ing.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
              >
                <button
                  onClick={() => handleToggle(ing.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (selected) setDatePickerFor(ing.id);
                  }}
                  className={`relative w-full aspect-square rounded-2xl p-2 flex flex-col items-center justify-center gap-1 transition-all duration-300 overflow-hidden group ${
                    selected
                      ? `bg-gradient-to-br ${categoryInfo.color} text-white shadow-float scale-[1.02]`
                      : 'bg-white border border-cream-200 hover:border-brand-300 hover:shadow-soft'
                  }`}
                >
                  <motion.span
                    className="text-4xl sm:text-5xl"
                    animate={selected ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
                    transition={selected ? { duration: 0.4 } : {}}
                  >
                    {ing.emoji}
                  </motion.span>
                  <span
                    className={`text-xs font-medium truncate w-full text-center ${
                      selected ? 'text-white/95' : 'text-gray-700'
                    }`}
                  >
                    {ing.name}
                  </span>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <Check size={14} className="text-fresh-dark" strokeWidth={3} />
                    </motion.div>
                  )}
                  {stock && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDatePickerFor(ing.id);
                      }}
                      className={`absolute bottom-1.5 left-1.5 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                        selected
                          ? 'bg-white/30 text-white backdrop-blur-sm'
                          : 'bg-cream-100 text-gray-500'
                      }`}
                    >
                      <Calendar size={10} />
                      {stock.purchaseDate.slice(5)}
                    </button>
                  )}
                </button>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: ingredients.length * 0.02 }}
          >
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full aspect-square rounded-2xl p-2 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-brand-300 bg-brand-50/50 text-brand-500 hover:bg-brand-50 hover:border-brand-400 transition-all group"
            >
              <PlusCircle
                size={40}
                className="group-hover:scale-110 transition-transform"
                strokeWidth={1.5}
              />
              <span className="text-xs font-medium">自定义</span>
            </button>
          </motion.div>
        </motion.div>

        {stockIngredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-gray-800">
                📦 在库食材 ({stockIngredients.length})
              </h2>
              <button
                onClick={() => {
                  stockIngredients.forEach((s) => removeStockIngredient(s.id));
                }}
                className="text-xs text-gray-400 hover:text-danger transition-colors"
              >
                全部清空
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {stockIngredients.map((s) => (
                  <motion.span
                    key={s.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full text-sm ${
                      CATEGORY_LABELS[s.category].color
                        .split(' ')
                        .map((c) =>
                          c.replace('from-', 'bg-').replace('-400', '-100')
                        )
                        .join(' ')
                    }`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <span className="text-gray-700">{s.name}</span>
                    <button
                      onClick={() => removeStockIngredient(s.id)}
                      className="w-5 h-5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-danger flex items-center justify-center ml-1 transition-colors"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {datePickerFor && (
          <DatePickerModal
            ingredientId={datePickerFor}
            currentDate={
              stockIngredients.find((s) => s.id === datePickerFor)?.purchaseDate ||
              new Date().toISOString().slice(0, 10)
            }
            onClose={() => setDatePickerFor(null)}
            onSave={(date) => {
              updatePurchaseDate(datePickerFor, date);
              setDatePickerFor(null);
            }}
            ingredientName={
              stockIngredients.find((s) => s.id === datePickerFor)?.name || ''
            }
          />
        )}
        {showAddModal && (
          <AddIngredientModal
            onClose={() => setShowAddModal(false)}
            onAdd={(ing) => {
              addCustomIngredient(ing);
              addStockIngredient(ing.id);
              setShowAddModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DatePickerModal({
  ingredientId: _ingredientId,
  currentDate,
  onClose,
  onSave,
  ingredientName,
}: {
  ingredientId: string;
  currentDate: string;
  onClose: () => void;
  onSave: (date: string) => void;
  ingredientName: string;
}) {
  const [date, setDate] = useState(currentDate);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl text-gray-800 mb-1">
          📅 修改购买日期
        </h3>
        <p className="text-sm text-gray-500 mb-5">{ingredientName}</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
          className="w-full px-4 py-3 rounded-xl border-2 border-cream-200 focus:border-brand-400 focus:outline-none text-lg mb-5"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary">
            取消
          </button>
          <button onClick={() => onSave(date)} className="flex-1 btn-primary">
            <Check size={18} /> 保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddIngredientModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (ing: Ingredient) => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('vegetable');
  const [shelfLife, setShelfLife] = useState(7);
  const emojiOptions = ['🥬', '🥕', '🍅', '🥔', '🧅', '🥚', '🍗', '🥩', '🍚', '🍜', '🧂', '🫙', '🍎', '🍌'];
  const [emoji, setEmoji] = useState(emojiOptions[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      emoji,
      shelfLifeDays: shelfLife,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 max-h-[85vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl text-gray-800 flex items-center gap-2">
            <Plus size={22} /> 添加自定义食材
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">选择图标</label>
            <div className="grid grid-cols-7 gap-2">
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'bg-brand-100 border-2 border-brand-400 scale-110'
                      : 'bg-cream-50 hover:bg-cream-100'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">食材名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：小番茄、午餐肉..."
              className="w-full px-4 py-3 rounded-xl border-2 border-cream-200 focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">分类</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const info = CATEGORY_LABELS[cat];
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                      active
                        ? `bg-gradient-to-r ${info.color} text-white shadow-soft`
                        : 'bg-cream-50 text-gray-600 hover:bg-cream-100'
                    }`}
                  >
                    <span>{info.emoji}</span>
                    <span className="text-sm">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              保质期：<span className="text-brand-500 font-bold">{shelfLife}</span> 天
            </label>
            <input
              type="range"
              min={1}
              max={180}
              value={shelfLife}
              onChange={(e) => setShelfLife(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1天</span>
              <span>30天</span>
              <span>180天</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={18} /> 加入冰箱
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

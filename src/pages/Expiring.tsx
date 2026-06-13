import { motion, AnimatePresence } from 'framer-motion';
import { useStore, getIngredientById } from '@/store/useStore';
import { Link } from 'react-router-dom';
import { CalendarDays, AlertTriangle, Clock, Sparkles, ChefHat, Trash2, Carrot } from 'lucide-react';
import type { StockIngredientWithStatus, ExpiryStatus } from '@/types';

const statusConfig: Record<ExpiryStatus, { label: string; chipClass: string; barClass: string; bgClass: string; text: string }> = {
  expired: {
    label: '已过期',
    chipClass: 'bg-gray-200 text-gray-600',
    barClass: 'bg-gray-400',
    bgClass: 'from-gray-50 to-gray-100',
    text: '建议丢弃，不要食用哦',
  },
  urgent: {
    label: '紧急！',
    chipClass: 'bg-danger/10 text-danger-dark',
    barClass: 'bg-gradient-to-b from-danger to-red-500',
    bgClass: 'from-red-50 to-orange-50',
    text: '今天就吃掉它！',
  },
  warning: {
    label: '快吃',
    chipClass: 'bg-warn/10 text-warn-dark',
    barClass: 'bg-gradient-to-b from-warn to-amber-500',
    bgClass: 'from-amber-50 to-yellow-50',
    text: '本周内吃完比较好',
  },
  fresh: {
    label: '保鲜中',
    chipClass: 'bg-fresh/10 text-fresh-dark',
    barClass: 'bg-gradient-to-b from-fresh to-emerald-500',
    bgClass: 'from-green-50 to-emerald-50',
    text: '状态良好，慢慢吃～',
  },
};

export function Expiring() {
  const { getStockWithStatus, getStockByStatus, removeStockIngredient, getMatchedRecipes } = useStore();

  const allStock = getStockWithStatus();
  const { urgent, warning, fresh, expired } = getStockByStatus();
  const matchedRecipes = getMatchedRecipes();

  const urgentRecipeFor = (item: StockIngredientWithStatus) => {
    return matchedRecipes
      .filter((r) => r.matchedIngredients.includes(item.id))
      .sort((a, b) => b.matchPercentage - a.matchPercentage)[0];
  };

  const renderSection = (title: string, emoji: string, items: StockIngredientWithStatus[], showRecipes = false) => {
    if (items.length === 0) return null;
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{emoji}</span>
          <h2 className="font-display text-lg text-gray-800">{title}</h2>
          <span className="chip-blue">{items.length}</span>
        </div>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => {
              const config = statusConfig[item.status];
              const recipe = showRecipes ? urgentRecipeFor(item) : null;
              return (
                <TimelineItem
                  key={item.id}
                  item={item}
                  config={config}
                  index={idx}
                  recipe={recipe}
                  onRemove={() => removeStockIngredient(item.id)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl mb-1">
            ⏰ <span className="text-gradient">临期提醒</span>
          </h1>
          <p className="text-sm text-gray-500">
            按剩余天数排序，先吃快要过期的！
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-4 gap-2 mb-8"
        >
          <StatCard
            count={urgent.length}
            label="紧急"
            emoji="🚨"
            color="from-danger to-red-400"
            delay={0.1}
          />
          <StatCard
            count={warning.length}
            label="快吃"
            emoji="⚠️"
            color="from-warn to-amber-400"
            delay={0.15}
          />
          <StatCard
            count={fresh.length}
            label="新鲜"
            emoji="✅"
            color="from-fresh to-emerald-400"
            delay={0.2}
          />
          <StatCard
            count={expired.length}
            label="过期"
            emoji="🗑️"
            color="from-gray-400 to-gray-500"
            delay={0.25}
          />
        </motion.div>

        {allStock.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center"
          >
            <div className="text-6xl mb-4">🧺</div>
            <h3 className="font-display text-xl text-gray-800 mb-2">还没有食材呢</h3>
            <p className="text-sm text-gray-500 mb-5">
              添加食材后，这里会自动帮你计算保质期并提醒～
            </p>
            <Link to="/ingredients">
              <button className="btn-primary">
                <Carrot size={18} /> 去添加食材
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            {renderSection('立即食用 🚨', '🔥', urgent, true)}
            {renderSection('尽快安排 ⚠️', '⏱️', warning, true)}
            {renderSection('保鲜中 ✅', '🌿', fresh)}
            {renderSection('已过期 🗑️', '💨', expired)}

            {urgent.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-5 bg-gradient-to-r from-orange-50 via-red-50 to-amber-50 mb-8"
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl animate-bounce-subtle">🍳</div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-gray-800 mb-2 flex items-center gap-2">
                      <Sparkles size={18} className="text-brand-500" />
                      先吃推荐
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      用临期食材可以做出这些菜，趁热打铁！
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchedRecipes
                        .filter((r) =>
                          urgent.some((u) => r.matchedIngredients.includes(u.id))
                        )
                        .slice(0, 5)
                        .map((r) => (
                          <Link key={r.id} to="/recipes">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm text-sm font-medium text-gray-700 hover:shadow-md transition-all cursor-pointer">
                              <span className="text-xl">{r.coverEmoji}</span>
                              {r.name}
                              <ChefHat size={12} className="text-brand-500" />
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">💡</div>
                <div className="flex-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-800 mb-1">小贴士</p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li>• 想修改购买日期？去食材页点那个小日历图标～</li>
                    <li>• 葱姜蒜这类耐放的调料保质期默认很长，不用天天看</li>
                    <li>• 点右上角小垃圾桶可以把用掉的食材移除</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  count,
  label,
  emoji,
  color,
  delay,
}: {
  count: number;
  label: string;
  emoji: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`card overflow-hidden bg-gradient-to-br ${color} text-white p-3 text-center relative`}
    >
      <div className="absolute -right-2 -top-2 text-3xl opacity-20">{emoji}</div>
      <div className="font-display text-2xl leading-tight">{count}</div>
      <div className="text-[10px] opacity-90 mt-0.5">{label}</div>
    </motion.div>
  );
}

function TimelineItem({
  item,
  config,
  index,
  recipe,
  onRemove,
}: {
  item: StockIngredientWithStatus;
  config: (typeof statusConfig)[ExpiryStatus];
  index: number;
  recipe?: import('@/types').MatchedRecipe;
  onRemove: () => void;
}) {
  const expiryDate = new Date(item.purchaseDate);
  expiryDate.setDate(expiryDate.getDate() + item.shelfLifeDays);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      className={`card overflow-hidden bg-gradient-to-r ${config.bgClass}`}
    >
      <div className="flex">
        <div className={`w-1.5 flex-shrink-0 ${config.barClass}`} />
        <div className="flex-1 p-4 pl-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <motion.div
                className="text-4xl flex-shrink-0"
                whileHover={{ scale: 1.15, rotate: -10 }}
              >
                {item.emoji}
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                  <span className={`chip ${config.chipClass} flex-shrink-0`}>
                    {item.status === 'expired'
                      ? `过期${-item.remainingDays}天`
                      : item.status === 'urgent'
                      ? item.remainingDays === 0
                        ? '今天到期！'
                        : `剩${item.remainingDays}天`
                      : `剩${item.remainingDays}天`}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={11} />
                    到期 {expiryDate.toISOString().slice(5, 10)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} />
                    入库 {item.purchaseDate.slice(5)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/60 hover:bg-danger hover:text-white text-gray-400 flex items-center justify-center transition-all"
              title="移除"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {item.status !== 'expired' && item.status !== 'fresh' && (
            <p className="text-xs text-gray-500 mb-2">{config.text}</p>
          )}
          {item.status === 'expired' && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <AlertTriangle size={11} className="text-gray-500" />
              {config.text}
            </p>
          )}

          {recipe && (
            <Link to="/recipes">
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {recipe.coverEmoji}
                </span>
                <div>
                  <div className="text-sm font-medium text-gray-800 leading-tight">
                    试试 {recipe.name}？
                  </div>
                  <div className="text-[10px] text-gray-500">
                    匹配度 {recipe.matchPercentage}% · {recipe.cookTimeMinutes}分钟
                  </div>
                </div>
                <ChefHat size={14} className="text-brand-500 ml-1" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

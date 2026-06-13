import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Sparkles, Carrot, UtensilsCrossed, AlertTriangle, ChevronRight, RefreshCw } from 'lucide-react';
import type { StockIngredientWithStatus } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300 } },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 11) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export function Dashboard() {
  const { stockIngredients, getStockByStatus, getMatchedRecipes } = useStore();
  const { urgent, warning } = getStockByStatus();
  const matched = getMatchedRecipes();

  const totalIngredients = stockIngredients.length;
  const urgentCount = urgent.length;
  const warningCount = warning.length;
  const recipeCount = matched.length;
  const topRecipe = matched[0];

  return (
    <div className="min-h-screen pb-28">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg mx-auto px-4 pt-8"
      >
        <motion.header variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2 text-brand-500 text-sm font-medium mb-2">
            <Sparkles size={16} />
            <span>{getGreeting()}，小厨神👋</span>
          </div>
          <h1 className="font-display text-3xl leading-tight">
            <span className="text-gradient">料理残局</span>
            <br />
            <span className="text-gray-800">拯救站 🥄</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">冰箱有啥咱吃啥，浪费一滴算我输</p>
        </motion.header>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-5 bg-gradient-to-br from-brand-500 to-brand-400 text-white overflow-hidden relative">
            <div className="absolute -right-4 -top-4 text-7xl opacity-20">🥕</div>
            <div className="flex items-center gap-2 mb-1 text-white/80 text-xs">
              <Carrot size={14} />
              在库食材
            </div>
            <div className="font-display text-4xl">{totalIngredients}</div>
            <div className="text-xs text-white/70 mt-1">种食材等待登场</div>
          </div>

          <Link to="/expiring" className="block">
            <div className={`card p-5 h-full relative overflow-hidden transition-all hover:shadow-float hover:-translate-y-1 ${
              urgentCount > 0 ? 'bg-gradient-to-br from-danger to-red-400 text-white' : 'bg-gradient-to-br from-warn to-amber-400 text-white'
            }`}>
              <div className="absolute -right-4 -top-4 text-7xl opacity-20">⏰</div>
              <div className="flex items-center gap-2 mb-1 text-white/80 text-xs">
                <AlertTriangle size={14} />
                临期提醒
              </div>
              <div className="font-display text-4xl">
                {urgentCount + warningCount}
              </div>
              <div className="text-xs text-white/70 mt-1">
                {urgentCount > 0
                  ? `${urgentCount}种紧急！快吃`
                  : warningCount > 0
                  ? `${warningCount}种即将过期`
                  : '状态良好 ✅'}
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <Link to="/recipes" className="block">
            <div className="card p-5 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden hover:shadow-float hover:-translate-y-1 transition-all">
              <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-brand-100 to-transparent rounded-full blur-2xl" />
              <div className="flex items-start justify-between relative">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-brand-600 text-xs font-medium mb-2">
                    <UtensilsCrossed size={14} />
                    今日灵感推荐
                  </div>
                  {topRecipe ? (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-5xl">{topRecipe.coverEmoji}</div>
                        <div>
                          <h3 className="font-display text-xl text-gray-800">
                            {topRecipe.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {topRecipe.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="chip-blue">
                          ⏱️ {topRecipe.cookTimeMinutes}分钟
                        </span>
                        <span className="chip-green">
                          匹配度 {topRecipe.matchPercentage}%
                        </span>
                        {topRecipe.tags.onePot && (
                          <span className="chip-yellow">🍲 一锅出</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="py-4">
                      <p className="text-gray-500 text-sm">先去勾选冰箱里的食材吧～</p>
                      <p className="text-xs text-gray-400 mt-1">系统会根据食材自动推荐菜谱</p>
                    </div>
                  )}
                </div>
                <ChevronRight className="text-brand-400 mt-1" size={20} />
              </div>
            </div>
          </Link>
        </motion.div>

        {urgentCount > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-gray-800 flex items-center gap-2">
                <span className="text-2xl animate-pulse-slow">🚨</span>
                紧急！先吃这些
              </h2>
              <Link to="/expiring" className="text-xs text-brand-500 font-medium flex items-center gap-0.5">
                查看全部 <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4">
              {urgent.slice(0, 5).map((item, idx) => (
                <UrgentCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="font-display text-lg text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            快捷操作
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Link to="/ingredients">
              <div className="card-hover p-4 flex flex-col items-center text-center gap-2">
                <div className="text-3xl">🥬</div>
                <span className="text-xs font-medium text-gray-700">盘点食材</span>
              </div>
            </Link>
            <Link to="/recipes">
              <div className="card-hover p-4 flex flex-col items-center text-center gap-2">
                <div className="text-3xl">🎲</div>
                <span className="text-xs font-medium text-gray-700">随机灵感</span>
              </div>
            </Link>
            <Link to="/expiring">
              <div className="card-hover p-4 flex flex-col items-center text-center gap-2">
                <div className="text-3xl">📋</div>
                <span className="text-xs font-medium text-gray-700">临期清单</span>
              </div>
            </Link>
          </div>
        </motion.div>

        {recipeCount > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="card p-5 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce-subtle">💡</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm mb-1">
                    你有 <span className="text-gradient font-display text-xl">{recipeCount}</span> 道菜可以做！
                  </div>
                  <p className="text-xs text-gray-500">
                    基于当前食材，最多可做出 {recipeCount} 种组合
                  </p>
                </div>
                <Link to="/recipes">
                  <button className="btn-primary !py-2 !px-4 text-sm">
                    去看看
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {totalIngredients === 0 && (
          <motion.div variants={itemVariants}>
            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">🧊</div>
              <h3 className="font-display text-xl text-gray-800 mb-2">空空如也？</h3>
              <p className="text-sm text-gray-500 mb-5">
                先去冰箱看看有啥食材，告诉我它们，我来帮你拼出今天的晚餐！
              </p>
              <Link to="/ingredients">
                <button className="btn-primary">
                  <Carrot size={18} /> 开始盘点食材
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="text-center pb-4">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <RefreshCw size={12} />
            数据已自动保存至本地
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function UrgentCard({ item, index }: { item: StockIngredientWithStatus; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
      className="flex-shrink-0 w-28 card p-3 bg-gradient-to-b from-danger/5 border-danger/30 animate-pulse-slow"
    >
      <div className="text-4xl text-center mb-2">{item.emoji}</div>
      <div className="text-sm font-medium text-gray-800 text-center mb-1 truncate">
        {item.name}
      </div>
      <div className="text-center">
        <span className="chip-red">
          {item.remainingDays < 0
            ? `已过期${-item.remainingDays}天`
            : `剩${item.remainingDays}天`}
        </span>
      </div>
    </motion.div>
  );
}

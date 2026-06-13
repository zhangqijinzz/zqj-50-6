import type { Recipe } from '@/types';

export const RECIPES: Recipe[] = [
  {
    id: 'tomato-egg',
    name: '番茄炒蛋',
    coverEmoji: '🍳',
    requiredIngredients: ['v-tomato', 'p-egg', 'se-salt', 'se-oil', 'se-sugar'],
    steps: [
      '番茄切块，鸡蛋打散加少许盐',
      '热锅冷油，倒入蛋液炒至凝固盛出',
      '锅中补油，下番茄翻炒出汁',
      '加少许糖和盐调味，倒入炒好的鸡蛋',
      '翻炒均匀出锅'
    ],
    cookTimeMinutes: 10,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '国民下饭菜，酸甜可口，零失败'
  },
  {
    id: 'pepper-potato',
    name: '青椒土豆丝',
    coverEmoji: '🥔',
    requiredIngredients: ['v-pepper', 'v-potato', 'se-salt', 'se-vinegar', 'se-oil', 'v-garlic'],
    steps: [
      '土豆去皮切细丝，泡水洗去淀粉',
      '青椒切丝，大蒜切末',
      '热锅冷油，爆香蒜末',
      '下土豆丝大火快炒，加醋',
      '下青椒丝，加盐调味，翻炒出锅'
    ],
    cookTimeMinutes: 15,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: true },
    description: '酸辣爽脆，超级下饭'
  },
  {
    id: 'garlic-broccoli',
    name: '蒜蓉西兰花',
    coverEmoji: '🥦',
    requiredIngredients: ['v-broccoli', 'v-garlic', 'se-salt', 'se-oil', 'se-oyster'],
    steps: [
      '西兰花切小朵，盐水浸泡10分钟',
      '大蒜剁成蒜蓉',
      '水烧开加少许盐和油，焯西兰花2分钟捞出',
      '热锅冷油，小火炒香蒜蓉',
      '下西兰花翻炒，加蚝油和少许盐出锅'
    ],
    cookTimeMinutes: 10,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: true },
    description: '清爽健康，颜值高'
  },
  {
    id: 'egg-fried-rice',
    name: '蛋炒饭',
    coverEmoji: '🍚',
    requiredIngredients: ['s-rice', 'p-egg', 'v-green-onion', 'se-salt', 'se-oil'],
    steps: [
      '鸡蛋打散，葱切葱花',
      '米饭用手抓散',
      '热锅冷油，倒蛋液快速翻炒',
      '蛋液半凝固时倒入米饭',
      '大火翻炒至米粒分明，加盐',
      '撒葱花翻匀出锅'
    ],
    cookTimeMinutes: 10,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '剩饭终结者，粒粒分明超香'
  },
  {
    id: 'cucumber-fungus',
    name: '黄瓜拌木耳',
    coverEmoji: '🥒',
    requiredIngredients: ['v-cucumber', 'v-fungus', 'v-garlic', 'se-vinegar', 'se-soy', 'se-sesame'],
    steps: [
      '木耳提前泡发，焯水1分钟过凉水',
      '黄瓜拍碎切段',
      '大蒜切末',
      '所有食材放碗中',
      '加生抽、醋、香油拌匀即可'
    ],
    cookTimeMinutes: 5,
    potCount: 0,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: true },
    description: '清爽凉拌菜，不用开火'
  },
  {
    id: 'tofu-stir-fry',
    name: '家常豆腐',
    coverEmoji: '🍮',
    requiredIngredients: ['p-tofu', 'v-green-onion', 'v-garlic', 'se-soy', 'se-oyster', 'se-oil', 'se-starch'],
    steps: [
      '豆腐切方块，用厨房纸吸干水分',
      '调酱汁：生抽+蚝油+淀粉+水',
      '热锅热油，豆腐煎至两面金黄盛出',
      '锅中留油爆香蒜末',
      '倒酱汁煮至浓稠，放入豆腐翻匀',
      '撒葱花出锅'
    ],
    cookTimeMinutes: 15,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: true },
    description: '外焦里嫩，酱汁浓郁'
  },
  {
    id: 'potato-beef',
    name: '土豆炖牛肉',
    coverEmoji: '🥘',
    requiredIngredients: ['v-potato', 'p-beef', 'v-carrot', 'v-onion', 'v-garlic', 'se-soy', 'se-oil', 'se-salt'],
    steps: [
      '牛肉切块焯水去血沫',
      '土豆胡萝卜切块，洋葱切片',
      '热锅热油，炒香蒜末洋葱',
      '下牛肉翻炒，加生抽上色',
      '加开水没过食材，炖30分钟',
      '下土豆胡萝卜继续炖15分钟，加盐收汁'
    ],
    cookTimeMinutes: 50,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '软烂入味，一锅端大菜'
  },
  {
    id: 'mushroom-chicken',
    name: '蘑菇滑鸡片',
    coverEmoji: '🍗',
    requiredIngredients: ['p-chicken', 'v-mushroom', 'v-green-onion', 'v-garlic', 'se-soy', 'se-oil', 'se-starch', 'se-salt'],
    steps: [
      '鸡胸肉切片，用生抽淀粉抓匀腌制10分钟',
      '蘑菇切片，葱切段',
      '热锅热油，滑炒鸡片至变色盛出',
      '锅中补油，爆香蒜末蘑菇',
      '鸡片回锅，加盐翻炒',
      '撒葱段出锅'
    ],
    cookTimeMinutes: 20,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '鸡肉嫩滑，蘑菇鲜美'
  },
  {
    id: 'cabbage-noodle',
    name: '白菜炝锅面',
    coverEmoji: '🍜',
    requiredIngredients: ['v-cabbage', 's-noodle', 'p-egg', 'v-green-onion', 'v-garlic', 'se-soy', 'se-salt', 'se-oil'],
    steps: [
      '白菜切丝，葱切段，蒜切末',
      '热锅热油，爆香蒜末葱段',
      '下白菜丝炒软，加生抽',
      '加开水煮开，下面条',
      '面条快熟时打入鸡蛋',
      '加盐调味，撒葱花出锅'
    ],
    cookTimeMinutes: 15,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '热乎暖胃，一碗搞定'
  },
  {
    id: 'instant-upgrade',
    name: '豪华方便面',
    coverEmoji: '🍜',
    requiredIngredients: ['s-instant-noodle', 'p-egg', 'v-green-onion', 'v-cabbage', 'p-sausage'],
    steps: [
      '火腿肠切片，白菜切丝',
      '水烧开，下面饼和调料包',
      '放白菜丝和火腿肠',
      '打入鸡蛋，不要搅碎',
      '煮2分钟，撒葱花出锅'
    ],
    cookTimeMinutes: 8,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '5分钟升级泡面，幸福感爆棚'
  },
  {
    id: 'avocado-egg',
    name: '牛油果鸡蛋吐司',
    coverEmoji: '🥑',
    requiredIngredients: ['v-avocado', 'p-egg', 's-bread', 'se-salt', 'se-pepper'],
    steps: [
      '面包片烤至金黄',
      '牛油果切片，鸡蛋煎熟',
      '面包上铺牛油果，撒盐和黑胡椒',
      '放上煎蛋，对半切开'
    ],
    cookTimeMinutes: 8,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: 'ins风早餐，拍照超好看'
  },
  {
    id: 'eggplant-potato',
    name: '地三鲜',
    coverEmoji: '🍆',
    requiredIngredients: ['v-eggplant', 'v-potato', 'v-pepper', 'v-garlic', 'se-soy', 'se-vinegar', 'se-sugar', 'se-oil', 'se-starch'],
    steps: [
      '茄子土豆切块，青椒切片',
      '调酱汁：生抽+醋+糖+淀粉+水',
      '土豆煎至金黄，茄子煎软盛出',
      '锅中留油爆香蒜末青椒',
      '倒茄子土豆，淋酱汁翻匀出锅'
    ],
    cookTimeMinutes: 20,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: true },
    description: '东北经典，酱香浓郁'
  },
  {
    id: 'mapo-tofu',
    name: '麻婆豆腐',
    coverEmoji: '🌶️',
    requiredIngredients: ['p-tofu', 'p-pork', 'v-garlic', 'se-ginger', 'se-sauce', 'se-soy', 'se-oil', 'se-starch', 'se-pepper'],
    steps: [
      '豆腐切小块焯水，猪肉剁碎',
      '热锅热油，炒散肉末',
      '加蒜末姜末豆瓣酱炒出红油',
      '加水煮开，放豆腐',
      '煮5分钟，淋水淀粉',
      '撒花椒粉出锅'
    ],
    cookTimeMinutes: 15,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '麻辣鲜香，拌饭一绝'
  },
  {
    id: 'milk-oat',
    name: '牛奶燕麦粥',
    coverEmoji: '🥣',
    requiredIngredients: ['s-oat', 'p-milk', 'se-sugar'],
    steps: [
      '燕麦片倒入锅中',
      '加牛奶，小火边煮边搅',
      '煮至浓稠，加糖调味',
      '可配水果或坚果'
    ],
    cookTimeMinutes: 5,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: true },
    description: '健康饱腹，懒人早餐'
  },
  {
    id: 'dumpling-simple',
    name: '快手煮饺子',
    coverEmoji: '🥟',
    requiredIngredients: ['s-dumpling', 'v-green-onion', 'se-vinegar', 'se-soy', 'se-sesame'],
    steps: [
      '水烧开，下饺子',
      '水开加凉水，重复3次',
      '饺子浮起再煮1分钟捞出',
      '调蘸料：醋+生抽+香油+葱花'
    ],
    cookTimeMinutes: 10,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '速冻食品也能吃得仪式感'
  },
  {
    id: 'spinach-egg',
    name: '菠菜鸡蛋汤',
    coverEmoji: '🍲',
    requiredIngredients: ['v-spinach', 'p-egg', 'v-green-onion', 'se-salt', 'se-oil', 'se-sesame'],
    steps: [
      '菠菜焯水去涩味，挤干切段',
      '鸡蛋打散',
      '锅中水烧开，加少许油',
      '下菠菜煮1分钟',
      '淋蛋液形成蛋花，加盐',
      '撒葱花，滴香油出锅'
    ],
    cookTimeMinutes: 8,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '清淡暖胃，减脂友好'
  },
  {
    id: 'carrot-shrimp',
    name: '胡萝卜炒虾仁',
    coverEmoji: '🦐',
    requiredIngredients: ['p-shrimp', 'v-carrot', 'v-green-onion', 'v-garlic', 'se-soy', 'se-oil', 'se-salt'],
    steps: [
      '虾仁加少许生抽腌制5分钟',
      '胡萝卜切薄片，葱切段',
      '热锅热油，爆香蒜末',
      '下虾仁炒至变色盛出',
      '胡萝卜炒软，虾仁回锅',
      '加盐葱段翻匀出锅'
    ],
    cookTimeMinutes: 12,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '低脂高蛋白，鲜美不腻'
  },
  {
    id: 'corn-fried-rice',
    name: '玉米炒饭',
    coverEmoji: '🌽',
    requiredIngredients: ['s-rice', 'v-corn', 'p-egg', 'v-green-onion', 'se-salt', 'se-oil', 'se-soy'],
    steps: [
      '玉米粒焯水沥干',
      '鸡蛋打散，米饭抓散',
      '热锅热油，炒蛋盛出',
      '炒饭至粒粒分明，加玉米',
      '倒鸡蛋，加生抽盐调味',
      '撒葱花出锅'
    ],
    cookTimeMinutes: 12,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '甜甜糯糯，小朋友超爱'
  },
  {
    id: 'lettuce-salad',
    name: '凉拌生菜',
    coverEmoji: '🥗',
    requiredIngredients: ['v-lettuce', 'v-garlic', 'se-soy', 'se-vinegar', 'se-sesame', 'se-sugar', 'se-salt'],
    steps: [
      '生菜洗净撕小块，沥干水分',
      '大蒜切末',
      '生菜放大碗中，撒蒜末',
      '加生抽+醋+糖+盐+香油',
      '拌匀即可'
    ],
    cookTimeMinutes: 3,
    potCount: 0,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: true },
    description: '3分钟搞定，清爽解腻'
  },
  {
    id: 'bacon-bread',
    name: '培根面包',
    coverEmoji: '🥓',
    requiredIngredients: ['s-bread', 'p-bacon', 'p-cheese', 'p-egg'],
    steps: [
      '面包片用勺子压出凹槽',
      '培根切碎铺在面包上',
      '撒奶酪碎，打入鸡蛋',
      '烤箱180度烤15分钟'
    ],
    cookTimeMinutes: 18,
    potCount: 0,
    dishCount: 1,
    tags: { onePot: false, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '有烤箱就能做的豪华早餐'
  },
  {
    id: 'chili-tofu',
    name: '青椒煎豆腐',
    coverEmoji: '🫑',
    requiredIngredients: ['p-tofu', 'v-chili', 'v-garlic', 'se-soy', 'se-oyster', 'se-oil', 'se-starch'],
    steps: [
      '豆腐切厚片，辣椒切块',
      '调酱汁：生抽+蚝油+淀粉+水',
      '豆腐煎至两面金黄盛出',
      '爆香蒜末辣椒',
      '倒豆腐，淋酱汁翻匀'
    ],
    cookTimeMinutes: 15,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: true },
    description: '微辣开胃，豆腐外脆里嫩'
  },
  {
    id: 'sweet-potato',
    name: '蒸红薯',
    coverEmoji: '🍠',
    requiredIngredients: ['s-sweet-potato'],
    steps: [
      '红薯洗净去皮或不去皮',
      '切成大块',
      '放入蒸锅，水开后蒸20分钟',
      '用筷子能扎透即熟'
    ],
    cookTimeMinutes: 25,
    potCount: 1,
    dishCount: 0,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: true },
    description: '粗粮健康，甜糯饱腹'
  },
  {
    id: 'fish-steam',
    name: '清蒸鱼块',
    coverEmoji: '🐟',
    requiredIngredients: ['p-fish', 'se-ginger', 'v-green-onion', 'se-soy', 'se-sesame', 'se-salt'],
    steps: [
      '鱼块用盐和姜丝腌制10分钟',
      '盘底铺姜丝，放上鱼块',
      '水开后蒸8分钟',
      '倒掉盘中水，铺葱段',
      '淋热油，倒生抽和香油'
    ],
    cookTimeMinutes: 20,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '鲜嫩低脂，原汁原味'
  },
  {
    id: 'tomato-noodle',
    name: '番茄鸡蛋面',
    coverEmoji: '🍅',
    requiredIngredients: ['v-tomato', 'p-egg', 's-noodle', 'v-green-onion', 'se-salt', 'se-sugar', 'se-oil'],
    steps: [
      '番茄去皮切块，鸡蛋打散',
      '热锅热油，炒蛋盛出',
      '炒番茄出汁，加水煮开',
      '下面条煮至半熟',
      '倒鸡蛋，加盐糖调味',
      '撒葱花出锅'
    ],
    cookTimeMinutes: 12,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '经典家常，百吃不厌'
  },
  {
    id: 'celery-beef',
    name: '芹菜炒牛肉',
    coverEmoji: '🥬',
    requiredIngredients: ['v-celery', 'p-beef', 'v-garlic', 'se-soy', 'se-oil', 'se-starch', 'se-salt'],
    steps: [
      '牛肉切片，生抽淀粉抓匀腌10分钟',
      '芹菜切段',
      '热锅热油，滑炒牛肉盛出',
      '爆香蒜末，炒芹菜',
      '牛肉回锅，加盐翻匀'
    ],
    cookTimeMinutes: 18,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: false, lessDishes: true, vegetarian: false },
    description: '脆嫩爽口，经典搭配'
  },
  {
    id: 'sausage-fried-rice',
    name: '火腿炒饭',
    coverEmoji: '🌭',
    requiredIngredients: ['s-rice', 'p-sausage', 'p-egg', 'v-green-onion', 'se-salt', 'se-oil', 'se-soy'],
    steps: [
      '火腿肠切丁，葱切葱花',
      '鸡蛋打散，米饭抓散',
      '热锅热油，炒蛋盛出',
      '炒香肠丁出香味',
      '米饭炒至颗粒分明，加蛋',
      '生抽盐调味，撒葱花'
    ],
    cookTimeMinutes: 10,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '香味扑鼻，一碗满足'
  },
  {
    id: 'bun-fry',
    name: '黄金炒馒头',
    coverEmoji: '🍞',
    requiredIngredients: ['s-bun', 'p-egg', 'v-green-onion', 'se-salt', 'se-oil'],
    steps: [
      '馒头切小丁',
      '鸡蛋打散加盐，裹住馒头丁',
      '热锅热油，倒馒头丁',
      '中小火煎至金黄',
      '撒葱花翻匀出锅'
    ],
    cookTimeMinutes: 8,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '剩馒头的华丽转身'
  },
  {
    id: 'egg-soup',
    name: '紫菜蛋花汤',
    coverEmoji: '🍲',
    requiredIngredients: ['p-egg', 'v-green-onion', 'se-salt', 'se-sesame', 'se-soy'],
    steps: [
      '紫菜撕碎，鸡蛋打散',
      '锅中水烧开',
      '淋蛋液形成蛋花',
      '加盐和少许生抽',
      '放紫菜煮1分钟',
      '撒葱花滴香油出锅'
    ],
    cookTimeMinutes: 5,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '5分钟快手汤，鲜掉眉毛'
  },
  {
    id: 'onion-egg',
    name: '洋葱炒蛋',
    coverEmoji: '🧅',
    requiredIngredients: ['v-onion', 'p-egg', 'se-salt', 'se-soy', 'se-oil'],
    steps: [
      '洋葱切丝，鸡蛋打散',
      '热锅热油，炒蛋盛出',
      '洋葱炒至变软出香',
      '鸡蛋回锅，加盐生抽',
      '翻匀出锅'
    ],
    cookTimeMinutes: 10,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '简单快手，甜香下饭'
  },
  {
    id: 'cheese-toast',
    name: '奶酪吐司',
    coverEmoji: '🧀',
    requiredIngredients: ['s-bread', 'p-cheese', 'p-milk', 'p-egg', 'se-sugar'],
    steps: [
      '鸡蛋加牛奶糖打散',
      '面包片蘸蛋液，两面浸湿',
      '平底锅小火煎至两面金黄',
      '放奶酪片，盖盖焖至融化'
    ],
    cookTimeMinutes: 8,
    potCount: 1,
    dishCount: 1,
    tags: { onePot: true, quickMeal: true, lessDishes: true, vegetarian: false },
    description: '拉丝奶香味，下午茶首选'
  }
];

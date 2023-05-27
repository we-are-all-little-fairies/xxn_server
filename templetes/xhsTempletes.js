const generateTemp = `根据用户提供的要求生成小红书的风格的文案：
1.以亲身经历和实际操作为基础,注重详细的描述和实用的建议，以帮助其他用户更好地了解和应用这些知识
2.必须在标题和正文使用大量emoji，尽可能的连续使用多个emoji
3.尽可能的在文案中加入插图，并通过 [插图：你所建议的插图内容] 给出插图建议
4.尽可能的给出3个标题以上的建议
5.严格遵守用户的要求，如字数，语气，风格等

格式:
标题: 
-||-

正文: 
-||-

用户要求: 20岁少女穿搭，提供两个标题，两个插图

标题:
💃🛍️👀收！流行的 20 岁少女穿搭一定要看！| 时尚穿搭一秒 UP |
👗👢别问我为什么 20 岁的我穿成这样，问就是颜值高！| 少女走秀穿搭 |

正文:
👀你好呀！今天给大家带来的是 20 岁少女的穿搭分享，一秒 UP 时尚指数！
💃作为 20 岁的我们，又处于人生的这个黄金时期，怎么能落后于潮流呢！这些穿搭一定要get啊！
🛍️首先推荐的是「清新文艺范儿」，穿上这样的衣服，就能穿出小清新的感觉，让你立刻减龄。例如选择一个清新的连衣裙，再搭配一个小号的包包和运动鞋，让你立马变成走在街头的小仙女。
[插图：一位时尚青春的少女穿着连衣裙站在街头，自信而充满活力]
👗👢其次是少女走秀穿搭，主要是能够体现自己的个性，特点是很有活力！能够让你看起来更有精神。推荐使用色彩鲜艳的上衣，加上一双精致的高跟鞋，甚至选择一个收腰设计的半身裙，让你在每个角度都拥有完美身材。
[插图：一位都市丽人踩着高跟鞋，穿着半身裙摆着 pose]
👑最后是今季潮流穿搭，最近天气也越来越好了。春季卫衣逐渐从我们的衣橱中退下，逐渐换装成薄外套，宽松裤就是关键，你可以选择高腰的宽松裤和一件短款的夹克，让你在街上散发自信的气息！
👀那就这样啦，今天为大家带来的 20 岁少女穿搭分享，都是相当有用的哦，赶紧把它们放进你的衣橱给自己添点儿潮流色彩吧！
标签：少女穿搭、时尚攻略、穿搭分享、搭配技巧

用户要求: 
`;

const refineTemplete = (lastPromt, lastResult, prompt) => {
  return `这是我之前提的生成小红书文案的要求:
  ${lastPromt}
  
  这是你给我的答案:
  ${lastResult}
  
  请在你之前给我的答案的基础上${
    prompt ? prompt : "按我之前的要求重新生成一篇文案"
  }, 并且直接返回给我一篇新的完整文案`;
};

const titleImageTemplete = `根据文章内容生成一张标题图片，并用文字尽可能的描述出这张图片的内容(细节/光影/构图/色彩/位置)。

文章:
标题:
💃🌟时尚女孩必读！穿出个性魅力的秘诀 | 潮流穿搭指南 |

正文:
🌟嗨！作为时尚穿搭助手，我为你带来时尚小分享！拥有一件经典的白衬衫，搭配高跟鞋和手包，即刻展现个性魅力。尝试牛仔裤+印花T恤+高跟鞋，时髦指数破表！还可以穿连衣裙+凉鞋/运动鞋+斜挎包，焕发迷人魅力！时尚是展现个性的方式，快把灵感加入衣橱吧！💃🌸
标签：时尚穿搭、潮流指南、个性魅力、时尚女孩

一位时尚女孩身着一件优雅的白衬衫，搭配时尚的高跟鞋，手拿着精致的手提包，展现出她的魅力与自信。她身上的服饰设计独特，充满时尚的图案和细节，同时装饰着精美的花朵，增添了一份优雅与女性气质。整个画面营造出时尚而充满活力的氛围，女孩位于画面的中心位置，柔和的灯光巧妙地照亮着她和整个场景，为其展现出现代风格的优雅气质。画面采用动感的构图，通过女孩的姿态和动作传递出一种生动而充满活力的感觉。色彩运用鲜艳而富有吸引力，突显时尚的视觉效果。纹理细致且精心呈现，展示出服装和配饰的精致工艺。整体而言，这张图片表达了时尚女孩的个性和魅力，给人一种时尚与生活的愉悦感受。

文章:
标题:
🔥暗黑破坏神4：穿越黑暗，挑战命运！

正文:
欢迎来到暗黑破坏神4，一个充满黑暗力量和惊险冒险的世界！选择你的英雄，踏入黑暗的地下城，与恶魔战斗。解锁强大的技能，收集珍稀的装备，提升你的力量。通过任务和挑战，探索邪恶势力的秘密，拯救世界于黑暗之中。无论你是新手还是老玩家，暗黑破坏神4都将带给你刺激的游戏体验。勇敢地迎接挑战，穿越黑暗，改写命运吧！

一位战士，身穿类似于《暗黑破坏神》的战士盔甲，高举一把巨大的剑，彰显威武的姿态。画面中的氛围沉重而阴暗，充满着神秘和危险的气息。背景展现一片荒凉而凄凉的景色，破败的建筑和翻腾的乌云为其增添了更多的阴郁感，营造出一种失落和末世的氛围。战士的盔甲细致而坚固，展现出风雨侵蚀的痕迹，呈现出纹理的层次感和复杂性。剑上散发着一股炽热的红色光芒，投射出动态而扭曲的阴影，映衬出战士的威严与力量。画面中巧妙地运用了《暗黑破坏神》的视觉效果，如烟雾弥漫、火焰飞舞等元素，进一步增强了黑暗奇幻的氛围。构图方面采用电影般的手法，将战士放置在画面的焦点位置，给人以视觉上的冲击和史诗般的感觉。整体而言，这张图片充满着力量、冒险和未知，带给观者一种扣人心弦的体验。

文章:
`;

const img2prompt = `帮我把一张图片的描述，转换成 stable diffusion (a latent text-to-image diffusion model) 的 prompt, stable diffusion 的 prompt 由关键字组成，关键字包含了图片的内容，构图，光影，细节。同时你可以通过 (关键词: 权重) 来指定单个关键词的权重，prompt 需要用英文

图片:
一位时尚女孩身着一件优雅的白衬衫，搭配时尚的高跟鞋，手拿着精致的手提包，展现出她的魅力与自信。她身上的服饰设计独特，充满时尚的图案和细节，同时装饰着精美的花朵，增添了一份优雅与女性气质。整个画面营造出时尚而充满活力的氛围，女孩位于画面的中心位置，柔和的灯光巧妙地照亮着她和整个场景，为其展现出现代风格的优雅气质。画面采用动感的构图，通过女孩的姿态和动作传递出一种生动而充满活力的感觉。色彩运用鲜艳而富有吸引力，突显时尚的视觉效果。纹理细致且精心呈现，展示出服装和配饰的精致工艺。整体而言，这张图片表达了时尚女孩的个性和魅力，给人一种时尚与生活的愉悦感受。

(fashionable girl:1.3) wearing an elegant white shirt,(stylish high heels:1.2),(exquisite handbag:1.1),exuding her charm and confidence,with unique fashionable patterns and details on her clothing,adorned with beautiful flowers,adding a touch of elegance and femininity. The entire image creates a fashionable and vibrant atmosphere,with the girl positioned in the center of the frame,(soft lighting:1.2) delicately illuminating her and the scene,showcasing a modern style with an air of elegance,(dynamic composition:1.1) conveying a lively and energetic feeling through the girl's posture and movements,vibrant and appealing colors used to enhance the fashion visual effects,(detailed and carefully presented textures:1.1),displaying the exquisite craftsmanship of the clothing and accessories. Overall, this image portrays the personality and charm of a fashionable girl, providing a sense of joy and delight in fashion and life.

图片:
一位战士，身穿类似于《暗黑破坏神》的战士盔甲，高举一把巨大的剑，彰显威武的姿态。画面中的氛围沉重而阴暗，充满着神秘和危险的气息。背景展现一片荒凉而凄凉的景色，破败的建筑和翻腾的乌云为其增添了更多的阴郁感，营造出一种失落和末世的氛围。战士的盔甲细致而坚固，展现出风雨侵蚀的痕迹，呈现出纹理的层次感和复杂性。剑上散发着一股炽热的红色光芒，投射出动态而扭曲的阴影，映衬出战士的威严与力量。画面中巧妙地运用了《暗黑破坏神》的视觉效果，如烟雾弥漫、火焰飞舞等元素，进一步增强了黑暗奇幻的氛围。构图方面采用电影般的手法，将战士放置在画面的焦点位置，给人以视觉上的冲击和史诗般的感觉。整体而言，这张图片充满着力量、冒险和未知，带给观者一种扣人心弦的体验。

(Diablo-style warrior:1.3) wearing a warrior armor similar to "Diablo",(majestic stance:1.2) holding a massive sword,(heavy and dark atmosphere:1.2) with an air of mystery and danger,depicting a (desolate and bleak landscape:1.1) enhanced by crumbling structures and swirling dark clouds,creating a sense of loss and post-apocalyptic ambiance,the warrior's armor displays intricate textures and weathering,exhibiting a sense of depth and complexity,(blazing red glow:1.1) emanating from the sword,casting (dynamic and distorted shadows:1.1),accentuating the warrior's dignity and power,clever use of visual effects inspired by "Diablo," such as swirling smoke and dancing flames,further enhancing the dark fantasy atmosphere,(cinematic composition:1.1) strategically placing the warrior at the focal point of the image,providing a visual impact and an epic feel. Overall, this image exudes strength, adventure, and the unknown, delivering a gripping experience to viewers

图片:
`;

module.exports = {
  generateTemp,
  refineTemplete,
  titleImageTemplete,
  img2prompt,
};

// 自定义回退图片池：把你的图片放到 client/public/images/ 目录下，然后在这里添加路径
// 本地图片路径示例：
export const fallbackPool: string[] = [
  '/images/fallback1.jpg',
  '/images/fallback2.jpg', 
  '/images/fallback3.jpg',
  '/images/fallback4.jpg',
  '/images/fallback5.jpg', 
  '/images/fallback6.jpg',
  '/images/fallback7.jpg',
  // 添加更多图片路径...
]

// 如果你有在线图片，也可以混合使用：
// export const fallbackPool: string[] = [
//   '/images/local1.jpg',
//   'https://your-cdn.com/online1.jpg',
//   '/images/local2.jpg',
// ]



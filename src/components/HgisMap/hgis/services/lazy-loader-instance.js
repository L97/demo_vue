// 初始化并储存实例
import HMapAPILoader from './lazy-loader'
let lazyLoaderInstance = null
export const initLazyLoader = (config = {}) => {
  if (lazyLoaderInstance) return
  lazyLoaderInstance = new HMapAPILoader(config).load()
}

export { lazyLoaderInstance }

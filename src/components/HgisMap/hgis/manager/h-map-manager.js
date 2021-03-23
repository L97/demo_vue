export default class HMapManager {
  constructor () {
    this._map = null
    this._promiss = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  setMap (map) {
    this._map = map
    this.resolve(this._map)
  }

  getMap () {
    return this._map
  }

  getMapPromiss () {
    return this._promiss
  }
}

// 用于管理多地图（异步）

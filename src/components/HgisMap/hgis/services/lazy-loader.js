
import { initParam } from '../services/init-map-param'
import http from '../utils/request-help'
let DEFAULT_CONFIG = {
  hgis: `/hgis-web/${process.env.NODE_ENV === 'development' ? 'hgis_debug.js' : 'hgis.js'}`,
  theme: '/hgis-web/gisapi/theme/hgis.css'
}
export default class HMapAPILoader {
  constructor (config) {
    this._config = {
      ...DEFAULT_CONFIG,
      ...config
    }
    this._window = window
    this._document = document
  }

  load () {
    if (this._window.HGIS) {
      console.log('hgis loaded')
      return
    }

    let { baseUrl = '', hgis, theme } = this._config

    let script = this._document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.src = baseUrl + hgis

    let link = this._document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = baseUrl + theme

    this._scriptLoadingPromise = new Promise((resolve, reject) => {
      script.onload = () => {
        require('../api/marker')
        require('../api/popup')
        require('../api/clusterTile')
        require('../api/clusterWMSLayer')
        this.fetchConfig().then(res => {
          initParam({ ...res.data, ...this._config })
          setTimeout(() => resolve(window.HGIS), 0)
        }).catch(err => {
          initParam({ ...this._config })
          reject(err)
        })
      }

      script.onerror = (e) => reject(e)
    })

    this._document.head.appendChild(link)
    this._document.head.appendChild(script)

    return this._scriptLoadingPromise
  }

  fetchConfig () {
    return http({
      url: `${this._config.baseUrl || ''}/hgis-services/rest/services/sysConf/getMapParams`,
      type: 'GET'
    })
  }
}

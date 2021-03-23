import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 这里放全局参数
    serverIp: null
  },
  mutations: {
    // 这里是set方法
    SET_SERVER_IP (state, ip) {
      state.serverIp = ip
    }
  },
  getters: {
  }
})

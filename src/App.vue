<template>
  <div id="app">
    <!-- <breadcrumb :data="['mapData', 'firlm', 'prisonDefense', 'editor', 'leetCode', 'zrender']"></breadcrumb> -->
     <el-menu default-active="0" class="el-menu-vertical" @select="gotoApp" :collapse="collapse">
      <el-menu-item index="menu">
        <i class="el-icon-s-unfold"></i>
      </el-menu-item>
      <el-menu-item :index="''+index" v-for="(nav, index) in $router.options.routes" :key="nav.name">
        <i class="el-icon-menu"></i>
        <span slot="title">{{nav.name}}</span>
      </el-menu-item>
     </el-menu>
     <div class="app-content">
       <router-view/>
     </div>
  </div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from './components/Breadcrumb/Breadcrumb'
export default {
  name: 'App',
  components: {
    Breadcrumb
  },
  data () {
    return {
      collapse: false
    }
  },
  methods: {
    getTokenFn () {
      axios({
        method: 'get',
        url: '/ctm01facealarm-web/applySGToken'
      }).then(({data}) => {
        this.$store.commit('SET_SERVER_IP', data.data.serverIp)
      })
    },
    gotoApp (index) {
      if (index === 'menu') {
        this.collapse = !this.collapse
        return
      }
      this.$router.push(this.$router.options.routes[index].path)
    }
  },
  created () {
    const vm = this
    vm.getTokenFn()
    vm.interval = setInterval(vm.getTokenFn, 5 * 60 * 1000)
    console.log(this)
  }
}
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
}
.el-menu-vertical{
  text-align: left;
  height: 100vh;
}
.app-content{
  width: 100%;
  position: relative;
}
</style>

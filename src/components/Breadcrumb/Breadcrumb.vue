<template>
  <div class="breadbrum">
    <el-button class="el-icon-back" size="mini" @click="goback"></el-button>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="i in data" :key="i" :to="{ path: `/${i}` }">{{i}}</el-breadcrumb-item>
    </el-breadcrumb>
    <i class="el-icon-document-copy" data-clipboard-text="hhhhh" @click="copy"></i>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'
export default {
  name: 'Breadcrunb',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    copy () {
      let self = this
      let clipboard = new ClipboardJS('.el-icon-document-copy')
      clipboard.on('success', function () {
        self.$message('复制成功')
      })
      clipboard.on('error', function () {
        self.$message('复制失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.breadbrum{
  height: 20px;
  padding: 10px;
  border-bottom: 1px solid;
  display: flex;
  align-items: center;
  .el-icon-back{
    margin-right: 10px;
  }
  .el-icon-document-copy{
    margin: 0 10px;
  }
}
</style>

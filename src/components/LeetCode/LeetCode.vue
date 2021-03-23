<template>
  <div class="leetcode">
    <el-input v-model="input" icon="el-icon-search" @keyup.enter.native="onSubmit"></el-input>
    result: {{result}}

    <div style="margin-top: 20px">
      <edit-tag :data="tags"></edit-tag>
    </div>

  </div>
</template>

<script>
import EditTag from '../EditTag/EditTag'
export default {
  name: 'LeetCode',
  components: {EditTag},
  data () {
    return {
      input: '',
      result: '',
      tags: [
        { name: '123' },
        { name: '456' }
      ]
    }
  },
  methods: {
    onSubmit () {
      let arr = this.input.split('')
      let length = 0
      for (let i = 0; i < arr.length; i++) {
        // let same = false
        for (let j = i + 1; j < arr.length; j++) {

        }
      }
      this.result = length
    }
  }
}
</script>

<style lang="scss" scoped>
.leetcode{
  padding: 10px;
  .el-input{
    width: 270px;
  }
}
</style>

<template>
  <div class="transfer">
    <div class="transfer-table">
      <el-table ref="tableL" :data="leftNow" style="width: 100%" height="100%" @selection-change="handleSelectionChangeLeft" v-loading="loading">
        <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column label="未选择" :render-header="renderHeaderDateL">
          <template slot-scope="scope">
            <span>{{scope.row.cameraName}}&#12288;({{scope.row.cameraIndexCode}})</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination small layout="prev, pager, next" :page-size="20" :total="page.leftTotal" @current-change="handleCurrentChangeLeft"></el-pagination>
    </div>
    <div class="transfer-bts">
      <el-button class="h-icon-angle_right" size="small" @click="add"></el-button>
      <el-button class="h-icon-angle_left" size="small" @click="remove"></el-button>
    </div>
    <div class="transfer-table">
      <el-table ref="tableR" :data="rightNow" style="width: 100%" height="100%" @selection-change="handleSelectionChangeRight">
        <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column label="已选择"  :render-header="renderHeaderDateR">
          <template slot-scope="scope">
            <span>{{scope.row.cameraName}}&#12288;({{scope.row.cameraIndexCode}})</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination small layout="prev, pager, next" :page-size="20" :total="page.rightTotal" @current-change="handleCurrentChangeRight"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Transfer',
  props: {
    oriData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 选中的值
      selectLeft: [],
      selectRight: [],
      checkedLeft: false,
      checkedRight: false,
      page: {
        leftCurrent: 1,
        leftTotal: 0,
        rightCurrent: 1,
        rightTotal: 0
      },
      loading: false,
      data: []
    }
  },
  methods: {
    add () {
      let self = this
      if (this.selectLeft.length) {
        if (this.checkedLeft) {
          this.data.forEach((i, index) => {
            this.$set(self.data, index, { ...i, type: 'right' })
          })
        } else {
          this.selectLeft.forEach(i => {
            for (let j = 0; j < self.data.length; j++) {
              if (self.data[j].cameraIndexCode === i.cameraIndexCode) {
                this.$set(self.data, j, { ...i, type: 'right' })
                break
              }
            }
          })
        }
        this.checkedLeft = false
        this.$refs.tableL.clearSelection()
      }
    },
    remove () {
      let self = this
      if (this.selectRight.length) {
        if (this.checkedRight) {
          this.data.forEach((i, index) => {
            this.$set(self.data, index, { ...i, type: 'left' })
          })
        } else {
          this.selectRight.forEach(i => {
            for (let j = 0; j < self.data.length; j++) {
              if (self.data[j].cameraIndexCode === i.cameraIndexCode) {
                this.$set(self.data, j, { ...i, type: 'left' })
                break
              }
            }
          })
        }
        this.checkedRight = false
        this.$refs.tableR.clearSelection()
      }
    },
    // 全选
    handleSelectionChangeLeft (val) {
      this.selectLeft = val
    },
    handleSelectionChangeRight (val) {
      this.selectRight = val
    },
    // 当前页
    handleCurrentChangeLeft (val) {
      this.page.leftCurrent = val
    },
    handleCurrentChangeRight (val) {
      this.page.rightCurrent = val
    },
    renderHeaderDateL (h, { column, $index }) {
      return h('div', [
        h('span', '未选择'), h('div', { style: { position: 'absolute', right: '10px', display: 'inline-block', top: '-2px' } }, [
          h('el-checkbox', {
            on: {
              change: () => { this.checkedLeft = !this.checkedLeft }
            },
            props: {
              value: this.checkedLeft
            },
            style: { verticalAlign: 'middle' }
          }),
          h('span', { style: { verticalAlign: 'middle' } }, '全部')
        ])
      ])
    },
    renderHeaderDateR (h, { column, $index }) {
      return h('div', [
        h('span', '已选择'), h('div', { style: { position: 'absolute', right: '10px', display: 'inline-block', top: '-2px' } }, [
          h('el-checkbox', {
            on: {
              change: () => { this.checkedRight = !this.checkedRight }
            },
            props: {
              value: this.checkedRight
            },
            style: { verticalAlign: 'middle' }
          }),
          h('span', { style: { verticalAlign: 'middle' } }, '全部')
        ])
      ])
    }
  },
  computed: {
    leftData () {
      let arr = []
      this.data.forEach(i => {
        if (!i.type || i.type === 'left') {
          arr.push(i)
        }
      })
      return arr
    },
    leftNow () {
      return this.leftData.slice((this.page.leftCurrent - 1) * 20, this.page.leftCurrent * 20)
    },
    rightData () {
      let arr = []
      this.data.forEach(i => {
        if (i.type && i.type === 'right') {
          arr.push(i)
        }
      })
      return arr
    },
    rightNow () {
      return this.rightData.slice((this.page.rightCurrent - 1) * 20, this.page.rightCurrent * 20)
    }
  },
  watch: {
    oriData: {
      handler () {
        this.data = this.oriData
      },
      immediate: true
    },
    leftData: {
      handler () {
        this.page.leftTotal = this.leftData.length
      },
      immediate: true
    },
    rightData: {
      handler () {
        this.page.rightTotal = this.rightData.length
      },
      immediate: true
    },
    checkedLeft () {
      let self = this
      this.leftNow.forEach(i => {
        self.$refs.tableL.toggleRowSelection(i, self.checkedLeft)
      })
    },
    leftNow () {
      let self = this
      this.leftNow.forEach(i => {
        self.$refs.tableL.toggleRowSelection(i, self.checkedLeft)
      })
    },
    checkedRight () {
      let self = this
      this.rightNow.forEach(i => {
        self.$refs.tableR.toggleRowSelection(i, self.checkedRight)
      })
    },
    rightNow  () {
      let self = this
      this.rightNow.forEach(i => {
        self.$refs.tableR.toggleRowSelection(i, self.checkedRight)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer{
  width: 100%;
  height: 100%;
  .transfer-table{
    width: 44%;
    height: 100%;
    display: inline-block;
    .el-table{
      height: calc(100% - 40px);
    }
    .el-pagination{
      height: 40px;
      text-align: center;
      padding: 7px;
      border: 1px solid #eee;
      border-width: 0 1px 1px;
    }
  }
  .transfer-bts{
    display: inline-block;
    padding: 200px 20px 0;
    vertical-align: top;
    .el-button{
      display: block;
      margin: 20px 0;
    }
  }
}
</style>
<style lang="scss">
.el-table{
  td{
    border: 0;
  }
}
</style>

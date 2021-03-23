<template>
  <div class="equipment-manage">
    <div class="search-condition">
      <el-form ref="form" label-position="left" :model="form" label-width="50px" content-width="400px">
        <el-form-item label="hello">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="hello">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="hello">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="hello">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <el-upload class="upload" ref="upload" action="/" :show-file-list="false" :on-change="importExcel" :auto-upload="false">
        <el-button
          slot="trigger"
          icon="el-icon-upload"
          size="small"
          type="primary">
          上传文件
        </el-button>
      </el-upload>
      <el-button>查询</el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="module" label="模块"></el-table-column>
        <el-table-column prop="number" label="用例编号"></el-table-column>
        <el-table-column prop="content" label="测试内容"></el-table-column>
        <el-table-column prop="condition" label="前置条件"></el-table-column>
        <el-table-column prop="step" label="测试步骤"></el-table-column>
        <el-table-column prop="expect" label="预期结果"></el-table-column>
        <el-table-column prop="result" label="预测结果"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'importExcel',
  data () {
    return {
      form: {
        name: ''
      },
      tableData: []
    }
  },
  methods: {
    importExcel (file) {
      const types = file.name.split('.')[1]
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(
        item => item === types
      )
      if (!fileType) {
        alert('格式错误！请重新选择')
        return
      }
      this.file2Xce(file).then(tab => {
        if (tab && tab.length > 0) {
          let num = 10
          let obj = {}
          tab[0].sheet.forEach(item => {
            console.log(item)
            let arr = item.split('=')
            if (parseInt(arr[0].match(/\d+/g)) > 9) {
              if (parseInt(arr[0].match(/\d+/g)) === num) {
                if (arr[0].charAt(0) === 'A') {
                  obj.module = arr[1].substr(1)
                }
                if (arr[0].charAt(0) === 'B') {
                  obj.number = arr[1].substr(1)
                }
                if (arr[0].charAt(0) === 'C') {
                  obj.content = arr[1].substr(1)
                }
                if (arr[0].charAt(0) === 'D') {
                  obj.condition = arr[1].substr(1)
                }
                if (arr[0].charAt(0) === 'E') {
                  obj.step = arr[1].substr(1)
                }
                if (arr[0].charAt(0) === 'F') {
                  obj.expect = arr[1].substr(1)
                }
                if (arr[0].charAt(0) === 'G') {
                  obj.result = arr[1].substr(1)
                  this.tableData.push(obj)
                  obj = {}
                  num++
                }
              }
            }
          })
        }
      })
    },
    file2Xce (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function (e) {
          const data = e.target.result
          this.wb = XLSX.read(data, {
            type: 'binary'
          })
          const result = []
          this.wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_formulae(this.wb.Sheets[sheetName])
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
        // reader.readAsBinaryString(file) // 传统input方法
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.equipment-manage{
  padding: 2%;
  .search-condition{
    padding: 20px;
  }
  .upload{
    display: inline-block;
  }
  .table{
    border-top: 1px solid #eee;
  }
}

.el-form-item{
  width: 45%;
  display: inline-block;
  margin-right: 20px;
}
</style>

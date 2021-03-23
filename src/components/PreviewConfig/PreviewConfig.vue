<template>
  <div id="video-config">
    <div class="apartment-left">
        <el-button type="text" icon="el-icon-edit" style="margin-right:200px" @click="handleEdit('apartment','')">按部门编辑</el-button>
        <el-input placeholder="请输入..." v-model="inputApartment" suffix-icon="el-icon-search"></el-input>
        <el-tree :data="inputApartment?treeSearchData.filter(val => val.name.includes(inputApartment)? val : undefined):treeData"
        ref="tree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        node-key="indexCode"
        default-expand-all
        highlight-current
        class="treeXX">
        </el-tree>
    </div>
    <div class="list-right">
      <div class="actionDiv">
        <el-button type="text" icon="el-icon-edit" style="float:left" @click="handleEdit('select','')">编辑</el-button>
        <el-input placeholder="请输入姓名" v-model="inputName" suffix-icon="el-icon-search" class="searchName"></el-input>
      </div>
      <el-table :data="inputName?tableData.filter(val => val.realName.includes(inputName)? val : undefined):tableData" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="真实姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="preview" label="预览窗口数"></el-table-column>
        <el-table-column prop="playback" label="回放窗口数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
      <el-dialog title="修改XXX" :visible.sync="dialogVisible" width="30%">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="用户名" v-show="isName">{{userName}}</el-form-item>
          <el-form-item label="预览窗口数">
            <el-select v-model="form.preview" placeholder="请选择">
              <el-option
                v-for="item in previewOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="回放窗口数">
            <el-select v-model="form.playback" placeholder="请选择">
              <el-option
                v-for="item in playbackOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewConfig',
  data: function () {
    return {
      // 组织树数据
      treeData: [],
      treeSearchData: [],
      // 选择的树节点的indexCode
      treeSelectCode: '',
      defaultProps: {
        children: 'childDepartments',
        label: 'name'
      },
      // 表格数据
      tableData: [],
      // 勾选表格数据
      multipleSelection: [],
      // 搜索姓名
      inputName: '',
      // 搜索组织树
      inputApartment: '',
      dialogVisible: false,
      isName: false,
      userName: '',
      // 提交数据
      form: {
        preview: '4',
        playback: '4'
      },
      // 编辑类型
      type: '',
      saveDepartment: '',
      saveUserId: '',
      previewOptions: [
        {
          value: '1',
          label: '1'
        }, {
          value: '4',
          label: '4'
        }, {
          value: '9',
          label: '9'
        }, {
          value: '16',
          label: '16'
        }, {
          value: '25',
          label: '25'
        }],
      playbackOptions: [
        {
          value: '1',
          label: '1'
        }, {
          value: '4',
          label: '4'
        }, {
          value: '9',
          label: '9'
        }],
      page: {
        pageSize: 20,
        currentPage: 1,
        total: 0
      }
    }
  },
  methods: {
    // 获取列表
    getTableList () {
      const axios = require('axios')
      let self = this
      axios.post('http://15.202.12.3:8094/loginsecure/config/getUsersByDeptIndexCode', {
        deptIndexCodes: self.treeSelectCode,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      })
        .then(function (res) {
          self.tableData = res.data.data.list
          self.page.total = res.data.data.total
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 点击组织树
    handleNodeClick (data) {
      this.treeSelectCode = data.indexCode
      console.log(this.$refs.tree)
      this.getTableList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 点击编辑
    handleEdit (index, row) {
      // 按部门编辑
      if (index === 'apartment') {
        this.type = 'apartment'
        this.dialogVisible = true
        this.isName = false
        this.form.preview = '4'
        this.form.playback = '4'
        this.saveDepartment = ''
      } else if (index === 'select') {
        // 批量编辑
        if (this.multipleSelection.length > 0) {
          this.type = 'select'
          this.isName = false
          this.form.preview = '4'
          this.form.playback = '4'
          this.dialogVisible = true
          let apartmentArr = []
          this.multipleSelection.forEach((val, index) => {
            if (index === 0) {
              apartmentArr.push(val.deptIndexCode)
            }
            apartmentArr.forEach(i => {
              if (i !== val.deptIndexCode) {
                apartmentArr.push(val.deptIndexCode)
              }
            })
          })
          this.saveDepartment = apartmentArr.join(',')
          let arr = []
          this.multipleSelection.forEach(val => {
            arr.push(val.userId)
          })
          this.saveUserId = arr.join(',')
        } else {
          this.$message('请选择至少一条记录！')
        }
      } else {
        // 编辑用户
        this.dialogVisible = true
        this.type = 'user'
        this.isName = true
        this.saveUserId = row.userId
        this.saveDepartment = row.deptIndexCode
        const axios = require('axios')
        let self = this
        axios.get('http://15.202.12.3:8094/loginsecure/config/getUserConfigByUserId', {
          params: {
            userId: row.userId
          }
        })
          .then(function (res) {
            if (res.data.data != null) {
              self.form.preview = res.data.data.preview
              self.form.playback = res.data.data.playback
            } else {
              self.form.preview = '4'
              self.form.playback = '4'
            }
            self.userName = row.realName
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    // 提交
    submit () {
      const axios = require('axios')
      let self = this
      if (this.type === 'apartment') {
        axios.post('http://15.202.12.3:8094/loginsecure/config/updateConfigByDepart', {
          preview: self.form.preview,
          playback: self.form.playback,
          departmentIndexcodes: self.treeSelectCode
        })
          .then(function (res) {
            self.dialogVisible = false
            self.getTableList()
            this.$message('保存成功！')
          })
          .catch(function (error) {
            console.log(error)
          })
      } else if (this.type === 'select') {
        axios.post('http://15.202.12.3:8094/loginsecure/config/updateUserConfig', {
          userids: self.saveUserId,
          preview: self.form.preview,
          playback: self.form.playback,
          departmentIndexcode: self.saveDepartment
        })
          .then(function (res) {
            self.dialogVisible = false
            self.getTableList()
            this.$message('保存成功！')
          })
          .catch(function (error) {
            console.log(error)
          })
      } else {
        axios.post('http://15.202.12.3:8094/loginsecure/config/saveUserConfig', {
          userids: self.saveUserId,
          preview: self.form.preview,
          playback: self.form.playback,
          departmentIndexcode: self.saveDepartment
        })
          .then(function (res) {
            self.dialogVisible = false
            self.getTableList()
            this.$message('保存成功！')
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getTableList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getTableList()
    },
    getTreeData (item) {
      for (let i = 0; i < item.length; i++) {
        this.treeSearchData.push({
          name: item[i].name,
          indexCode: item[i].indexCode,
          children: []
        })
        if (item[i].childDepartments.length > 0) {
          var oChild = item[i].childDepartments
          this.getTreeData(oChild)
        }
      }
    }
  },
  created () {
    let url = window.location.href
    let regex = /.*\:\/\/([^\/]*).*/
    let match = url.match(regex)
    let baseUrl = ''
    if (typeof match !== 'undefined' && match !== null) {
      baseUrl = match[1]
    }
    const axios = require('axios')
    let self = this
    axios.get('http://' + baseUrl + '/loginsecure/config/findAllTree')
      .then(function (res) {
        self.treeData.push(res.data.data)
        self.treeSelectCode = res.data.data.indexCode
        // self.$refs.tree.setCurrentKey(res.data.data.indexCode)
        self.getTableList()
        self.treeSearchData.push({
          name: res.data.data.name,
          indexCode: res.data.data.indexCode,
          children: []
        })
        // this.$refs.tree.setCurrentKey(res.data.data.indexCode)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.$refs.tree.setCurrentKey(this.treeSelectCode)
    //   console.log(this.$refs.tree)
    // })
  }
}
</script>

<style lang="scss" scoped>
#video-config{
  display: flex;
  min-height: calc(100vh - 40px);
  position: relative;
}
.apartment-left{
  padding: 10px;
  display: inline-block;
  width: 300px;
  min-height: calc(100vh - 40px);
  border-right: 1px solid #eee;
}
.list-right{
  padding: 10px;
  display: inline-block;
  width: calc(100% - 400px);
  min-height: calc(100vh - 40px);
}
.searchName{
  width: 200px;
  float: right;
}
.el-pagination{
  position: absolute;
  bottom: 20px;
}
.el-table{
  margin-bottom: 50px;
}
.treeXX{
  div{
    background-color: #f0f7ff;
  }
}
</style>

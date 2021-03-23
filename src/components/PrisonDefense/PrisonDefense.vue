<template>
  <div class="prison-defense">
    <div class="time-templates">
      <div class="template-item" v-for="item in templates" :key="item.templateIndexCode"
      @click="clickTemp(item.templateIndexCode)" :class="item.selected?'template-item-selected':''">{{item.templateName}}</div>
      <div class="template-item template-item-add" @click="showAdd = true">
        <span class="el-icon-plus" v-show="!showAdd"></span>
        <el-input v-show="showAdd" class="addInput" v-model="inputName"></el-input>
        <el-button v-show="showAdd" size="mini" type="primary" @click="addType">确定</el-button>
        <el-button v-show="showAdd" @click="addCancel" size="mini">取消</el-button>
      </div>
    </div>
    <div class="time-template-content">
      <div class="timeTable">
        <div class="hourText" v-for="t in hours" :key="t">{{t}} ﹀</div>
        <div v-for="i in 7" :key="i" class="day">
          <div class="text">星期{{oneToOne[i-1]}}</div>
          <div v-for="j in 24" :key="j" class="hour" @click="openDialog($event,i,j,'','hour')" :style="{'background':i===2||i===4||i===6?'#f5f5f5':'#fff'}">
            <div v-for="(item,index) in data[i-1]" :key="item.indexCode" class="range"
              v-show="parseInt(item.startTime.substring(0,2)) + 1===j"
              :style="{'width':range(i,j,index)}"
              @click="openDialog($event,i,j,range(i,j,index),'range')">
              {{item.startTime.substring(0,5) + ' ~ ' + item.endTime.substring(0,5)}}
              <i class="el-icon-close" @click="remove($event,item.indexCode,i)"></i>
            </div>
          </div>
          <span class="delete el-icon-delete" @click="remove($event, '', i)"></span>
        </div>
      </div>
    </div>
    <el-dialog title="编辑时间配置" :visible.sync="dialogVisible" width="500px">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="上报时间">
          <el-col :span="11">
            <el-time-select v-model="form.startTime" style="width: 100%;"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              maxTime: form.endTime
            }"></el-time-select>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-select v-model="form.endTime" style="width: 100%;"
            :picker-options="{
              start: form.startTime,
              step: '01:00',
              end: '24:00',
              minTime: form.startTime
            }"></el-time-select>
          </el-col>
        </el-form-item>
        <el-form-item label="重复">
          <el-checkbox-group v-model="form.day">
            <el-checkbox label="每周一"></el-checkbox>
            <el-checkbox label="每周二"></el-checkbox>
            <el-checkbox label="每周三"></el-checkbox>
            <el-checkbox label="每周四"></el-checkbox>
            <el-checkbox label="每周五"></el-checkbox>
            <el-checkbox label="每周六"></el-checkbox>
            <el-checkbox label="每周日"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRule">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PrisonDefense',

  data () {
    return {
      // 模板类型
      templates: [],
      hours: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '23:00', '24:00'],
      oneToOne: ['一', '二', '三', '四', '五', '六', '日'],
      showAdd: false,
      dialogVisible: false,
      // 模板时间
      data: [],
      form: {
        startTime: '',
        endTime: '',
        day: []
      },
      // 添加模板名字
      inputName: '',
      // 当前模板类型
      templateIndexCode: ''
    }
  },
  methods: {
    // 获取类型
    getType () {
      const axios = require('axios')
      let self = this
      axios.get(' http://10.19.171.20:8899/mock/5dd6b45c21cc0924d498fd69/123/get.do')
        .then(res => {
          this.templates = res.data.data
          this.templates.forEach((val, index) => {
            if (index === 0) {
              self.templateIndexCode = val.templateIndexCode
              val.selected = true
            } else { val.selected = false }
          })
        })
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve(this.templates)
        }, 1000)
      })
    },
    // 获取数据
    getData () {
      const axios = require('axios')
      axios.get(' http://10.19.171.20:8899/mock/5dd6b45c21cc0924d498fd69/123/getTimeTemp', {
        params: {
          templateIndexCode: this.templateIndexCode
        }
      }).then(res => {
        this.data[0] = res.data.data.monday
        this.data[1] = res.data.data.tuesday
        this.data[2] = res.data.data.wednesday
        this.data[3] = res.data.data.thursday
        this.data[4] = res.data.data.friday
        this.data[5] = res.data.data.saturday
        this.data[6] = res.data.data.sunday
      })
    },
    // 选择模板
    clickTemp (templateIndexCode) {
      this.templates.forEach(val => {
        if (val.templateIndexCode === templateIndexCode) {
          val.selected = true
        } else { val.selected = false }
      })
      this.templateIndexCode = templateIndexCode
      this.getData()
    },
    // 取消添加模板
    addCancel (e) {
      e.stopPropagation()
      this.showAdd = false
    },
    // 打开添加对话框
    openDialog (e, i, j, range, type) {
      this.form.day = []
      this.form.day.push('每周' + this.oneToOne[i - 1])
      this.form.startTime = j > 10 ? (j - 1) + ':00' : '0' + (j - 1) + ':00'
      if (type === 'range') {
        e.stopPropagation()
        console.log(range.substring(12, 14))
        this.form.endTime = (parseInt(range.substring(12, 14)) + j - 1) > 9 ? (parseInt(range.substring(12, 14)) + j - 1) + ':00' : '0' + (parseInt(range.substring(12, 14)) + j - 1) + ':00'
      } else {
        this.form.endTime = j === 24 ? '24:00' : j > 8 ? j + 1 + ':00' : '0' + (j + 1) + ':00'
      }
      this.dialogVisible = true
    },
    // 添加模板
    addRule () {
      const axios = require('axios')
      let self = this
      let week = []
      this.form.day.forEach(val => {
        self.oneToOne.forEach((i, index) => {
          if (i === val.charAt(2)) {
            week.push(index + 1)
          }
        })
      })
      axios.post(' http://10.19.171.20:8899/mock/5dd6b45c21cc0924d498fd69/123/addRule.do', {
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        weekday: week.join(','),
        templateIndexCode: this.templateIndexCode
      }).then(res => {
        this.dialogVisible = false
      }).catch()
    },
    // 删除
    remove (e, code, week) {
      e.stopPropagation()
      if (code) {
        this.$confirm('确认删除当前时间配置？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const axios = require('axios')
          axios.post(' http://10.19.171.20:8899/mock/5dd6b45c21cc0924d498fd69/123/deleteRule.do', {
            templateIndexCode: this.templateIndexCode,
            indexCode: code,
            weekday: week
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$confirm('确认删除当天时间配置？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const axios = require('axios')
          axios.post(' http://10.19.171.20:8899/mock/5dd6b45c21cc0924d498fd69/123/deleteByWeekday.do', {
            templateIndexCode: this.templateIndexCode,
            weekday: week
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 添加模板类型
    addType () {
      const axios = require('axios')
      axios.get(' http://10.19.171.20:8899/mock/5dd6b45c21cc0924d498fd69/123/addType', {
        params: {
          name: this.inputName
        }
      }).then()
    },
    range (i, j, index) {
      let str = ''
      if (this.data[i - 1] && this.data[i - 1].length) {
        let sub = parseInt(this.data[i - 1][index].endTime.substring(0, 2)) - parseInt(this.data[i - 1][index].startTime.substring(0, 2))
        str = 'calc(100% * ' + sub + ' + ' + (sub + 1) + 'px)'
      }
      return str
    }
  },
  created () {
    this.getType().then(res => {
      this.getData()
    })
  }
}
</script>

<style lang="scss" scoped>
.prison-defense{
  background: #f4f4f4;
  display: flex;
  .time-templates{
    background: #fff;
    width: 300px;
    min-height: 100vh;
    padding: 5px;
    .template-item{
      cursor: pointer;
      height: 48px;
      border: 1px solid #e5e5e5;
      line-height: 48px;
      text-align: left;
      text-indent: 20px;
      margin-bottom: 10px;
      .addInput{
        width: 110px;
        margin-right: 10px;
      }
    }
    .template-item-add{
      text-align: center;
      text-indent: 0;
      border: 1px dotted #e5e5e5;
    }
    .template-item-selected{
      color: #fff;
      background-image: linear-gradient(to right, #66e0f8 , #2f94f7);
    }
  }
  .time-template-content{
    background: #fff;
    min-height: 100vh;
    width: 100%;
    margin: 10px;
    .timeTable{
      height: 60%;
      padding: 30px;
      margin-top: 30px;
      .hourText{
        display: inline-block;
        width: 3.9%;
        margin-bottom: 10px;
      }
      .day{
        height: 10%;
        display: flex;
        .text{
          line-height: 320%;
          margin-right: 20px;
        }
        .hour{
          cursor: pointer;
          width: 3.6%;
          height: 100%;
          border: 1px dotted #e5e5e5;
          border-right: 0;
          display: inline-block;
          &:last-of-type{
            border-right: 1px dotted #e5e5e5;
          }
          &:hover{
            background: #ddd!important;
            .range{
              .el-icon-close{
                display: inline;
              }
            }
          }
          .range{
            position: relative;
            z-index: 12;
            height: 100%;
            background: rgb(157, 230, 198);
            line-height: 400%;
            font-size: 12px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .el-icon-close{
              cursor: pointer;
              display: none;
              position: absolute;
              top: 0;
              left: 0;
              font-size: 18px;
            }
          }
        }
        .delete{
          cursor: pointer;
          width: 20px;
          height: 20px;
          margin-top: 1.7%;
          margin-left: 20px;
        }
      }
    }
  }
}
.el-button--mini{
  padding: 7px 7px;
}
</style>

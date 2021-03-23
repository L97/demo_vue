<template>
  <div class="edit-tag">
    <div class="edit-tag_item" v-for="(i,index) in tags" :key="i.name">
      <el-input v-if="i.edit"
        v-model="i.name"
        size="mini"
        clearable
        suffix-icon="h-icon-search"
        :on-icon-click="handle('submit', index)">
      </el-input>

      <div class="edit-tag_item--tag" v-show="!i.edit" :style="`width:${width}px`">
        {{i.name}}
        <el-button icon="h-icon-edit" v-show="editable" @click="clickEdit(index)"></el-button>
        <el-button icon="h-icon-close_sm" @click="handle('delete', index)"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditTag',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 120
    },
    data: {
      type: Array
    }
  },
  data () {
    return {
      tags: []
    }
  },
  created () {
    this.tags = this.data
  },
  methods: {
    handle (type, index) {
      // do something
      this.$emit('change', this.tags)
    },
    clickEdit (index) {
      this.tags.forEach((i, index1) => {
        i.edit = index === index1
      })
    }
  }
}
</script>

<style lang="scss">
.edit-tag{
  &_item{
    &--tag{
      height: 30px;
      border: 1px solid #eee;
    }
  }
}
</style>

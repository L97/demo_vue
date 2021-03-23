<template>
  <div class="editor">
    <el-button @click="getContent">打印内容</el-button>
    <quill-editor v-model="content" ref="editor" :options="editorOption" @blur="onEditorBlur()" @focus="onEditorFocus()" @change="onEditorChange()">
      <div slot="toolbar"></div>
    </quill-editor>
  </div>
</template>
<script>
// import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'Editor',
  data () {
    return {
      content: null,
      editorOption: {
        placeholder: '请输入内容...'
      }
    }
  },
  methods: {
    onEditorBlur () {

    },
    onEditorFocus () {
    },
    onEditorChange () {
    },
    getContent () {
      console.log(this.$refs.editor)
    }
  },
  mounted () {
    // console.log(this.$refs.editor)
  }
}
</script>

<style lang="scss" scoped>
.editor{
  margin: 20px;
  .quill-editor{
    height: 400px;
    width: 1200px;
  }
}
</style>

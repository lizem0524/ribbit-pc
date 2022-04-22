<template>
  <div class="xtx-pagination">
    <!-- 上一页 -->
    <a v-if="myCurrentPage > 1" @click="myCurrentPage--" href="javascript:;">上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <!-- 第一页 -->
    <a v-if="pager.start > 2" @click="myCurrentPage = 1" href="javascript:;">1</a>
    <!-- 左··· -->
    <span v-if="pager.start > 1" @click="myCurrentPage = pager.start - 1">...</span>
    <!-- 页码按钮 -->
    <a href="javascript:;" :class="{ active: myCurrentPage === i }" v-for="i in pager.btnArr" :key="i" @click="myCurrentPage = i">{{ i }} </a>
    <!-- 右···  -->
    <span v-if="pager.end < pager.pageCount" @click="myCurrentPage = pager.end + 1">...</span>
    <!-- 最后一页 -->
    <!-- <a v-if="pager.end < pager.pageCount - 1" @click="myCurrentPage = pager.pageCount" href="javascript:;">最后一页</a> -->
    <!-- 下一页 -->
    <a v-if="myCurrentPage < pager.pageCount" @click="myCurrentPage++" href="javascript:;">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    // 自定义的3条数据，父组件传值来时会自动改变(因下方有watch，此处仅有声明功能)
    const myCurrentPage = ref(1) // 当前页码
    const myTotal = ref(100) // 总条数
    const myPageSize = ref(10) // 每页条数
    // 按钮个数
    const count = 5
    // 根据以上数据计算不同情况的按钮展示
    const pager = computed(() => {
      const pageCount = Math.ceil(myTotal.value / myPageSize.value) // 总页码数
      const offset = Math.floor(count / 2) // 起始按钮偏移
      // 确定起始页码
      let start = myCurrentPage.value - offset < 1 ? 1 : myCurrentPage.value - offset
      // 根据起始页码确定结束页码
      let end = start + count - 1
      // 结束页码超出最大值时要固定为最大值，再逆推start
      if (end > pageCount) {
        end = pageCount
        start = end - count + 1 < 1 ? 1 : end - count + 1
      }
      // 根据start和end按钮拿到按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return {
        pageCount, // 总页码数
        btnArr, // 按钮数组
        start,
        end
      }
    })
    // 监听传入的值，赋值给组件内数据
    watch(props, () => {
      myTotal.value = props.total
      myCurrentPage.value = props.currentPage
      myPageSize.value = props.pageSize
    }, { immediate: true })
    // 监听当前myCurrentPage的变化，双向绑定返还给父组件
    watch(myCurrentPage, () => {
      emit('update:currentPage', myCurrentPage.value)
      emit('changePage', myCurrentPage.value)
    })
    return { myCurrentPage, pager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
      cursor: pointer;
    }
  }
}
</style>

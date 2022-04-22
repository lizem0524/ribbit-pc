<template>
  <!-- 收货地址 -->
  <div class="address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-else>
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact.replace(/^(\d{3})\d*(\d{4})$/,'$1****$2') }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation }} {{ showAddress.address }}</li>
      </ul>
      <a v-if="showAddress && showAddress.isDefault === 1" @click="setToDefault" href="javascript:;">设为默认</a>
      <span v-if="showAddress && showAddress.isDefault === 0" class="morendizhi">默认地址</span>
      <a @click="openEditAddress(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" v-if="showAddress" @click="openDialog">切换地址</XtxButton>
      <XtxButton class="btn" @click="openEditAddress({})">添加地址</XtxButton>
    </div>
  </div>
  <!-- 切换地址弹出层 -->
  <XtxDialog title="切换收货地址" v-model:visible="visible" @close="btnCancel">
    <div :class="{ active: currStyle && currStyle.id === item.id }" class="text item" v-for="item in addressList" :key="item.id" @click="currStyle = item">
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li><span>联系方式：</span>{{ item.contact }}</li>
        <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g, '') }}{{ item.address }}</li>
        {{
          item.isDefault
        }}
      </ul>
      <span v-show="item.isDefault === 0">默认地址</span>
      <a @click.stop="deleteUserAddress(item.id)" class="delete">删除</a>
    </div>
    <template #footer>
      <XtxButton type="gray" style="margin-right: 20px" @click="btnCancel">取消</XtxButton>
      <XtxButton type="primary" @click="AddressOk">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加和编辑地址弹层组件 -->
  <AddressEdit @success-edit="successEditHandler" @success-add="successAddHandler" ref="addressEditCom" />
</template>

<script>
import { computed, inject, ref, watch } from 'vue'
import AddressEdit from './address-edit'
import { deleteAddress, editAddress } from '@/api/checkout'
import Message from '@/components/Message'
import Confirm from '@/components/Confirm'
export default {
  name: 'CheckoutAddress',
  components: { AddressEdit },
  props: {
    addressList: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    // 初始化时拿默认地址
    const defaultAddress = computed(() => props.addressList.find(item => item.isDefault === 0))
    // 显示的地址，也是传给父组件的地址。
    const showAddress = ref(null)
    // 初始化时显示默认或第一个
    showAddress.value = defaultAddress.value || props.addressList[0]
    // 切换地址时控制点击样式的变量
    const currStyle = ref(null)

    // 切换地址弹出层开关
    const visible = ref(false)

    // 弹出切换地址
    const openDialog = () => {
      currStyle.value = showAddress.value // 打开时默认选中当前地址
      visible.value = true
    }
    // 取消按钮
    const btnCancel = () => {
      visible.value = false
    }
    // 确认切换地址
    const AddressOk = () => {
      showAddress.value = currStyle.value // 确认时实际地址修改为选中
      visible.value = false
    }
    // 拉取列表函数
    const getOrder = inject('getOrder')

    // 设为默认地址
    const setToDefault = async () => {
      const newList = props.addressList.map(item => {
        item.isDefault = 1
        if (item.id === showAddress.value.id) {
          item.isDefault = 0
        }
        return item
      })
      newList.map(item => {
        return editAddress(item)
      })
      await Promise.all(newList)
      // console.log(props.addressList)
      console.log('默认成功')
    }
    // 删除按钮
    const deleteUserAddress = async id => {
      try {
        await Confirm({ title: '删除地址', text: '确定删除该地址吗？' })
        await deleteAddress(id)
        await getOrder()
        Message({ type: 'success', text: '删除成功' })
        // 判断当前地址是否被删除
        const oldAddress = props.addressList.findIndex(item => showAddress.value.id === item.id)
        if (oldAddress < 0) {
          showAddress.value = defaultAddress.value || props.addressList[0]
          currStyle.value = showAddress.value
        }
        // 判断地址列表是否为空
        if (props.addressList.length === 0) {
          visible.value = false
          showAddress.value = null
          currStyle.value = null
        }
      } catch (e) {}
    }

    // 添加和编辑弹层组件实例
    const addressEditCom = ref(null)
    // 打开添加和编辑的弹层
    const openEditAddress = address => {
      addressEditCom.value.open(address)
    }

    // 添加地址成功后
    const successAddHandler = async () => {
      await getOrder()
      if (props.addressList.length === 1) {
        showAddress.value = props.addressList[0]
        Message({ type: 'success', text: '添加成功' })
      }
    }
    // 修改地址成功后
    const successEditHandler = async () => {
      await getOrder()
      showAddress.value = props.addressList.find(item => item.id === showAddress.value.id)
      Message({ type: 'success', text: '修改成功' })
    }
    // 监听当前地址的变化，传递给父组件

    watch(
      () => showAddress.value,
      newVal => {
        emit('change', newVal ? newVal.id : null)
      },
      { immediate: true }
    )

    return {
      showAddress,
      visible,
      currStyle,
      openDialog,
      AddressOk,
      btnCancel,
      addressEditCom,
      openEditAddress,
      successEditHandler,
      successAddHandler,
      deleteUserAddress,
      setToDefault
    }
  },
  emits: ['change']
}
</script>

<style lang="less" scoped>
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    position: relative;
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      position: relative;
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      .delete {
        position: absolute;
        font-size: 14px;
        right: 12px;
        top: 73px;
        &:hover {
          color: @xtxColor;
        }
      }

      > span {
        position: absolute;
        font-size: 8px;
        right: 5px;
        top: 0;
        color: @xtxColor;
      }
      &.active {
        background: lighten(@xtxColor, 50%);
      }
      &.active,
      &:hover {
        border-color: @xtxColor;
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.morendizhi {
  position: absolute;
  top: -20px;
  left: 0px;
  font-size: 10px;
  color: @xtxColor;
  border: 1px solid @xtxColor;
  padding: 1px;
}
</style>

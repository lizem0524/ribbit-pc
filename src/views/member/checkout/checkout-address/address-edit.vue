<template>
  <XtxDialog :title="formData.id? '修改收货地址':'添加收货地址'" v-model:visible="editVisible" @close="btnCancel">
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity :fullLocation="formData.fullLocation" @change="cityChange" placeholder="请选择所在地区" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right: 20px" @click="btnCancel">取消</XtxButton>
      <XtxButton type="primary" @click="btnOk">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '@/api/checkout'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    // 弹层开关
    const editVisible = ref(false)

    // 定义表单数据对象
    const formData = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 1,
      // 城市组件显示文字（完整行政区地址）
      fullLocation: null
    })

    // 城市组件选择完毕赋值给表单
    const cityChange = city => {
      formData.provinceCode = city.provinceCode
      formData.cityCode = city.cityCode
      formData.countyCode = city.countyCode
      formData.fullLocation = city.fullLocation
    }

    // 打开函数
    const open = (address) => {
      // 判断是否为修改地址
      if (address) {
        for (const key in address) {
          formData[key] = address[key]
        }
      }
      editVisible.value = true
    }
    // 弹层取消 叉号
    const btnCancel = () => {
      editVisible.value = false
      // 清空数据，注意默认地址代码 1为非默认
      for (const key in formData) {
        formData[key] = null
      }
      formData.isDefault = 1
    }
    // 弹层确认
    const btnOk = async () => {
      if (formData.id) {
        await editAddress(formData) // 调用修改接口，提交表单
        emit('success-edit')
      } else {
        await addAddress(formData) // 调用添加接口，提交表单
        emit('success-add')
      }
      btnCancel()
    }
    return { editVisible, open, btnCancel, btnOk, formData, cityChange }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>

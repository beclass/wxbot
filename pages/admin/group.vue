<template>
  <div>
    <a-card style="margin-bottom:10px">共{{groups.length}}个群聊</a-card>
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in groups" :key="item._id">
        <a-card :bordered="false">
          <a-card-meta :title="item.topic" :description="item.memberIdList.length+'人'">
            <a-avatar slot="avatar" :src="item.avatar" />
          </a-card-meta>
          <template class="ant-card-actions" slot="actions">
            <span>{{item.autojoin?'已开启':'已关闭'}}自动加群</span>
            <a-icon type="setting" key="setting" @click="showSetting(item)" />
          </template>
        </a-card>
      </a-col>
    </a-row>
    <a-modal title="设置" v-model="visible" @ok="save" :maskClosable="false">
      <a-form-model ref="temp" :model="temp" :labelCol="{span:5}" :wrapperCol="{span:19}">
        <a-form-model-item label="入群欢迎语">
          <a-textarea v-model="temp.roomJoinReply" />
        </a-form-model-item>
        <a-form-model-item label="开启自动加群">
          <a-switch
            checkedChildren="打开"
            :checked="temp.autojoin"
            unCheckedChildren="关闭"
            @change="(e)=>this.temp.autojoin=e"
          />
        </a-form-model-item>
        <div>
          <a-icon type="question-circle" />打开自动加群，当机器人收到 "加群" 消息后，会回复该群名称。
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="javascript">
import Vue from "vue";
export default Vue.extend({
  layout: "admin",
  data() {
    return {
      visible: false,
      groups: [],
      temp: {}
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      let res = await this.$axios.$get("/admin/group");
      if (res) this.groups = res;
    },
    async save() {
      const { _id, ...vals } = this.temp;
      const res = await this.$axios.$put("/admin/group/" + _id, vals);
      if (res) {
        this.initData();
        this.visible = false;
        this.$notification.success({
          message: "操作提示",
          description: "设置成功"
        });
      }
    },
    showSetting(item) {
      this.temp = {
        _id: item._id,
        autojoin: item.autojoin,
        roomJoinReply: item.roomJoinReply
      };
      this.visible = true;
    }
  }
});
</script>

<style scoped>
.container {
  height: 100%;
}
.ant-form-item-control {
  line-height: 0px;
}
</style>
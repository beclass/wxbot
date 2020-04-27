<template>
  <a-card>
    <a-empty v-if="!robot" description="未绑定机器人">
      <a-button type="primary" @click="e=>this.visible=true">添加</a-button>
    </a-empty>
    <div v-else>
      <a-row>
        <a-col :span="12" class="rInfo">
          <p>
            <span class="name">{{robot.nickName}}</span>
            <a-icon type="edit" @click="()=>{this.temp = this.robot,this.visible=true}" />
          </p>
          <p>
            <span class="title">上次登录时间：</span>
            <span v-if="robot.lastLoginT">{{ robot.lastLoginT | toDate }}</span>
            <span v-else>未登录</span>
          </p>
          <p>
            <span class="title">启动提示语：</span>
            {{robot.startSay}}
          </p>
          <p>
            <span class="title">知识盲区回复：</span>
            {{robot.unknownSay}}
          </p>
          <p>
            <span class="title">好友验证自动通过关键字：</span>
            <a-tag
              v-for="(item,index) in robot.addFriendKeywords"
              :key="index"
              color="pink"
            >{{item}}</a-tag>
          </p>
        </a-col>
        <a-col :span="12" style="text-align:right">
          <a-switch
            checkedChildren="开启"
            :checked="robot.status==1?true:false"
            unCheckedChildren="关闭"
            @change="onChangeRobot"
          />
        </a-col>
      </a-row>
      <a-modal
        title="微信扫码登录(登录10秒后自动更新状态...)"
        v-model="showQrcode"
        :footer="null"
        :maskClosable="false"
        :width="460"
      >
        <div style="text-align:center">
          <img :src="`/api/robot/login?id=${robot._id}`" />
        </div>
      </a-modal>
    </div>
    <a-modal :title="robot?'修改机器人':'添加机器人'" v-model="visible" @ok="handleOk">
      <a-form-model
        ref="temp"
        :model="temp"
        :rules="rules"
        :labelCol="{span:6}"
        :wrapperCol="{span:18}"
      >
        <a-form-model-item label="机器人名称" prop="nickName" ref="nickName">
          <a-input v-model="temp.nickName" />
        </a-form-model-item>
        <a-form-model-item label="启动提示语">
          <a-input v-model="temp.startSay" />
        </a-form-model-item>
        <a-form-model-item label="知识盲区回复">
          <a-input v-model="temp.unknownSay" />
        </a-form-model-item>
        <a-form-model-item label="好友通过关键字">
          <a-select
            mode="tags"
            style="width: 100%"
            v-model="temp.addFriendKeywords"
            @change="onKeyChange"
            placeholder="好友验证自动通过关键字，最多3个"
          ></a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script lang="javascript">
import Vue from "vue";
const rules = {
  nickName: [{ required: true, message: "名称不能为空", trigger: "blur" }]
};
export default Vue.extend({
  layout: "admin",
  data() {
    return {
      robot: null,
      visible: false,
      showQrcode: false,
      loginQrcode: null,
      temp: {
        startSay: "Hello, robot has started",
        unknownSay: "你在说什么，我听不懂",
        addFriendKeywords: ["加群"]
      },
      rules,
      timer: false, //启动定时
      timerTask: 0, //定时任务
      refreshCount: 0
    };
  },
  asyncData() {},
  created() {
    this.initData();
  },
  methods: {
    handleOk() {
      this.$refs.temp.validate(valid => {
        if (!valid) return;
        this.save(this.temp);
      });
    },
    async initData() {
      let res = await this.$axios.$get("/admin/robot");
      if (res) {
        this.robot = res;
        if (res.status == 1 && this.showQrcode) {
          this.showQrcode = false;
          this.$notification.success({
            message: "登录提示",
            description: "机器人登录成功"
          });
        }
      }
    },
    async save(formData) {
      formData.addFriendKeywords.slice(0, 3);
      const { _id, ...vals } = formData;
      let res = false;
      if (_id) {
        res = await this.$axios.$put("/admin/robot/" + _id, vals);
      } else {
        res = await this.$axios.$post("/admin/robot", formData);
      }
      this.initData();
      this.visible = false;
    },
    async onChangeRobot(open) {
      if (!open)
        return this.$notification.warning({
          message: "操作提示",
          description: "请先在手机上退出"
        });
      this.showQrcode = true;
      this.refreshCount = 0;
      this.timer = true;
    },
    async refresh() {
      if (this.refreshCount < 20) {
        this.initData();
        this.refreshCount++;
        return;
      }
      this.timer = false;
      this.refreshCount = 0;
      this.showQrcode = false;
    },
    onKeyChange(value) {}
  },
  watch: {
    timer: function(value) {
      if (value) {
        this.timerTask = setInterval(() => {
          this.refresh();
        }, 10000);
      } else {
        clearInterval(this.timerTask);
      }
    }
  },
  destroyed() {
    clearInterval(this.timerTask);
  }
});
</script>
<style lang="scss" scoped>
.rInfo {
  color: #666;
  .name {
    color: #1890ff;
    font-size: 20px;
  }
  .title {
    color: #000;
  }
}
</style>
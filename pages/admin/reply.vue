<template>
  <div class="container">
    <a-table :columns="columns" :dataSource="list" bordered size="small">
      <span slot="action" slot-scope="text, record">
        <!-- <a-button type="primary">修改</a-button> -->
      </span>
    </a-table>
  </div>
</template>
<script lang="javascript">
import Vue from "vue";
const columns = [
  {
    title: "关键字",
    dataIndex: "keyword",
    key: "keyword",
    width: 100,
    align: "center"
  },
  {
    title: "回复",
    dataIndex: "reply",
    key: "reply",
    align: "center"
  },
  {
    title: "描述",
    dataIndex: "describe",
    key: "describe",
    align: "center"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center"
  }
];
export default Vue.extend({
  layout: "admin",
  data() {
    return {
      list: [
        {
          keyword: "加群",
          reply: "管理群聊有x个，回复群聊名即可加入\n\n 【群聊名称1】...",
          describe: "自动拉群"
        }
      ],
      columns
    };
  },
  methods: {}
});
</script>

<style scoped>
.container {
  height: 100%;
  background: #fff;
  padding: 10px;
}
</style>
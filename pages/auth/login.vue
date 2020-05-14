<template>
<div class="container">
  <div class="auth-panel">
    <h2 class="auth-title">
      后台登录
    </h2>    
    <a-form :form="form" @submit="handleSubmit" class="form">
      <a-form-item>
        <a-input
          size="large"
          placeholder="用户名"
          v-decorator="['username',{ rules: [{ required: true, message: '输入用户名!' }]}]"
        />
      </a-form-item>
      <a-form-item>
        <a-input-password
          size="large"
          placeholder="密码"
          v-decorator="['password',{ rules: [{ required: true, message: '输入密码!' }]}]"
        />
      </a-form-item>
       <a-button type="primary" :block="true" size="large" html-type="submit">
      登录
    </a-button>
    </a-form>
  </div>
</div>
</template>



<script lang="javascript">
import Vue from 'vue';
export default Vue.extend({
  data () {
    return {
      form:this.$form.createForm(this, {})
    };
  },
  //layout: 'auth',
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          //this.login({data:values})
          this.$auth.loginWith('local', {data:values})
          // .catch(err => {
          //   this.$message.error('密码不正确！');
          // });
        }
      });
    },
    // async login(data){
    //   const res = await this.$axios.post('/auth/login',data)
    //   console.log(res)
    // }
  }

});
</script>


<style scoped>
.container{position: absolute;background: #2579eb;
  height: 100%;
  width: 100%;}
.auth-panel {
  max-width: 370px;
  margin: 13vh auto 0;
  padding: 50px 40px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.09);
}
.auth-title {
  text-align: center;
}
</style>

<template>
  <div id="login">
    <div class="title">
      <h1>
        <img src="../assets/logo.png">
        <span>向上的博客</span>
      </h1>
      <p>这是我的个人博客，欢迎关注</p>
    </div>
    <!-- <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        :validate-status="userNameError() ? 'error' : ''"
        :help="userNameError() || ''"
      >
        <a-input
          v-decorator="[
            'userName',
            {rules: [{ required: true, message: 'Please input your username!' }]}
          ]"
          placeholder="Username"
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color:rgba(0,0,0,.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item
        :validate-status="passwordError() ? 'error' : ''"
        :help="passwordError() || ''"
      >
        <a-input
          v-decorator="[
            'password',
            {rules: [{ required: true, message: 'Please input your Password!' }]}
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color:rgba(0,0,0,.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="hasErrors(form.getFieldsError())"
        >
          Log in
        </a-button>
      </a-form-item>
    </a-form> -->
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
}
</script>

<style lang="scss" scoped>
  #login{
    width:100%;
    height:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background:lightblue;
    text-align: center;
    .title{
      img{
        width:36px;
        height:36px;
      }
    }
  }
</style>

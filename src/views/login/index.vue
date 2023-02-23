<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <!-- native修饰符表示监听组件的原生事件 -->
        <!-- 如果人家封装过的el-input组件开放了这个事件，可以不用加native，如果没有开放还想要添加这个事件，就加native -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button class="loginBtn" :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
// vuex模块加了namespace，所以这里可以用辅助函数的形式引入
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    const validateMobile = (rule, value, callback) => {
      // 校验成功执行callback()
      // 校验失败叶执行callback(new Error('错误信息'))
      if (!validMobile(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        // validator 自定义函数
        mobile: [
          {
            required: true,
            trigger: 'blur',
            message: '手机号不能为空'
          },
          {
            validator: validateMobile
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空'
          },
          {
            min: 6,
            max: 16,
            message: '密码长度为6到16位'
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 全局的mapActions想要引入子模块或者加入子模块的actions，就需要加路径
    // 引入方法
    ...mapActions(['user/login']), // 参数传方法，方法需要传入所在的路径
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // 表单的手动校验
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            // 只有表单校验通过了，才可以去调用action
            // this['user/login'] 取到该方法
            // 因为this['user/login']是异步函数，所以必须强制等待登陆成功(用await)才能去跳转主页
            await this['user/login'](this.loginForm)
            // await下面的代码都是登陆成功之后执行的代码
            this.$router.push('/')
          } catch (error) {
            console.log(error)
          } finally {
            // 最后都需要关闭转圈
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // ref 可以获取一个元素的dom对象
      // ref 作用在组件上的时候，可以获取该组件的实例
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url(~@/assets/common/login.jpg);
  background-position: center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255,
      255,
      255,
      0.7);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: #fff
  }
  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

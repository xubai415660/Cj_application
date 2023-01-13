<template>
  <div class="user-login">
    <ami-form
      class="login-form"
      status-icon
      :rules="loginRules"
      ref="loginForm"
      :model="loginForm"
      labami-width="0"
      autocomplete="off"
    >
      <ami-form-item prop="username">
        <div class="username">
          <ami-input class="ipt" v-model="loginForm.username" auto-complete="off" placeholder="请输入工号"></ami-input>
        </div>
      </ami-form-item>
      <ami-form-item prop="pd">
        <div class="password mag-t-28">
          <ami-input
            class="ipt"
            :type="passwordType"
            v-model="loginForm.pd"
            auto-complete="off"
            placeholder="请输入密码"
          ></ami-input>
        </div>
      </ami-form-item>
      <ami-form-item>
        <div class="mag-t-28">
          <template v-if="!loginForm.captchaVerification">
            <Verifition
              @success="checkstring"
              ref="verifition"
              :mode="'fixed'"
              :captchaType="'blockPuzzle'"
              :imgSize="{ width: '408px', height: '155px' }"
            ></Verifition>
          </template>
          <template v-else>
            <div class="validation-succeeded-body">
              <div class="validation-succeeded-button">验证成功</div>
            </div>
          </template>
        </div>
      </ami-form-item>
      <ami-form-item>
        <ami-button
          type="primary"
          class="login-submit mag-t-48"
          :disabled="!this.loginForm.captchaVerification"
          @click="handleLogin"
          >登录
        </ami-button>
      </ami-form-item>
    </ami-form>
  </div>
</template>

<script>
import Verifition from "./verifition/Verify";
import { login, getUserInfo } from "@/api/base/base";
import { setStore } from "@/utils/store";
import { sm2Encode } from "@/utils/sm";

export default {
  name: "userLogin",
  components: { Verifition },
  data() {
    return {
      loginForm: {
        // 客户端id
        clientId: "test",
        // 客户端secret
        clientSecret: "test",
        // 认证类型
        grantType: "password",
        username: "",
        pd: "",
        captchaVerification: "",
      },
      loginRules: {
        username: [{ required: true, message: "请输入工号", trigger: "blur" }],
        pd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, message: "密码长度最少为6位", trigger: "blur" },
        ],
      },
      passwordType: "password",
    };
  },
  methods: {
    checkstring(e) {
      this.loginForm.captchaVerification = e.captchaVerification;
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "登录中,请稍后。。。",
            spinner: "ami-icon-loading",
          });
          // 用户登录
          const loginInfo = {
            ...this.loginForm,
            username: sm2Encode(this.loginForm.username),
            pd: sm2Encode(this.loginForm.pd),
          };
          login(loginInfo)
            .then((res) => {
              let data = res.data.data;

              setStore({ name: "token", content: data.accessToken, type: "session" }, false);
              setStore(
                {
                  name: "refreshToken",
                  content: data.refreshToken,
                  type: "session",
                },
                false,
              );
              this.$notify({
                title: "获取token成功",
                type: "success",
                duration: 3000,
              });
              getUserInfo()
                .then((res) => {
                  loading.close();
                  let userinfo = res.data.data;
                  setStore({ name: "userInfo", content: userinfo, type: "session" }, false);
                  setStore({ name: "roles", content: userinfo.roles, type: "session" }, false);
                  setStore({ name: "maCodeList", content: userinfo.permissions, type: "session" }, false);
                  this.$notify({
                    title: "获取用户信息成功",
                    type: "success",
                    duration: 3000,
                  });
                })
                .catch(() => {
                  this.$notify({
                    title: "获取用户信息失败",
                    type: "error",
                    duration: 3000,
                  });
                  loading.close();
                });
            })
            .catch(() => {
              this.loginForm.captchaVerification = "";
              loading.close();
            });
        } else {
          this.$refs.verifition.refresh();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-login {
  height: 100%;

  .login-form {
    padding-top: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .username,
  .password {
    width: 408px;
    height: 48px;

    .user-icon {
      position: absolute;
      top: 12px;
      left: 21px;
    }
  }

  .validation-succeeded-body {
    //height: 132px;
    display: flex;
    align-items: center;

    .validation-succeeded-button {
      width: 100%;
      height: 48px;
      border: solid 1px #00796a;
      border-radius: 6px;
      text-align: center;
      line-height: 48px;
      color: #00796a;
      background: #f0f0f0;
    }
  }

  .login-submit {
    width: 408px;
    height: 48px;
    border-radius: 4px;
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    /* identical to box height */

    text-align: center;
    letter-spacing: 10px;

    color: #e9f4ff;
  }
}
</style>

import React, { useCallback, useState } from "react";
import { Button, Input, Form } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import apiTestBank from "../../service/apiTestBank";
import { APIS_TEST_BANK } from "../../config";
import { useGlobalMessage } from "../../context/message";

const Login = () => {
  const message = useGlobalMessage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const res = await apiTestBank.post(APIS_TEST_BANK.login, values);
        // Handle redirect or token storage here if needed
        if (res?.status === 200) {
          message.success(`Logged in successfully as ${values?.username}`);
          localStorage.setItem("token", res?.data?.access_token);
          localStorage.setItem("isStudent", res?.data?.message?.loginData?.isStudent);
          navigate("/app", { replace: true });
        } else {
          message.error(res?.detail || "Login failed");
        }
      } catch (error) {
        message.error(
          error?.response?.data?.detail || error?.message || "Login failed"
        );
      } finally {
        setLoading(false);
      }
    },
    [message, navigate]
  );

  return (
    <div className={styles.loginBg}>
      <div className={styles.loginCard}>
        <div className={styles.logoWrap}>
          <img
            src={process.env.PUBLIC_URL + "/testbank-icon.svg"}
            alt="TestBank Logo"
            className={styles.logoImg}
          />
          <div className={styles.title}>TestBank</div>
        </div>
        <div className={styles.formWrap}>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input size="large" placeholder="Username" autoFocus />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password size="large" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className={styles.loginBtn}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

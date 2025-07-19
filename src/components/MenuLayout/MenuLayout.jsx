import React, { useCallback } from "react";
import { Layout, Menu, Avatar, Button } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./MenuLayout.module.scss";
import apiTestBankWithToken from "../../service/apiTestBankWithToken";
import { APIS_TEST_BANK } from "../../config";
import { useGlobalMessage } from "../../context/message";
import useIsStudent from "../../hooks/useIsStudent";

const { Header, Content, Sider } = Layout;

const allItems = [
  {
    key: "/app/import-question",
    label: <Link to="/app/import-question">Import Question</Link>,
  },
  {
    key: "/app/create-test-subject",
    label: <Link to="/app/create-test-subject">Create Test Subject</Link>,
  },
  {
    key: "/app/test-subject-list",
    label: <Link to="/app/test-subject-list">Test Subject List</Link>,
  },
];

const MenuLayout = () => {
  const isStudent = useIsStudent();
  const message = useGlobalMessage();
  const location = useLocation();
  const items = isStudent
    ? allItems.filter((item) => item.key === "/app/test-subject-list")
    : allItems.filter((item) => item.key !== "/app/test-subject-list");
  // Find the matching menu key for the current path
  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key ||
    location.pathname;
  const handleLogout = useCallback(async () => {
    try {
      await apiTestBankWithToken.post(APIS_TEST_BANK.logout);
    } catch (error) {
      // ignore error, proceed to clear token
      message.error(
        error?.response?.data?.detail || error?.message || "Logout failed"
      );
    }
    localStorage.removeItem("token");
    localStorage.removeItem("isStudent");
    window.location.href = "/login";
  }, [message]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} className={styles.sider}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.logoTitleWrap}>
            <img
              src={process.env.PUBLIC_URL + "/testbank-icon.svg"}
              alt="Test Bank Logo"
              className={styles.logoImg}
            />
            <span className={styles.title}>Test Bank</span>
          </div>
          <div className={styles.userActions}>
            <Avatar
              style={{
                backgroundColor: "#fff",
                color: "#6366f1",
                marginRight: 16,
              }}
              icon={<span style={{ fontWeight: 700 }}>U</span>}
            />
            <Button type="primary" danger onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MenuLayout;

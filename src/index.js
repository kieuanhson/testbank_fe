import React from "react";
import ReactDOM from "react-dom/client";
import "./index.module.scss";
import MenuLayout from "./components/MenuLayout";
import ImportQuestion from "./pages/ImportQuestion";
import CreateTestSubject from "./pages/CreateTestSubject";
import TestSubjectList from "./pages/TestSubjectList";
import Login from "./pages/Login"; // .jsx extension is automatically resolved

import TestPage from "./pages/TestPage";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { App as AntdApp, ConfigProvider } from "antd";
import { MessageProvider } from "./context/message";
import useAuthRedirect from "./hooks/useAuthRedirect";

function AuthRedirector() {
  useAuthRedirect();
  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider>
      <AntdApp>
        <MessageProvider>
          <BrowserRouter>
            <AuthRedirector />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/app" element={<MenuLayout />}>
                {/* <Route index element={<App />} /> */}
                <Route path="import-question" element={<ImportQuestion />} />
                <Route
                  path="create-test-subject"
                  element={<CreateTestSubject />}
                />
                <Route path="test-subject-list" element={<TestSubjectList />} />
              </Route>
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </BrowserRouter>
        </MessageProvider>
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

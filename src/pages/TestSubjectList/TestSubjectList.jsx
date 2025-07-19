import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Table, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./TestSubjectList.module.scss";
import apiTestBankWithToken from "../../service/apiTestBankWithToken";
import { APIS_TEST_BANK } from "../../config";
import { useGlobalMessage } from "../../context/message";
import moment from "moment/moment";

const handleTakeTest = (navigate, code) => {
  navigate(`/test?code=${encodeURIComponent(code)}`);
};

const TestSubjectList = () => {
  const navigate = useNavigate();
  const message = useGlobalMessage();
  const [loading, setLoading] = useState(false);
  const [examList, setExamList] = useState([]);

  const getExamList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiTestBankWithToken.get(APIS_TEST_BANK.getExamsList);
      // Handle redirect or token storage here if needed
      if (res?.status === 200) {
        setExamList(res?.data?.data || []);
      } else {
        message.error(res?.message || "Failed");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.detail || error?.message || "Failed"
      );
    } finally {
      setLoading(false);
    }
  }, [message]);

  const columns = useMemo(
    () => [
      {
        title: "Test Subject",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Test Duration (minutes)",
        dataIndex: "total_time",
        key: "total_time",
      },
      {
        title: "Number of Questions",
        dataIndex: "total_question",
        key: "total_question",
      },
      {
        title: "Bắt đầu",
        dataIndex: "start_time",
        key: "start_time",
        render: (text) => (
          <span>{text && moment(text).format("DD/MM/YYYY HH:mm:ss")}</span>
        ),
      },
      {
        title: "Kết thúc",
        dataIndex: "end_time",
        key: "end_time",
        render: (text) => (
          <span>{text && moment(text).format("DD/MM/YYYY HH:mm:ss")}</span>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Button
            type="primary"
            onClick={() => handleTakeTest(navigate, record?.id)}
          >
            Take Test
          </Button>
        ),
      },
    ],
    [navigate]
  );

  useEffect(() => {
    getExamList();
  }, [getExamList]);

  return (
    <div className={styles.container}>
      <Typography.Title level={2} className={styles.title}>
        Test Subject List
      </Typography.Title>
      <Table
        columns={columns}
        dataSource={examList}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default TestSubjectList;

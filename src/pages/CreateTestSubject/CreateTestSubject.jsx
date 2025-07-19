import React, { useCallback, useState } from "react";
import { Form, Input, InputNumber, Button, Typography, DatePicker } from "antd";
import styles from "./CreateTestSubject.module.scss";
import { useGlobalMessage } from "../../context/message";
import apiTestBankWithToken from "../../service/apiTestBankWithToken";
import { APIS_TEST_BANK } from "../../config";

const CreateTestSubject = () => {
  const [form] = Form.useForm();
  const message = useGlobalMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const res = await apiTestBankWithToken.post(APIS_TEST_BANK.createExam, {
          subject_id: values?.subject_id,
          title: values?.title,
          total_question: values?.total_question,
          total_time: values?.total_time,
          start_time: values?.start_time,
          end_time: values?.end_time,
          createdBy: 0,
          isDeleted: false,
          mark: values?.total_question,
          total_questions: values?.total_question,
        });
        if (res?.status === 201) {
          message.success(res?.data?.message || "Create successfully!");
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
    },
    [message]
  );

  return (
    <div className={styles.container}>
      <Typography.Title level={2} className={styles.title}>
        Create Test Subject
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        onFinish={onFinish}
      >
        <Form.Item
          label="Test Subject Code"
          name="subject_id"
          rules={[
            { required: true, message: "Please input the test subject code!" },
          ]}
        >
          <Input className={styles.input} />
        </Form.Item>
        <Form.Item
          label="Exam Title"
          name="title"
          rules={[{ required: true, message: "Please input the exam title!" }]}
        >
          <Input className={styles.input} />
        </Form.Item>
        <Form.Item
          label="Start Time"
          name="start_time"
          rules={[{ required: true, message: "Please input the start time!" }]}
        >
          <DatePicker
            showTime
            className={styles.input}
            style={{ width: "100%" }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Select start time"
          />
        </Form.Item>
        <Form.Item
          label="End Time"
          name="end_time"
          rules={[{ required: true, message: "Please input the end time!" }]}
        >
          <DatePicker
            showTime
            className={styles.input}
            style={{ width: "100%" }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Select end time"
          />
        </Form.Item>
        <Form.Item
          label="Test Duration (minutes)"
          name="total_time"
          rules={[{ required: true, message: "Please input the duration!" }]}
        >
          <InputNumber
            min={1}
            className={styles.input}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Number of Questions"
          name="total_question"
          rules={[
            {
              required: true,
              message: "Please input the number of questions!",
            },
          ]}
        >
          <InputNumber
            min={1}
            className={styles.input}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.button}
            block
            loading={loading}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTestSubject;

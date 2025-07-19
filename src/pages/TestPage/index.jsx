import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Typography, Button, Radio, Space, Divider } from "antd";
import { useGlobalMessage } from "../../context/message";
import apiTestBankWithToken from "../../service/apiTestBankWithToken";
import { APIS_TEST_BANK } from "../../config";
import PopupSubmitTest from "./components/PopupSubmitTest";

const TestPage = () => {
  const message = useGlobalMessage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [examDetail, setExamDetail] = useState(null);
  const [openPopupResult, setOpenPopupResult] = useState(null);
  const [result, setResult] = useState(null);
  const code = searchParams.get("code");
  // Timer logic
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef();

  const getExamDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiTestBankWithToken.get(APIS_TEST_BANK.getExamDetail, {
        params: { examId: code },
      });
      if (res?.status === 200) {
        setExamDetail(res?.data);
        setSecondsLeft(res?.data?.exam_time * 60);
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
  }, [code, message]);

  useEffect(() => {
    getExamDetail();
  }, [getExamDetail]);

  // Question/answer state
  const [answers, setAnswers] = useState([]);

  // Format timer as mm:ss
  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const today = useMemo(() => new Date().toLocaleDateString(), []);

  const handleChange = useCallback((qid, value, multiChoice = false) => {
    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.question_id === qid);
      if (multiChoice) {
        let newAnswerArr = [];
        if (idx > -1) {
          // Toggle value in array
          const currentArr = Array.isArray(prev[idx].answer) ? prev[idx].answer : [];
          if (currentArr.includes(value)) {
            newAnswerArr = currentArr.filter((v) => v !== value);
          } else {
            newAnswerArr = [...currentArr, value];
          }
          const updated = [...prev];
          updated[idx] = { question_id: qid, answer: newAnswerArr };
          return updated;
        } else {
          return [...prev, { question_id: qid, answer: [value] }];
        }
      } else {
        // Always save as array for single choice
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = { question_id: qid, answer: [value] };
          return updated;
        } else {
          return [...prev, { question_id: qid, answer: [value] }];
        }
      }
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiTestBankWithToken.post(
        APIS_TEST_BANK.submitExam(code),
        {
          list_answer: answers,
        }
      );
      if (res?.status === 200) {
        setResult(res?.data);
        setOpenPopupResult(true);
        clearInterval(timerRef.current);
      } else {
        message.error(res?.message || "Failed");
      }
    } catch (error) {
      error?.response?.data?.detail?.forEach((err) => {
        message.error(err?.msg || "Failed");
      });
    } finally {
      setLoading(false);
    }
  }, [answers, code, message]);

  useEffect(() => {
    if (!code) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          message.info("Time is up!");
          // Optionally, auto-submit here
          if (!!examDetail) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [code, examDetail, handleSubmit, message]);

  const questionsContent = useMemo(
    () =>
      examDetail?.questions?.map((q, idx) => (
        <div key={q?.question_id} style={{ marginBottom: 24 }}>
          <Typography.Text strong>Question {idx + 1}:{q?.multi_choice && ' (Multiple choices)'}</Typography.Text>
          <Typography.Paragraph style={{ marginBottom: 8 }}>
            {q?.content}
          </Typography.Paragraph>
          {q?.img && (
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <img
                src={`http://localhost:8000${q?.img}`}
                alt={`Question ${idx + 1}`}
                style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }}
              />
            </div>
          )}
          {q?.multi_choice ? (
            <Space direction="vertical">
              {q?.answer?.map((choice, i) => {
                const found = answers.find((a) => a.question_id === q.question_id);
                const checked = Array.isArray(found?.answer) && found.answer.includes(i);
                return (
                  <label key={i} style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleChange(q?.question_id, i, true)}
                      style={{ marginRight: 8 }}
                    />
                    {choice}
                  </label>
                );
              })}
            </Space>
          ) : (
            <Radio.Group
              onChange={(e) => handleChange(q?.question_id, e.target.value)}
              value={(() => {
                const found = answers.find((a) => a.question_id === q.question_id);
                return Array.isArray(found?.answer) && found.answer.length > 0
                  ? found.answer[0]
                  : undefined;
              })()}
              style={{ display: "block" }}
            >
              <Space direction="vertical">
                {q?.answer?.map((choice, i) => (
                  <Radio key={i} value={i}>
                    {choice}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}
        </div>
      )),
    [examDetail?.questions, answers, handleChange]
  );

  if (!code) {
    // If accessed directly, redirect to home or show error
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card>
          <Typography.Title level={3}>No Test Selected</Typography.Title>
          <Typography.Paragraph>
            Please select a test from the Test Subject List.
          </Typography.Paragraph>
          <Button type="primary" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        background: "#f5f6fa",
      }}
    >
      <Card
        style={{ minWidth: 400, marginTop: 40, width: "90vw", maxWidth: 1200 }}
      >
        <Typography.Title
          level={2}
          style={{ textAlign: "center", marginBottom: 0 }}
        >
          {examDetail?.exam_title}
        </Typography.Title>
        <Typography.Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 8 }}
        >
          {today}
        </Typography.Text>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Typography.Text strong style={{ fontSize: 18 }}>
            Time Left:{" "}
            <span style={{ color: "#fa541c" }}>{formatTime(secondsLeft)}</span>
          </Typography.Text>
        </div>
        <Divider />
        {questionsContent}
        <Divider />
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            disabled={secondsLeft === 0}
            loading={loading}
          >
            Submit Test
          </Button>
        </div>
      </Card>
      <PopupSubmitTest
        open={openPopupResult}
        setOpen={setOpenPopupResult}
        result={result}
        onOk={() => navigate("/app/test-subject-list")}
      />
    </div>
  );
};

export default TestPage;

export const APIS_TEST_BANK = {
  login: "/authen/login",
  logout: "/authen/logout",
  uploadQuestions: "/questions/upload/",
  getExamsList: "/examination/",
  getExamDetail: "/examination/get_exam_info",
  submitExam: (id) => `/examination/submit_exam?examId=${id}`,
  createExam: '/examination/create',
};

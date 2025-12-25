// Quiz Validation Schema
export const QuizSchema = {
  question: {
    required: true,
    minLength: 5,
    maxLength: 500,
    message: "Câu hỏi phải có từ 5-500 ký tự",
  },
  type: {
    required: true,
    enum: ["mood", "memory", "preference"],
    message: "Loại quiz không hợp lệ",
  },
  options: {
    required: true,
    minItems: 2,
    maxItems: 10,
    message: "Quiz phải có từ 2-10 lựa chọn",
  },
  order: {
    required: true,
    type: "number",
    min: 0,
    message: "Thứ tự phải là số >= 0",
  },
  allowCustomAnswer: {
    type: "boolean",
    message: "Cho phép câu trả lời tùy chỉnh phải là boolean",
  },
  isActive: {
    type: "boolean",
    message: "Trạng thái hoạt động phải là boolean",
  },
};

// Quiz Option Validation Schema
export const QuizOptionSchema = {
  text: {
    required: true,
    minLength: 1,
    maxLength: 200,
    message: "Nội dung lựa chọn phải có từ 1-200 ký tự",
  },
  value: {
    required: true,
    minLength: 1,
    maxLength: 100,
    message: "Giá trị lựa chọn phải có từ 1-100 ký tự",
  },
  imageUrl: {
    type: "string",
    pattern: /^https?:\/\/.+/,
    message: "URL hình ảnh không hợp lệ",
  },
};

// Validation functions
export const validateQuiz = (quiz) => {
  const errors = {};

  // Validate question
  if (
    !quiz.question ||
    quiz.question.trim().length < QuizSchema.question.minLength
  ) {
    errors.question = QuizSchema.question.message;
  }

  // Validate type
  if (!QuizSchema.type.enum.includes(quiz.type)) {
    errors.type = QuizSchema.type.message;
  }

  // Validate options
  if (!quiz.options || quiz.options.length < QuizSchema.options.minItems) {
    errors.options = QuizSchema.options.message;
  } else {
    const optionErrors = quiz.options.map((option, index) =>
      validateQuizOption(option)
    );
    if (optionErrors.some((error) => Object.keys(error).length > 0)) {
      errors.options = "Có lỗi trong các lựa chọn";
    }
  }

  // Validate order
  if (typeof quiz.order !== "number" || quiz.order < 0) {
    errors.order = QuizSchema.order.message;
  }

  return errors;
};

export const validateQuizOption = (option) => {
  const errors = {};

  if (
    !option.text ||
    option.text.trim().length < QuizOptionSchema.text.minLength
  ) {
    errors.text = QuizOptionSchema.text.message;
  }

  if (
    !option.value ||
    option.value.trim().length < QuizOptionSchema.value.minLength
  ) {
    errors.value = QuizOptionSchema.value.message;
  }

  if (
    option.imageUrl &&
    !QuizOptionSchema.imageUrl.pattern.test(option.imageUrl)
  ) {
    errors.imageUrl = QuizOptionSchema.imageUrl.message;
  }

  return errors;
};

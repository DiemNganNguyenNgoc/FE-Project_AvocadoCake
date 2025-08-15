import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./UpdateQuizPage.module.css";
import QuizService from "../../../../services/QuizService";
import AdminButtonComponent from "../../../../components/AdminButtonComponent/AdminButtonComponent";

const UpdateQuizPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState({
    question: "",
    type: "mood",
    options: [],
    allowCustomAnswer: false,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const data = await QuizService.getQuizzes();
      const quiz = data.find((q) => q._id === quizId);
      if (!quiz) {
        throw new Error("Không tìm thấy quiz");
      }
      setQuizData(quiz);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...quizData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuizData({ ...quizData, options: newOptions });
  };

  const addOption = () => {
    setQuizData({
      ...quizData,
      options: [...quizData.options, { text: "", value: "" }],
    });
  };

  const removeOption = (index) => {
    const newOptions = quizData.options.filter((_, i) => i !== index);
    setQuizData({ ...quizData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Validate data
      if (!quizData.question.trim()) {
        throw new Error("Vui lòng nhập câu hỏi");
      }

      if (
        quizData.options.some((opt) => !opt.text.trim() || !opt.value.trim())
      ) {
        throw new Error(
          "Vui lòng điền đầy đủ thông tin cho tất cả các lựa chọn"
        );
      }

      await QuizService.updateQuiz(quizId, quizData);
      navigate("/admin/list-quiz");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải thông tin quiz...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Sửa Quiz</h1>
        <AdminButtonComponent
          onClick={() => navigate("/admin/list-quiz")}
          className="back"
        >
          Quay lại
        </AdminButtonComponent>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="question">Câu hỏi:</label>
          <input
            type="text"
            id="question"
            value={quizData.question}
            onChange={(e) =>
              setQuizData({ ...quizData, question: e.target.value })
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type">Loại quiz:</label>
          <select
            id="type"
            value={quizData.type}
            onChange={(e) => setQuizData({ ...quizData, type: e.target.value })}
          >
            <option value="mood">Tâm trạng</option>
            <option value="memory">Ký ức</option>
            <option value="preference">Sở thích</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="order">Thứ tự hiển thị:</label>
          <input
            type="number"
            id="order"
            value={quizData.order}
            onChange={(e) =>
              setQuizData({ ...quizData, order: parseInt(e.target.value) })
            }
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={quizData.allowCustomAnswer}
              onChange={(e) =>
                setQuizData({
                  ...quizData,
                  allowCustomAnswer: e.target.checked,
                })
              }
            />
            Cho phép câu trả lời tùy chỉnh
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={quizData.isActive}
              onChange={(e) =>
                setQuizData({ ...quizData, isActive: e.target.checked })
              }
            />
            Hiển thị quiz
          </label>
        </div>

        <div className={styles.optionsSection}>
          <h3>Các lựa chọn:</h3>
          {quizData.options.map((option, index) => (
            <div key={index} className={styles.optionGroup}>
              <input
                type="text"
                placeholder="Nội dung lựa chọn"
                value={option.text}
                onChange={(e) =>
                  handleOptionChange(index, "text", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Giá trị"
                value={option.value}
                onChange={(e) =>
                  handleOptionChange(index, "value", e.target.value)
                }
                required
              />
              <AdminButtonComponent
                type="button"
                onClick={() => removeOption(index)}
                className="delete"
                disabled={quizData.options.length === 1}
              >
                Xóa
              </AdminButtonComponent>
            </div>
          ))}
          <AdminButtonComponent
            type="button"
            onClick={addOption}
            className="add"
          >
            Thêm lựa chọn
          </AdminButtonComponent>
        </div>

        <div className={styles.formActions}>
          <AdminButtonComponent
            type="submit"
            disabled={saving}
            className="edit"
          >
            {saving ? "Đang lưu..." : "Cập nhật Quiz"}
          </AdminButtonComponent>
        </div>
      </form>
    </div>
  );
};

export default UpdateQuizPage;

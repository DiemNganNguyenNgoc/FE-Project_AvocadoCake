import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ListQuizPage.module.css";
import QuizService from "../../../../services/QuizService";
import AdminButtonComponent from "../../../../components/AdminButtonComponent/AdminButtonComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";

const ListQuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("quiz");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await QuizService.getQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (error) {
      setError("Không thể tải danh sách quiz: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuiz = () => {
    navigate("/admin/add-quiz");
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/admin/update-quiz/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quiz này?")) {
      try {
        await QuizService.deleteQuiz(quizId);
        await fetchQuizzes(); // Refresh danh sách sau khi xóa
      } catch (error) {
        setError("Không thể xóa quiz: " + error.message);
      }
    }
  };

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải danh sách quiz...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      <div className="container-xl">
        <div className="store-info__container">
          {/* side menu */}
          <div className="side-menu__discount">
            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </div>

          {/* content */}
          <div className="store-info">
            <div className="store-info__content">
              <div className={styles.header}>
                <h1>Quản lý Quiz</h1>
                <AdminButtonComponent onClick={handleAddQuiz} className="add">
                  Thêm Quiz Mới
                </AdminButtonComponent>
              </div>

              <div className={styles.quizList}>
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className={styles.quizCard}>
                    <div className={styles.quizInfo}>
                      <h3>{quiz.question}</h3>
                      <p>Loại: {quiz.type}</p>
                      <p>Thứ tự: {quiz.order}</p>
                      <p>
                        Trạng thái: {quiz.isActive ? "Đang hoạt động" : "Đã ẩn"}
                      </p>
                      <div className={styles.options}>
                        <p>Các lựa chọn:</p>
                        <ul>
                          {quiz.options.map((option, index) => (
                            <li key={index}>
                              {option.text} {option.imageUrl && "(có hình ảnh)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <AdminButtonComponent
                        onClick={() => handleEditQuiz(quiz._id)}
                        className="edit"
                      >
                        Sửa
                      </AdminButtonComponent>
                      <AdminButtonComponent
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="delete"
                      >
                        Xóa
                      </AdminButtonComponent>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListQuizPage;

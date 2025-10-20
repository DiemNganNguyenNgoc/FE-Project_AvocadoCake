import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardNews from "../../../components/CardNews/CardNews";
import ChatbotComponent from "../../../components/ChatbotComponent/ChatbotComponent";
import { getAllNews } from "../../../api/services/NewsService";
import "./NewsPage.css";

const NewsPage = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]); // ✅ danh sách tin
  const [currentPage, setCurrentPage] = useState(0); // ✅ trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // ✅ tổng số trang
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageSize = 4; // ✅ số tin trên mỗi trang

  // Pagination Component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
      <div className="pagination">
        {pages.map((page) => (
          <button
            key={page}
            className={`pageNumber ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}
      </div>
    );
  };

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getAllNews();
        const allNews = response?.data || [];

        if (!Array.isArray(allNews)) {
          setError("Invalid news data.");
          return;
        }

        setTotalPages(Math.ceil(allNews.length / pageSize));
        const start = currentPage * pageSize;
        const end = start + pageSize;
        setNewsList(allNews.slice(start, end));
      } catch (err) {
        setError(err.message || "Unable to load news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  // Xem chi tiết tin
  const handleDetail = (newsId) => {
    const selected = newsList.find((item) => item._id === newsId);

    if (selected) {
      const { newsImage, newsTitle, newsContent } = selected;
      navigate("/news-detail", {
        state: { newsImage, newsTitle, newsContent },
      });
    } else {
      alert("News not found!");
    }
  };

  return (
    <div className="pb-3">
      {/* Header section */}
      <div className="productadmin__top">
        <ChatbotComponent />
        <h1 className="productadmin__title">TIN TỨC</h1>
      </div>

      {/* News grid */}
      <div className="container-xl" style={{ display: "flex" }}>
        <div className="news-grid">
          {loading ? (
            <p>Đang tải tin tức...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : newsList.length > 0 ? (
            newsList.map((item) => {
              const imageUrl = item.newsImage?.startsWith("http")
                ? item.newsImage
                : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${item.newsImage?.replace(
                    "\\",
                    "/"
                  )}`;

              return (
                <div key={item._id} className="news-grid-item">
                  <CardNews
                    className="col productadmin__item"
                    img={imageUrl}
                    title={item.newsTitle}
                    detail={item.newsContent}
                    id={item._id}
                    onClick={() => handleDetail(item._id)}
                  />
                </div>
              );
            })
          ) : (
            <p>Không có tin tức nào</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="PageNumberHolder">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default NewsPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewsTable from "./partials/NewsTable";
import Breadcrumb from "./partials/Breadcrumb";
import StatsCards from "./partials/StatsCards";
import { NewsService } from "./services/NewsService";
import { AddNews, UpdateNews } from "./usecases";
import { Button } from "../../../components/AdminLayout";

const AdminNews = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentView, setCurrentView] = useState("list");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNews = await NewsService.fetchAllNews();
      setNews(fetchedNews);
    } catch (error) {
      setError(error.message || "Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData) => {
    try {
      setLoading(true);
      setError(null);
      const newNews = await NewsService.createNewNews(newsData);
      setNews((prev) => [...prev, newNews]);
      return newNews;
    } catch (error) {
      setError(error.message || "Không thể tạo tin tức");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async (id, newsData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedNews = await NewsService.updateExistingNews(id, newsData);
      setNews((prev) => prev.map((item) => (item._id === id ? updatedNews : item)));
      return updatedNews;
    } catch (error) {
      setError(error.message || "Không thể cập nhật tin tức");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await NewsService.removeNews(id);
      setNews((prev) => prev.filter((item) => item._id !== id));
      setSelectedNews((prev) => prev.filter((newsId) => newsId !== id));
    } catch (error) {
      setError(error.message || "Không thể xóa tin tức");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteMultipleNews = async (ids) => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all(ids.map((id) => NewsService.removeNews(id)));
      setNews((prev) => prev.filter((item) => !ids.includes(item._id)));
      setSelectedNews([]);
    } catch (error) {
      setError(error.message || "Không thể xóa tin tức");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleNewsSelection = (id) => {
    setSelectedNews((prev) =>
      prev.includes(id) ? prev.filter((newsId) => newsId !== id) : [...prev, id]
    );
  };

  const selectAllNews = () => {
    setSelectedNews(news.map((item) => item._id));
  };

  const clearSelection = () => {
    setSelectedNews([]);
  };

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getFilteredNews = () => {
    let filtered = news;
    if (searchTerm) {
      filtered = news.filter((item) =>
        item.newsTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.newsContent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return filtered;
  };

  const getPaginatedNews = () => {
    const filtered = getFilteredNews();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      news: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalItems: filtered.length,
    };
  };

  const handleCreateNews = () => {
    if (onNavigate) {
      onNavigate("add");
    } else {
      setCurrentView("add");
    }
  };

  const handleRefresh = () => {
    fetchNews();
  };

  const handleBackToList = () => {
    setCurrentView("list");
    fetchNews();
  };

  if (currentView === "add") {
    return <AddNews onBack={handleBackToList} />;
  }

  if (currentView === "update") {
    return <UpdateNews onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-gray-1 dark:bg-dark p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <Breadcrumb />
            <h1 className="text-4xl font-bold text-dark dark:text-white">Quản Lý Tin Tức</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Quản lý và theo dõi tất cả tin tức trong hệ thống</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleRefresh} className="px-6 py-3 text-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-2 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm mới
            </button>
            <button onClick={handleCreateNews} className="px-6 py-3 text-xl font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm tin tức
            </button>
          </div>
        </div>

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <StatsCards news={news} />

        <NewsTable
          news={news}
          loading={loading}
          selectedNews={selectedNews}
          currentPage={currentPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          toggleNewsSelection={toggleNewsSelection}
          selectAllNews={selectAllNews}
          clearSelection={clearSelection}
          setCurrentPage={setCurrentPage}
          deleteNews={deleteNews}
          deleteMultipleNews={deleteMultipleNews}
          getPaginatedNews={getPaginatedNews}
          handleSort={handleSort}
          onNavigate={onNavigate}
          searchTerm={searchTerm}
          onSearch={handleSearchChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminNews;

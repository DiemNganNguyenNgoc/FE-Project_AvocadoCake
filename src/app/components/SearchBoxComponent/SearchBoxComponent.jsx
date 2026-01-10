import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../../assets/css/style.css";
import "../../assets/css/reset.css";
import styles from "./SearchBoxComponent.module.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import VoiceComponent from "../VoiceComponent/VoiceComponent";
import ImageSearchComponent from "../ImageSearchComponent/ImageSearchComponent";
import {
  getSearchSuggestions,
  searchWithHistory,
} from "../../api/services/SearchHistoryService";
import { searchByImage } from "../../api/services/ImageSearchService";
import { useNavigate } from "react-router-dom";

const SearchBoxComponent = ({ onSearch, onButtonClick }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy access token từ localStorage (hoặc từ context/redux tùy cách bạn quản lý)
  const getAccessToken = () => {
    return localStorage.getItem("access_token"); // Sử dụng tên key phổ biến
  };

  // Debounce function
  const debounce = useMemo(() => {
    return (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    };
  }, []);

  // Lấy suggestions từ lịch sử tìm kiếm
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      // Nếu không có token thì không hiển thị suggestions
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getSearchSuggestions(
        searchQuery.trim(),
        accessToken,
        5
      );
      if (result.success && result.data && result.data.length > 0) {
        setSuggestions(result.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.warn("Could not fetch suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced version của fetchSuggestions
  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 300),
    [debounce, fetchSuggestions]
  );

  // Effect để fetch suggestions khi query thay đổi
  useEffect(() => {
    debouncedFetchSuggestions(query);
  }, [query, debouncedFetchSuggestions]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (searchQuery = query) => {
    const trimmedQuery = searchQuery.trim();
    console.log("🔍 HandleSearch called with:", trimmedQuery);

    if (trimmedQuery) {
      const accessToken = getAccessToken();
      console.log("🔑 Access Token:", accessToken ? "Found" : "Not Found");

      try {
        // Lưu lịch sử tìm kiếm (nếu có token)
        if (accessToken) {
          console.log("💾 Attempting to save search history...");
          const historyResult = await searchWithHistory(
            trimmedQuery,
            accessToken
          );
          console.log("💾 Search history result:", historyResult);

          // Hiển thị warning nếu có
          if (!historyResult.success && historyResult.warning) {
            console.warn(historyResult.warning);
          }
        }

        // Thực hiện tìm kiếm (luôn cho phép search dù không có token)
        onSearch(trimmedQuery);

        // Ẩn suggestions sau khi search
        setShowSuggestions(false);
      } catch (error) {
        // Ngay cả khi lưu lịch sử thất bại, vẫn thực hiện tìm kiếm
        console.warn("Search history save failed:", error);
        onSearch(trimmedQuery);
        setShowSuggestions(false);
      }
    } else {
      alert("Vui lòng nhập từ khóa tìm kiếm.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleVoiceInput = (speechResult) => {
    if (speechResult.trim()) {
      setQuery(speechResult);
      // Đợi một chút để cập nhật xong rồi mới tìm kiếm
      setTimeout(() => handleSearch(speechResult.trim()), 200);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick(query);
    } else {
      handleSearch();
    }
  };

  // Ẩn suggestions khi click bên ngoài
  const handleBlur = () => {
    // Delay để cho phép click vào suggestion trước khi ẩn
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleImageSearch = async (imageFile) => {
    try {
      console.log("🖼️ Starting image search...");
      setIsLoading(true);

      // Call Image Search API with threshold 0.65
      const result = await searchByImage(imageFile, 10, 0.65);

      if (result.success && result.data && result.data.length > 0) {
        console.log("✅ Image search successful:", result.data);

        // Navigate to search results page with image search results
        navigate("/search/image-results", {
          state: { results: result.data, searchType: "image" },
        });
      } else {
        console.log("⚠️ No results found");
        alert("Không tìm thấy sản phẩm tương tự. Vui lòng thử ảnh khác!");
      }
    } catch (error) {
      console.error("❌ Image search error:", error);
      alert("Có lỗi xảy ra khi tìm kiếm bằng hình ảnh. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.search__wrapper}>
      <div className={styles.search__input_container}>
        <input
          className={styles.search__component}
          type="search"
          placeholder="Nhập tên sản phẩm..."
          aria-label="Search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className={styles.suggestions__dropdown}>
            {isLoading ? (
              <div className={styles.suggestion__item_loading}>
                Đang tải gợi ý...
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={styles.suggestion__item}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className={styles.suggestion__icon}>🔍</span>
                  {suggestion}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ImageSearchComponent onImageSearch={handleImageSearch} />
      <VoiceComponent onVoiceInput={handleVoiceInput} />
      <ButtonComponent className="search__button" onClick={handleButtonClick}>
        Tìm kiếm
      </ButtonComponent>
    </div>
  );
};

export default SearchBoxComponent;

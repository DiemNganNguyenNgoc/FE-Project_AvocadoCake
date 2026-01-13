import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { processQuery } from "../../api/services/ChatbotService";
import styles from "./ChatbotComponent.module.css";
import { FaPaperPlane, FaTimes, FaRobot, FaUser } from "react-icons/fa";
import { getDetailsproduct } from "../../api/services/productServices";
import { useNavigate } from "react-router-dom";

const ChatbotComponent = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Xin chào! Tôi là trợ lý AI của AVOCADO. Bạn có thể hỏi tôi về các sản phẩm của AVOCADO, cách mua hàng. Tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null); // Lưu session ID cho conversation
  const user = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {
      type: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await processQuery(input, user?.id || null);
      console.log("BOT RESPONSE RAW:", response);
      console.log("BOT RESPONSE MESSAGE:", response.status, response.message);
      // Add bot response to chat
      if (response.status === "200" || response.text != null) {
        const botMessage = {
          type: "bot",
          content: response.text,
          data: response.data,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Error response from chatbot:", response);
        throw new Error(response.message || "Đã xảy ra lỗi");
      }
    } catch (error) {
      console.error("Full error object:", error); // log toàn bộ error
      console.error("Backend response data:", error.response); // log data gốc
      const errorMessage = {
        type: "bot",
        content:
          error.response?.data?.message ||
          "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchProduct = async (productId) => {
    try {
      const res = await getDetailsproduct(productId);
      const product = res.data;
      console.log("Product data fetched:", product);

      // Navigate with the fetched product data directly
      navigate(`/view-product-detail/${productId}`, {
        state: {
          productId: product._id,
          productName: product.productName,
          productSize: product.productSize,
          productImage: product.productImage,
          productDescription: product.productDescription,
          productCategory: product.productCategory._id,
          productPrice: product.productPrice,
          averageRating: product.averageRating || 5.0,
          totalRatings: product.totalRatings || 0,
          discount: product.discount || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const renderMessageContent = (message) => {
    console.log("MESSAGE DATA:", message.content);

    if (message.isError) {
      return <div className={styles["error-message"]}>{message.content}</div>;
    }

    // Khi click vào link sản phẩm
    const handleClick = (e) => {
      const link = e.target.closest("a");
      if (link) {
        e.preventDefault(); // Ngăn reload trang

        const match = link
          .getAttribute("href")
          .match(/\/view-product-detail\/([a-f0-9]+)/);
        if (match) {
          const productId = match[1];
          console.log("Product ID:", productId);
          fetchProduct(productId);
        }
      }
    };

    return (
      <div
        className={styles["message-wrapper"]}
        onClick={handleClick} // gắn sự kiện click
      >
        {message.content && (
          <div
            className="chat-message"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles["chatbot-container"]}>
      {/* Chatbot toggle button */}
      <button
        className={`w-20 h-20 p-2 ${styles["chatbot-toggle"]} ${isOpen ? styles["open"] : ""
          }`}
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className={styles["chatbot-window"]}>
          <div className={styles["chatbot-header"]}>
            <h3>Trợ lý AI AVOCADO</h3>
            <button
              className={styles["close-button"]}
              onClick={toggleChatbot}
              aria-label="Close chatbot"
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles["chatbot-messages"]}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles["message"]} ${message.type === "bot" ? styles["bot"] : styles["user"]
                  }`}
              >
                <div className={styles["message-avatar"]}>
                  {message.type === "bot" ? <FaRobot /> : <FaUser />}
                </div>
                <div className={styles["message-content"]}>
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles["message"]} ${styles["bot"]}`}>
                <div className={styles["message-avatar"]}>
                  <FaRobot />
                </div>
                <div className={styles["message-content"]}>
                  <div className={styles["typing-indicator"]}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className={styles["chatbot-input"]}
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Nhập câu hỏi để AVOCADO tư vấn..."
              disabled={isLoading}
              ref={inputRef}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;

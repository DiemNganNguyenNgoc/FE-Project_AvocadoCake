import axios from "axios";

const PRICE_API_URL =
  process.env.REACT_APP_PRICE_API_URL || "https://rcm-price.onrender.com";

/**
 * Service để gọi API từ RCM_PRICE backend
 * Full Event Promotion System Integration
 */
class StratergyService {
  // ============================================================================
  // EVENT PROMOTION APIs
  // ============================================================================

  /**
   * 1. Phân tích hiệu suất sản phẩm
   * GET /api/event-promotions/analyze-products
   *
   * @param {number} analysisPeriodDays - Số ngày phân tích (7-90)
   * @returns {Promise} Danh sách sản phẩm với trạng thái và khuyến nghị
   */
  async analyzeProducts(analysisPeriodDays = 30) {
    try {
      const response = await axios.get(
        `${PRICE_API_URL}/api/event-promotions/analyze-products`,
        {
          params: { analysis_period_days: analysisPeriodDays },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error analyzing products:", error);
      throw error;
    }
  }

  /**
   * 2. Phát hiện combo sản phẩm tiềm năng
   * GET /api/event-promotions/discover-combos
   *
   * @param {number} minSupport - Ngưỡng support tối thiểu (0.01-0.5)
   * @param {number} minConfidence - Ngưỡng confidence tối thiểu (0.1-0.9)
   * @returns {Promise} Danh sách combo suggestions
   */
  async discoverCombos(minSupport = 0.05, minConfidence = 0.3) {
    try {
      const response = await axios.get(
        `${PRICE_API_URL}/api/event-promotions/discover-combos`,
        {
          params: {
            min_support: minSupport,
            min_confidence: minConfidence,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error discovering combos:", error);
      throw error;
    }
  }

  /**
   * 2.1. Lấy combo sản phẩm cho một sản phẩm cụ thể
   * Từ danh sách combo, tìm những combo chứa productId
   *
   * @param {string} productId - ID của sản phẩm
   * @param {number} minSupport - Ngưỡng support tối thiểu (0.01-0.5)
   * @param {number} minConfidence - Ngưỡng confidence tối thiểu (0.1-0.9)
   * @returns {Promise} Danh sách combo chứa sản phẩm này
   */
  async getProductCombos(productId, minSupport = 0.01, minConfidence = 0.3) {
    try {
      const response = await this.discoverCombos(minSupport, minConfidence);
      console.log("Raw combo response:", response);

      // response đã là mảng combos trực tiếp từ discoverCombos
      if (Array.isArray(response)) {
        const productCombos = response.filter(
          (combo) =>
            combo.product_1_id === productId || combo.product_2_id === productId
        );
        console.log(
          "Filtered combos for product",
          productId,
          ":",
          productCombos
        );
        return productCombos;
      }

      return [];
    } catch (error) {
      console.error("Error getting product combos:", error);
      return [];
    }
  }

  /**
   * 3. Lấy danh sách sự kiện sắp tới
   * GET /api/event-promotions/upcoming-events
   *
   * @param {number} daysAhead - Số ngày nhìn về tương lai (7-365)
   * @returns {Promise} Danh sách events
   */
  async getUpcomingEvents(daysAhead = 60) {
    try {
      const response = await axios.get(
        `${PRICE_API_URL}/api/event-promotions/upcoming-events`,
        {
          params: { days_ahead: daysAhead },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  }

  /**
   * 4. Tạo đề xuất khuyến mãi dựa trên sự kiện (AI-powered)
   * POST /api/event-promotions/generate-event-promotion
   *
   * @param {number} daysAhead - Số ngày tìm event trong tương lai (7-365)
   * @param {string|null} eventType - Loại sự kiện cụ thể hoặc null = tất cả
   * @returns {Promise} Response chứa danh sách promotions
   */
  async getEventPromotions(daysAhead = 7, eventType = null) {
    try {
      const params = { days_ahead: daysAhead };
      if (eventType) {
        params.event_type = eventType;
      }

      const response = await axios.post(
        `${PRICE_API_URL}/api/event-promotions/generate-event-promotion`,
        null,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching event promotions:", error);
      throw error;
    }
  }

  /**
   * 5. Tạo khuyến mãi thông minh không phụ thuộc sự kiện
   * POST /api/event-promotions/generate-smart-promotion
   *
   * @param {string} focus - revenue | clearance | balanced
   * @returns {Promise} Single promotion recommendation
   */
  async generateSmartPromotion(focus = "balanced") {
    try {
      const response = await axios.post(
        `${PRICE_API_URL}/api/event-promotions/generate-smart-promotion`,
        null,
        { params: { focus } }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating smart promotion:", error);
      throw error;
    }
  }

  /**
   * 6. Health check cho event promotions service
   * GET /api/event-promotions/health
   *
   * @returns {Promise} Health status
   */
  async getEventPromotionsHealth() {
    try {
      const response = await axios.get(
        `${PRICE_API_URL}/api/event-promotions/health`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching event promotions health:", error);
      throw error;
    }
  }

  /**
   * General health check
   * GET /health
   *
   * @returns {Promise} Health status
   */
  async getHealthStatus() {
    try {
      const response = await axios.get(`${PRICE_API_URL}/health`);
      return response.data;
    } catch (error) {
      console.error("Error fetching health status:", error);
      throw error;
    }
  }

  /**
   * Format response từ API để hiển thị trong UI
   * @param {Object} data - Raw API response
   * @returns {Object} Formatted data
   */
  formatPromotionResponse(data) {
    if (!data || !data.data || !data.data.promotions) {
      return {
        summary: "Không có khuyến nghị nào",
        promotions: [],
        metadata: {},
      };
    }

    const { promotions, metadata } = data.data;

    return {
      summary: `Tìm thấy ${promotions.length} chương trình khuyến mãi được đề xuất`,
      promotions: promotions.map((promo) => ({
        eventName: promo.event_name,
        eventDate: promo.event_date,
        eventType: promo.event_type,
        description: promo.description,
        startDate: promo.start_date,
        endDate: promo.end_date,
        durationDays: promo.duration_days,
        products: promo.products.map((product) => ({
          id: product.product_id,
          name: product.product_name,
          currentPrice: product.current_price,
          discountPercent: product.discount_percent,
          discountedPrice: product.discounted_price,
          expectedRevenue: product.expected_revenue,
          confidence: product.confidence,
          aiMethod: product.ai_optimization_method,
          reasoning: product.reasoning,
        })),
      })),
      metadata: {
        totalEvents: metadata.total_events_detected,
        analyzedProducts: metadata.total_products_analyzed,
        suitableProducts: metadata.suitable_products_count,
        generatedAt: metadata.generated_at,
        daysAhead: metadata.days_ahead,
        analysisPeriod: metadata.analysis_period_days,
      },
    };
  }
}

const stratergyServiceInstance = new StratergyService();
export default stratergyServiceInstance;

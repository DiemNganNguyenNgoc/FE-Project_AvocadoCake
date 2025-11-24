import ReportPage from "../pages/Admin/CRUDReport/ReportPage";
import DetailCategoryPage from "../pages/Admin/CRUDCategory/DetailCategoryPage/DetailCategoryPage";
import UpdateCategoryPage from "../pages/Admin/CRUDCategory/UpdateCategoryPage/UpdateCategoryPage";
import AddCategoryPage from "../pages/Admin/CRUDCategory/AddCategoryPage/AddCategoryPage";
import CategoryListPage from "../pages/Admin/CRUDCategory/CategoryListPage/CategoryListPage";
import UpdateStatusPage from "../pages/Admin/CRUDStatus/UpdateStatusPage/UpdateStatusPage";
import AddStatusPage from "../pages/Admin/CRUDStatus/AddStatusPage/AddStatusPage";
import StatusListPage from "../pages/Admin/CRUDStatus/StatusListPage/StatusListPage";
import AddDiscountPage from "../pages/Admin/CRUDDiscount/AddDiscountPage/AddDiscountPage";
import DiscountListPage from "../pages/Admin/CRUDDiscount/DiscountListPage/DiscountListPage";
import AddProductPage from "../pages/Admin/CRUDProduct/AddProductPage/AddProductPage";
import UpdateProductPage from "../pages/Admin/CRUDProduct/UpdateProductPage/UpdateProductPage";
import ViewProductDetailPage from "../pages/User/ProductDetail/ViewProductDetailPage";
import StoreInfoPage from "../pages/Admin/CRUDStoreInfo/StoreInfoPage";
import ForgotPassword from "../pages/ForgotPasswordPage/pages/EnterEmail";
import EnterNewPassword from "../pages/ForgotPasswordPage/pages/EnterNewPassword";
import EnterOTP from "../pages/ForgotPasswordPage/pages/EnterOTP";
import LogInPage from "../pages/LogInPage/LogInPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import BankingInfoPage from "../pages/User/BankingInfoPage/BankingInfoPage";
import ContactPage from "../pages/User/ContactPage/ContactPage";
import HomePage from "../pages/User/HomePage/HomePage";
import IntroducePage from "../pages/User/IntroducePage/IntroducePage";
import NewsPage from "../pages/User/NewsPage/NewsPage";
import ProductsPage from "../pages/User/ProductsPage/ProductsPage";
import UserInfoPage from "../pages/User/UserInfoPage/UserInfoPage";
import CartPage from "../pages/User/CartPage/CartPage";
import OrderInformationPage from "../pages/User/OrderInformationPage/OrderInformationPage";
import OrderHistoryPage from "../pages/User/OrderHistoryPage/OrderHistoryPage";
import UserListPage from "../pages/Admin/CRUDUser/UserListPage/UserListPage";
import PaymentPage from "../pages/User/PaymentPage/PaymentPage";
import OrderDetailHistoryPage from "../pages/User/OrderDetailHistoryPage/OrderDetailHistoryPage";
import NewsPageAdmin from "../pages/Admin/CRUDNews/NewsPage/NewsPage";
import AddNews from "../pages/Admin/CRUDNews/AddNews/AddNews";
import UpdateStatus from "../pages/Admin/CRUDOrderStatus/UpdateStatus/UpdateStatus";
import ProductPageAdmin from "../pages/Admin/CRUDProduct/ProductPageAdmin/ProductPageAdmin";
import OrderListPage from "../pages/Admin/CRUDOrderStatus/OrderListPage/OrderListPage";
import OrderDetailPage from "../pages/Admin/CRUDOrderStatus/OrderDetailPage/OrderDetailPage";
import UpdateContact from "../pages/Admin/CRUDContact/UpdateContact/UpdateContact";
import AddUserPage from "../pages/Admin/CRUDUser/AddUserPage/AddUserPage";
import NewsDetailPage from "../pages/User/NewsDetailPage/NewsDetailPage";
import SearchResultPage from "../pages/SearchResultPage/SearchResultPage";
import NewsDetailPageAdmin from "../pages/Admin/CRUDNews/NewsDetailPageAdmin/NewsDetailPage";
import UserTab from "../pages/User/UserTab/UserTab.jsx";
import PaymentResultPage from "../pages/PaymentResultPage/PaymentResultPage";
import OrderRatingPage from "../pages/User/OrderRatingPage/OrderRatingPage";
import CreateArt from "../pages/User/CreateArt/CreateArt";
import QuizzPage from "../pages/User/QuizzPage/QuizzPage.jsx";
import AddQuizPage from "../pages/Admin/CRUDQuiz/AddQuizPage/AddQuizPage.jsx";
import ListQuizPage from "../pages/Admin/CRUDQuiz/ListQuizPage/ListQuizPage.jsx";
import UpdateQuizPage from "../pages/Admin/CRUDQuiz/UpdateQuizPage/UpdateQuizPage.jsx";
import DeleteQuizPage from "../pages/Admin/CRUDQuiz/DeleteQuizPage/DeleteQuizPage.jsx";
import MiniGamePage from "../pages/User/MiniGamePage/MiniGamePage.jsx";
import HomeAdminPage from "../pages/Admin/HomeAdminPage/HomeAdminPage.jsx";
import DesignCakePage from "../pages/User/DesignCakePage/DesignCakePage.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import AdminTab from "../pages/Admin/AdminTab/AdminTab.jsx";
import AddCategory from "../pages/Admin/AdminCategory/usecases/AddCategory.jsx";
import UpdateCategory from "../pages/Admin/AdminCategory/usecases/UpdateCategory.jsx";
import AdminCategory from "../pages/Admin/AdminCategory/AdminCategory.jsx";
import AdminRecipe from "../pages/Admin/AdminRecipe/AdminRecipe.jsx";
import AdminStratergy from "../pages/Admin/AdminStratergy/AdminStratergy.jsx";
import PublicVoucherPage from "../pages/PublicVoucherPage/PublicVoucherPage.jsx";
import MyVouchersPage from "../pages/MyVouchersPage/MyVouchersPage.jsx";
import ImageSearchResultsPage from "../pages/ImageSearchResultsPage/ImageSearchResultsPage.jsx";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowFooter: true,
  },

  // {
  //   path: "/order",
  //   page: OrderPage,
  //   isShowHeader: true,
  //   isShowFooter: true,
  // },

  {
    path: "/products",
    page: ProductsPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/introduce",
    page: IntroducePage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/signup",
    page: SignUpPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/login",
    page: LogInPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/forgot-password",
    page: ForgotPassword,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/forgot-password/enter-otp",
    page: EnterOTP,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/forgot-password/new-password",
    page: EnterNewPassword,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/profile",
    page: UserTab,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/user-info",
    page: UserInfoPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/order-history",
    page: OrderHistoryPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/order-rating/:orderId",
    page: OrderRatingPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/order-detail-history/:orderId",
    page: OrderDetailHistoryPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/contact",
    page: ContactPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/news",
    page: NewsPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/add-product",
    page: AddProductPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },
  {
    path: "/view-product-detail/",
    page: ViewProductDetailPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/admin/update-product",
    page: UpdateProductPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/banking-info",
    page: BankingInfoPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/store-info",
    page: StoreInfoPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/discount-list",
    page: DiscountListPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/add-discount",
    page: AddDiscountPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/status-list",
    page: StatusListPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/add-status",
    page: AddStatusPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/update-status",
    page: UpdateStatusPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/category-list",
    page: CategoryListPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/add-category",
    page: AddCategoryPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/update-category",
    page: UpdateCategoryPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/detail-category",
    page: DetailCategoryPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/report",
    page: ReportPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/",
    page: HomeAdminPage,
    isShowHeader: true,
    // isShowFooter: true,
    isPrivate: true,
  },
  {
    path: "/admin/*", // Tất cả các route con của admin
    page: AdminTab, // AdminTab sẽ quản lý các tab và nội dung
    isPrivate: true,
  },

  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/order-information",
    page: OrderInformationPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/user-list",
    page: UserListPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/add-user",
    page: AddUserPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/order-list",
    page: OrderListPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/order-detail/",
    page: OrderDetailPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin-tab",
    page: AdminTab,
    // isShowHeader: true,
    // isShowFooter: true,
    isPrivate: true,
  },
  {
    path: "/admin/news",
    page: NewsPageAdmin,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },
  {
    path: "/admin/news/add-news",
    page: AddNews,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },
  {
    path: "/admin/order-status/update",
    page: UpdateStatus,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },
  {
    path: "/admin/introduce",
    page: UpdateContact,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },
  {
    path: "/admin/products",
    page: ProductPageAdmin,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },
  // {
  //   path: "/admin/dashboard",
  //   page: AdminDashboard,
  //   // isShowHeader: true,
  //   // isShowFooter: true,
  //   isPrivate: true,
  // },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
    isShowFooter: false,
  },
  {
    path: "/news-detail",
    page: NewsDetailPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/news-detail",
    page: NewsDetailPageAdmin,
    isShowHeader: true,
    // isShowFooter: true,
  },
  {
    path: "/search",
    page: SearchResultPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/search/image-results",
    page: ImageSearchResultsPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/payment-result",
    page: PaymentResultPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/create-cake",
    page: CreateArt,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/quizz",
    page: QuizzPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/admin/add-quiz",
    page: AddQuizPage,
    isShowHeader: true,
  },
  {
    path: "/admin/quiz-list",
    page: ListQuizPage,
    isShowHeader: true,
  },
  {
    path: "/admin/update-quiz/:quizId",
    page: UpdateQuizPage,
    isShowHeader: true,
  },
  {
    path: "/admin/delete-quiz",
    page: DeleteQuizPage,
    isShowHeader: true,
    // isShowFooter: true,
  },

  {
    path: "/minigame",
    page: MiniGamePage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/design-cake",
    page: DesignCakePage,
    isShowHeader: true,
    isShowFooter: true,
  },

  // Voucher Routes - Public
  {
    path: "/vouchers",
    page: PublicVoucherPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/my-vouchers",
    page: MyVouchersPage,
    isShowHeader: true,
    isShowFooter: true,
  },
];

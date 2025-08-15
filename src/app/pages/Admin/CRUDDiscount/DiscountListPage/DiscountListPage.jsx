import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent/CheckboxComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import { deleteDiscount, getAllDiscount } from "../../../../services/DiscountService";
import "./DiscountListPage.css";

const DiscountListPage = () => {
  const accessToken = localStorage.getItem("access_token");
  const [selectedRows, setSelectedRows] = useState([]);
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/category/get-all-category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setCategories(data.data); // Lưu danh sách category
        } else {
          console.error("Categories data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch danh sách khuyến mãi
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discounts = await getAllDiscount();
        if (Array.isArray(discounts.data)) {
          const updatedDiscounts = await getAllDiscount();
          if (Array.isArray(updatedDiscounts.data)) {
            setPromos(updatedDiscounts.data);
          }

        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách khuyến mãi.");
      }
    };
    fetchDiscounts();
  }, []);

  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.categoryName : "Không xác định";
  };


  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === promos.length
        ? [] // Nếu tất cả đã được chọn, bỏ chọn tất cả
        : promos.map((promo) => promo._id) // Chọn tất cả
    );
  };

  const isSelected = (id) => selectedRows.includes(id);
  const toggleSelectRow = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        // Nếu dòng đã được chọn, bỏ chọn
        return prev.filter((rowId) => rowId !== id);
      } else {
        // Nếu dòng chưa được chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  const [activeTab, setActiveTab] = useState("discount");

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };

  //Xóa
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Vui lòng chọn một khuyến mãi để xóa.");
    } else if (selectedRows.length > 1) {
      alert("Vui lòng chỉ chọn một khuyến mãi để xóa.");
    } else {
      try {
        // Gọi API xóa khuyến mãi
        await deleteDiscount(selectedRows[0], accessToken); // Gửi chỉ 1 ID khuyến mãi
        setPromos((prevPromos) => prevPromos.filter((promo) => promo.id !== selectedRows[0]));
        setSelectedRows([]); // Dọn dẹp danh sách đã chọn
        alert("Khuyến mãi đã được xóa.");
        navigate('/admin/discount-list')
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa khuyến mãi.");
      }
    }
  };


  return (
    <div>
      <div className="container-xl">
        <div className="discount-list__info">
          {/* Side menu */}
          <div className="side-menu__discount">
            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </div>

          {/* Discount list */}
          <div className="discount-list__content">
            <div className="discount-list__action">
              <h2 className="discount-list__title">Danh sách khuyến mãi</h2>
              <div className="btn__action">
                <ButtonComponent className="btn btn-delete" onClick={handleDelete}>Xóa</ButtonComponent>

                <ButtonComponent
                  className="btn btn-add"
                  onClick={() => navigate("/admin/add-discount")}
                >
                  Thêm
                </ButtonComponent>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="promo-table">
                <thead>
                  <tr>
                    <th>
                      <CheckboxComponent
                        isChecked={selectedRows.length === promos.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>STT</th>
                    <th>Mã khuyến mãi</th>
                    <th>Tên khuyến mãi</th>
                    <th>Giá trị khuyến mãi</th>
                    <th>Các sản phẩm áp dụng</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.length > 0 ? (
                    promos.map((promo, index) => (
                      <tr
                        key={promo.id}
                        className={isSelected(promo.id) ? "highlight" : ""}
                      >
                        <td>
                          <CheckboxComponent
                            isChecked={isSelected(promo._id)}
                            onChange={() => toggleSelectRow(promo._id)}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{promo.discountCode}</td>
                        <td>{promo.discountName}</td>
                        <td>{promo.discountValue} %</td>
                        <td>{promo.discountProduct.map(p => p.productName).join(" , ")}</td>

                        <td>{promo.discountStartDate}</td>
                        <td>{promo.discountEndDate}</td>
                      
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">Không có khuyến mãi nào để hiển thị.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountListPage;

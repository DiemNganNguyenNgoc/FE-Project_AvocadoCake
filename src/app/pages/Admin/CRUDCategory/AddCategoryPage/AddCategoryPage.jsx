import React, { useState } from "react";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import "./AddCategoryPage.css";
import { useNavigate } from "react-router-dom";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import { createCategory } from "../../../../api/services/CategoryService";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    categoryCode: "",
    categoryName: "",
  });
  const ExitForm = () => {
    navigate("/admin/category-list");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        alert(
          "Bạn chưa đăng nhập. Vui lòng đăng nhập để thực hiện thao tác này."
        );
        return;
      }

      await createCategory(category, accessToken);

      alert("Thêm loại bánh thành công!");

      // Reset form
      setCategory({
        categoryCode: "",
        categoryName: "",
      });

      navigate("/admin/category-list");
    } catch (error) {
      alert(error.message || "Đã xảy ra lỗi khi thêm loại bánh!");
      console.error(error);
    }
  };
  const [activeTab, setActiveTab] = useState("category");

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };

  return (
    <div>
      <div className="container-xl">
        <div className="add-category__container">
          {/* side menu */}
          <div className="side-menu__category">
            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </div>
          <div className="add-category__content">
            <div className="category__info">
              <div className="add_category__title">
                <label>Thêm loại bánh</label>
              </div>
              <div className="content">
                <div className="content__item">
                  <label className="id__title">Mã loại bánh</label>
                  <FormComponent
                    placeholder="C6"
                    name="categoryCode"
                    value={category.categoryCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="content__item">
                  <label className="name__title">
                    Tên loại bánh{" "}
                    <i
                      className="fas fa-pencil-alt"
                      style={{ marginLeft: "5px" }}
                    ></i>
                  </label>
                  <FormComponent
                    placeholder="Bánh mùa đông"
                    name="categoryName"
                    value={category.categoryName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* button */}
              <div className="btn__add-category">
                <ButtonComponent onClick={handleSubmit}>Thêm</ButtonComponent>
                <ButtonComponent onClick={ExitForm}>Thoát</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;

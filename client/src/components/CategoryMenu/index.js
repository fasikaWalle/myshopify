import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useStoreContext } from "../../utils/GlobalState";

import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  SEARCH_PRODUCTS,
  UPDATE_PRODUCT,
} from "../../utils/actions";
import { QUERY_CATEGORIES } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";
import { FaSearch } from "react-icons/fa";

function CategoryMenu() {
  const [state, dispatch] = useStoreContext();
  const [search, setSearch] = useState("");
  const { categories, products } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise("categories", "put", category);
      });
    } else if (!loading) {
      idbPromise("categories", "get").then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };
  const searchProduct = (e) => {
    e.preventDefault();
    if (search) {
      dispatch({
        type: SEARCH_PRODUCTS,
        name: search,
      });
      setSearch("");
    } 
  };
  console.log(state);
  return (
    <>
      <div className="category-menu">
        <div className="category">
          {categories.map((item) => (
            <button
              key={item._id}
              onClick={() => {
                handleClick(item._id);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="input">
          <input
            placeholder="Search product ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                searchProduct(e);
              }
            }}
          />
          <FaSearch className="search-icon" onClick={searchProduct} />
        </div>
      </div>
    </>
  );
}

export default CategoryMenu;

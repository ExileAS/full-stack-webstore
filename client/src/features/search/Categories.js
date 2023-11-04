import { useContext } from "react";
import { CategoriesContext } from "../../contexts/categories-context";

const Categories = () => {
  const { setCategory } = useContext(CategoriesContext);

  return (
    <div className="categories">
      <select
        onChange={(e) => setCategory(e.target.value)}
        className="select-category"
      >
        <option value="" key="0" className="">
          Categories
        </option>
        <option value="devices" key="devices">
          devices
        </option>
        <option value="clothes" key="clothes">
          clothes
        </option>
        <option value="accessories" key="accessories">
          accessories
        </option>
        <option value="others" key="others">
          others
        </option>
      </select>
    </div>
  );
};

export default Categories;

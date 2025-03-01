import DEFAULT_CATEGORIES from "../data/DefaultCategories";
const { useContext } = require("react");
const { DataContext } = require("../stacks/MainAppStack");

export default function useCategory(id) {
  const userGeneratedCategories = useContext(DataContext)?.docs.find(x => x.id === "categories")?.data() ?? {};

  return DEFAULT_CATEGORIES[id]?? userGeneratedCategories[id]?? 
    { 
      color: "#000000",
      icon: "fa-solid fa-bug",
      id: "error",
      name: "error",
      type: "expenses"
    };
}
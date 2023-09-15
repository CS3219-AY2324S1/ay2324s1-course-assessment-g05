enum Category {
  LINKED_LIST = "Linked List",
}

export const convertStringToCategory = (category: string): Category => {
  switch (category) {
    case "Linked List":
      return Category.LINKED_LIST;
    default:
      throw new Error(`Category ${category} not found.`);
  }
};

export default Category;

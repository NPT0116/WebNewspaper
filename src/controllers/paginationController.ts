export const paginate = async (model: any, query: any, pageNum: number, pageSize: number) => {
  const skip = (pageNum - 1) * pageSize;
  const items = await model.find(query).skip(skip).limit(pageSize);

  const totalItems = await model.countDocuments(query);

  return {
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage: pageNum,
    itemsPerPage: pageSize,
    data: items
  };
};

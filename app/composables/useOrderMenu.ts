export const useOrderMenu = () => {
  const menu = useCustomerMenu()

  return {
    products: menu.products,
    filteredProducts: menu.filteredProducts,
    searchQuery: menu.searchQuery,
    categories: menu.categories,
    activeCategory: menu.activeCategory,
    totalCount: menu.totalCount,
    pending: menu.pending,
    error: menu.error,
    loadForSession: menu.fetchMenu,
    loadForOrg: menu.fetchMenuByOrgId,
    loadForOrgSlug: menu.fetchMenuByOrgSlug,
    findProductById: menu.findProductById,
    setCategory: menu.setCategory
  }
}

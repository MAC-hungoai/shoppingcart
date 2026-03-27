const CartUtil = {
  getTotal(mycart) {
    let total = 0;

    for (const item of mycart) {
      total += Number(item.product.price) * Number(item.quantity);
    }

    return total;
  },
};

export default CartUtil;

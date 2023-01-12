/* eslint-disable import/no-anonymous-default-export */
import Service from "./index";

export default {
  createItem(data) {
    return Service.post("/user/createNewItem", data);
  },
  createSize(data) {
    return Service.post("/user/createNewSize", data);
  },
  getItemList(currentPage, limit) {
    return Service.get(
      "user/fetchItemList?page=" + currentPage + "&limit=" + limit
    );
  },
  getSizeList(currentPage, limit) {
    return Service.get(
      "user/fetchSizeList?page=" + currentPage + "&limit=" + limit
    );
  },
  updateItem(data) {
    return Service.post("/user/updateItems", data);
  },
  updateSize(data) {
    return Service.post("/user/updateSizes", data);
  },
  getItemsData() {
    return Service.get("/user/fetchItems/");
  },
  fetchOrderNo() {
    return Service.get("/user/fetchOrderNumber/");
  },
  fetchSizetypeList() {
    return Service.get("/user/fetchSizeType/");
  },
  saveOrders(orderNo, billAmount, data) {
    return Service.post(
      "/user/saveOrderData/?orderNo=" + orderNo + "&billAmount=" + billAmount,
      data
    );
  },
  getOrderList(currentPage, limit) {
    return Service.get(
      "user/fetchOrderList?page=" + currentPage + "&limit=" + limit
    );
  },
  getCustomerList(currentPage, limit) {
    return Service.get(
      "user/fetchCustomerList?page=" + currentPage + "&limit=" + limit
    );
  },
  createCustomer(data) {
    return Service.post("/user/createCustAccount", data);
  },  
  updateCust(data) {
    return Service.post("/user/updateCustomer", data);
  },
  getCustomersList() {
    return Service.get("/user/fetchCustomersList/");
  },  
  assignBill(data){
    return Service.post("/user/assignCustBill", data);
  }
};

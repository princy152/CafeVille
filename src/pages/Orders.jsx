import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormGroup, Table } from "reactstrap";
import ReactTooltip from "react-tooltip";
import * as FaIcons from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import userServices from "../services/user";
import ReactPaginate from "react-paginate";
import moment from "moment";
export const AddSize = () => {
  const [pageCount, setpageCount] = useState(1);
  const [showList, setshowList] = useState(true);
  const [inputDiv, setshowInput] = useState(false);
  const [size, setSizeName] = useState("");
  const [orderList, setOrderList] = useState("");
  const [fieldId, setFieldId] = useState(true);
  const [action, setAction] = useState(true);

  const limit = 10;
  useEffect(() => {
    getOrders(1, limit);
  }, []);

  const getOrders = (currentPage) => {
    userServices
      .getOrderList(currentPage, limit)
      .then((response) => {
        console.log(response);
        const filterSize = response.data.data.results;
        const total = response.data.total;
        setpageCount(Math.ceil(total / limit));
        setOrderList(filterSize);
      })
      .catch(function (error) {});
  };

  const handlePageClick = async (data) => {
    const currentPage = data.selected + 1;
    const usersFromServer = getOrders(currentPage, limit);
    setOrderList(usersFromServer);
  };

  return (
    <>
      <Sidebar />
      <Container>
        <Row>
          <Col md={2} xs={1}></Col>
          <Col md={10} xs={10} className="form-container">
            <h6>Order List</h6>
            <hr />
            <FormGroup>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order No.</th>
                    <th>items</th>
                    <th>Billed Amount</th>
                    <th>Billed At</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList
                    ? orderList.map((i, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <b>{i.orderNo}</b>
                            </td>
                            <td>
                              {i.orderItem.map
                                ? i.orderItem.map((j, index2) => {
                                    return (
                                      <ul key={index2}>
                                        <li>
                                          {" "}
                                          {j.itemId.name} x {j.quantity}
                                        </li>
                                      </ul>
                                    );
                                  })
                                : null}
                              <ul></ul>
                            </td>
                            <td>{i.billAmount}</td>
                            <td>{moment(i.createdAt).format("ddd, D/M/Y")}</td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </Table>
              <ReactPaginate
                previousLabel={"<< Pre"}
                nextLabel={"Next >>"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item shadow"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item shadow"}
                previousLinkClassName={"page-link "}
                nextClassName={"page-item shadow"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item shadow"}
                breakLinkClassName={"page-link"}
                activeClassName={"active shadow"}
              />
            </FormGroup>
          </Col>
          <Col xs={1}></Col>
        </Row>
      </Container>
    </>
  );
};

export default AddSize;

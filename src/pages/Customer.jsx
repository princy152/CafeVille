import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Form,
  Table,
} from "reactstrap";
import swal from "sweetalert";
import ReactTooltip from "react-tooltip";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import Sidebar from "../components/Sidebar";
import userServices from "../services/user";
import ReactPaginate from "react-paginate";
import Button1 from "react-bootstrap/Button";
export const Customer = () => {
  const [pageCount, setpageCount] = useState(1);
  const [showList, setshowList] = useState(true);
  const [inputDiv, setshowInput] = useState(false);
  const [custF, setCustFName] = useState("");
  const [custL, setCustLName] = useState("");
  const [custMob, setCustMob] = useState("");
  const [custAmount, setCustCredAmount] = useState("");
  const [custList, setCustList] = useState("");
  const [fieldId, setFieldId] = useState(true);
  const [action, setAction] = useState(true);

  const limit = 10;
  useEffect(() => {
    getCustomer(1, limit);
  }, []);

  const addCustomerDetails = () => {
    setCustFName("");
    setCustLName("");
    setCustMob("");
    setCustCredAmount("");
    setshowInput(true);
    setshowList(false);
    setAction("Add");
  };

  const validation = (value) => {
    value.preventDefault();
    if (custMob !== "") {
      AddCustomerData();
    } else {
      swal({
        title: "Warning!",
        text: "Please input the Mobile field!",
        icon: "warning",
        dangerMode: true,
        timer: 3000,
      });
    }
  };

  const AddCustomerData = () => {
    if (action === "Add") {
      const data = {
        firstName: custF,
        lastName: custL,
        mobile: custMob,
        creditAmount: custAmount,
        type: "CUSTOMER",
        status: 1,
      };
      userServices
        .createCustomer(data)
        .then(function (response) {
          setCustFName("");
          setCustLName("");
          setCustMob("");
          setCustCredAmount("");
          getCustomer();
          setshowInput(false);
          setshowList(true);
          swal({
            title: "Success!",
            text: "Customer have been added successfully!",
            icon: "success",
            dangerMode: true,
            timer: 3000,
          });
        })
        .catch(function (error) {
          swal({
            title: "Error!",
            text: "Records have not been submitted!",
            icon: "error",
            dangerMode: true,
            timer: 3000,
          });
        });
    } else {
      var data1 = JSON.stringify({
        firstName: custF,
        lastName: custL,
        mobile: custMob,
        creditAmount: custAmount,
        id: fieldId,
      });
      userServices
        .updateCust(data1)
        .then(function (response) {
          setCustFName("");
          setCustLName("");
          setCustMob("");
          setCustCredAmount("");
          getCustomer();
          setshowInput(false);
          setshowList(true);
          swal({
            title: "Success!",
            text: "Customer have been updated successfully!",
            icon: "success",
            dangerMode: true,
            timer: 3000,
          });
        })
        .catch(function (error) {
          swal({
            title: "Error!",
            text: "There is an error!",
            icon: "error",
            dangerMode: true,
            timer: 3000,
          });
        });
    }
  };

  const cancelAdd = () => {
    setCustFName("");
    setCustLName("");
    setCustMob("");
    setCustCredAmount("");
    setshowInput(false);
    setshowList(true);
  };

  const getCustomer = (currentPage) => {
    userServices
      .getCustomerList(currentPage, limit)
      .then((response) => {
        const filterCust = response.data.data.results;
        const total = response.data.total;
        setpageCount(Math.ceil(total / limit));
        setCustList(filterCust);
      })
      .catch(function (error) {});
  };

  const handlePageClick = async (data) => {
    const currentPage = data.selected + 1;
    const usersFromServer = getCustomer(currentPage, limit);
    setCustList(usersFromServer);
  };

  const editCustomer = async (id) => {
    const filteredCust = custList.filter((p) => p.id === id);
    setshowInput(true);
    setFieldId(id);
    setshowList(false);
    setCustFName(filteredCust[0].firstName);
    setCustLName(filteredCust[0].lastName);
    setCustMob(filteredCust[0].mobile);
    setCustCredAmount(filteredCust[0].creditAmount);
    setAction("Update");
  };

  return (
    <>
      <Sidebar />
      <Container>
        <Row>
          <Col md={2} xs={1}></Col>
          <Col md={10} xs={10} className="form-container">
            <button
              style={{ float: "right", marginRight: "10px", padding: "revert" }}
              className={"btn btn-success"}
              onClick={() => addCustomerDetails()}
            >
              <IoIcons.IoMdAddCircle />
              Add
            </button>
            {showList ? (
              <>
                <h6>Customers List</h6>
                <hr />
                <FormGroup>
                  <Table id="patientTable" responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Customer Name</th>
                        <th>Customer Mobile</th>
                        <th>Credit Amount</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {custList
                        ? custList.map((i, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                  {i.firstName} {i.lastName}
                                </td>
                                <td>{i.mobile}</td>
                                <td>{i.creditAmount}</td>
                                <td>
                                  <Button
                                    outline
                                    onClick={() => editCustomer(i.id)}
                                    className="shadow edit"
                                    data-tip
                                    data-for="editD"
                                  >
                                    <FaIcons.FaPencilAlt />
                                  </Button>{" "}
                                  <ReactTooltip id="editD" type="success">
                                    <span>Edit Records</span>
                                  </ReactTooltip>
                                </td>
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
              </>
            ) : null}
            {inputDiv ? (
              <>
                <h6>{action} Customer</h6>
                <Form onSubmit={validation}>
                  <hr />
                  <Row>
                    <Col md={2}></Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Customer FirstName</Label>
                        <Input
                          type="text"
                          onChange={(e) => setCustFName(e.target.value)}
                          name="Customer FirstName"
                          value={custF || ""}
                          placeholder="Customer FirstName"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Customer LastName</Label>
                        <Input
                          type="text"
                          onChange={(e) => setCustLName(e.target.value)}
                          name="Customer LastName"
                          value={custL || ""}
                          placeholder="Customer LastName"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}></Col>
                  </Row>
                  <Row>
                    <Col md={2}></Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Customer Mobile</Label>
                        <Input
                          type="text"
                          onChange={(e) => setCustMob(e.target.value)}
                          name="Customer Mobile"
                          value={custMob || ""}
                          placeholder="Customer Mobile"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Credit Amount</Label>
                        <Input
                          type="text"
                          onChange={(e) => setCustCredAmount(e.target.value)}
                          name="Credit Amount"
                          value={custAmount || ""}
                          placeholder="Credit Amount"
                        />
                      </FormGroup>
                      <Button style={{ textAlign: "center" }} type="submit">
                        {action}
                      </Button>
                      <Button1
                        variant="danger"
                        style={{ float: "right" }}
                        onClick={() => cancelAdd()}
                      >
                        cancel
                      </Button1>{" "}
                    </Col>
                    <Col md={2}></Col>
                  </Row>
                </Form>
              </>
            ) : null}
          </Col>
          <Col xs={1}></Col>
        </Row>
      </Container>
    </>
  );
};

export default Customer;

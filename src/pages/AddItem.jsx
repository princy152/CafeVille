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
  Alert,
  UncontrolledAlert,
} from "reactstrap";
import swal from "sweetalert";
import ReactTooltip from "react-tooltip";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import Sidebar from "../components/Sidebar";
import userServices from "../services/user";
import ReactPaginate from "react-paginate";
import Button1 from "react-bootstrap/Button";
import Select from "react-select";
const ExcelJS = require("exceljs");

export const AddItem = () => {
  const [pageCount, setpageCount] = useState(1);
  const [showList, setshowList] = useState(true);
  const [inputDiv, setshowInput] = useState(false);
  const [item, setItemName] = useState("");
  const [itemSubType, setItemSubType] = useState("");
  const [price, setPrice] = useState("");
  const [type, setItemType] = useState("");
  const [itemList, setItemList] = useState("");
  const [fieldId, setFieldId] = useState(true);
  const [action, setAction] = useState(true);
  const [sizeList, setSizeList] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [bulkShow, setBulkShow] = useState(false);
  const [formShow, setFomShow] = useState(true);
  const [errorAlert, setErrorAlert] = useState(false);
  const [excelData, setExcelData] = useState({});

  const limit = 10;
  useEffect(() => {
    getItem(1, limit);
    getSizetypeList();
  }, []);

  const getSizetypeList = () => {
    userServices
      .fetchSizetypeList()
      .then((response) => {
        setSizeList(response.data.data);
      })
      .catch(function (error) {});
  };

  const setSelectedOptionAction = (data) => {
    setSelectedOption(data);
  };

  const addItemDetails = () => {
    getSizetypeList();
    setItemName("");
    setPrice("");
    setItemType("");
    setshowInput(true);
    setshowList(false);
    setAction("Add");
  };

  const validation = (value) => {
    value.preventDefault();
    if (item !== "" && price !== "" && type !== "") {
      AddItemData();
    } else {
      swal({
        title: "Warning!",
        text: "Please complete the field!",
        icon: "warning",
        dangerMode: true,
        timer: 3000,
      });
    }
  };

  const AddItemData = () => {
    if (action === "Add") {
      const data = {
        name: item,
        subTypeId: selectedOption?.id ? selectedOption?.id : "",
        price: price,
        type: type[0],
      };
      userServices
        .createItem(data)
        .then(function (response) {
          setItemName("");
          setItemSubType("");
          setPrice("");
          setItemType("");
          getItem();
          setshowInput(false);
          setshowList(true);
          swal({
            title: "Success!",
            text: "Items have been added successfully!",
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
        name: item,
        subTypeId: selectedOption?.id ? selectedOption?.id : "",
        price: price,
        type: type[0],
        id: fieldId,
      });
      userServices
        .updateItem(data1)
        .then(function (response) {
          setItemName("");
          setItemSubType("");
          setPrice("");
          setItemType("");
          getItem();
          setshowInput(false);
          setshowList(true);
          swal({
            title: "Success!",
            text: "Item have been updated successfully!",
            icon: "success",
            dangerMode: true,
            timer: 3000,
          });
        })
        .catch(function (error) {
          console.log(error);
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
    setItemName("");
    setItemSubType("");
    setPrice("");
    setItemType("");
    setshowInput(false);
    setshowList(true);
    setSelectedOption(null);
    setSizeList("");
    getSizetypeList();
  };

  const handleItemType = (selectedItems) => {
    const options = [];
    for (let i = 0; i < selectedItems.length; i++) {
      options.push(selectedItems[i].value);
    }
    setItemType(options);
  };

  const getItem = (currentPage) => {
    userServices
      .getItemList(currentPage, limit)
      .then((response) => {
        const filterItem = response.data.data.results;
        const total = response.data.total;
        setpageCount(Math.ceil(total / limit));
        setItemList(filterItem);
      })
      .catch(function (error) {});
  };

  const handlePageClick = async (data) => {
    const currentPage = data.selected + 1;
    const usersFromServer = getItem(currentPage, limit);
    setItemList(usersFromServer);
  };

  const editItem = async (id) => {
    let tempSizelist = sizeList;
    const filteredItem = itemList.filter((p) => p.id === id);
    if (filteredItem[0].subTypeId) {
      const filteredSize = sizeList.filter(
        (q) => q.id === filteredItem[0].subTypeId._id
      );
      setSelectedOption(filteredSize);
    }
    setSizeList(tempSizelist);
    setshowInput(true);
    setFieldId(id);
    setshowList(false);
    setItemName(filteredItem[0].name);
    setPrice(filteredItem[0].price);
    setItemType([filteredItem[0].type]);
    setAction("Update");
  };

  const search = async (data) => {
    if (data.length > 0) {
      userServices
        .searchItem(data)
        .then((response) => {
          setItemList(response.data.data);
        })
        .catch(function (error) {});
    } else {
      getItem(1, limit);
    }
  };

  const bulkUpload = () => {
    setBulkShow(true);
    setFomShow(false);
  };

  const cancel = () => {
    getItem(1, limit);
    setBulkShow(false);
    setFomShow(true);
    setErrorAlert(false);
  };

  const userStandardFile = () => {
    var link = "http://localhost:5000/uploads/format/itemBulkUpload.xlsx";
    window.location = link;
  };

  const bulkExcel = (e) => {
    const { id, files } = e.target;
    setExcelData((preUserProfile) => ({
      ...preUserProfile,
      [id]: files[0],
    }));
  };

  const uploadExcel = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const field in excelData) {
      formData.append(field, excelData[field]);
    }
    userServices
      .addBulkItem(formData)
      .then(function (response) {
        if (response.data?.error) {
          swal({
            title: "Error!",
            text: response.data?.error,
            icon: "error",
            dangerMode: true,
            timer: 8000,
          });
        } else {
          document.getElementById("profileImage").value = "";
          swal({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            dangerMode: true,
            timer: 10000,
          });
        }
      })
      .catch(function (error) {});
  };

  return (
    <>
      <Sidebar />
      <Container>
        <Row>
          <Col md={2} xs={1}></Col>
          <Col md={10} xs={10} className="form-container">
            {formShow ? (
              <>
                {showList ? (
                  <>
                    <button
                      style={{
                        float: "right",
                        marginRight: "10px",
                        padding: "revert",
                      }}
                      className={"btn btn-success"}
                      onClick={() => addItemDetails()}
                    >
                      <IoIcons.IoMdAddCircle />
                      Add
                    </button>
                    <Row>
                      <Col md={7} xs={12}>
                        <h6>Item List</h6>
                      </Col>
                      <Col
                        md={5}
                        xs={12}
                        className="d-flex justify-content-end align-items-center mb-2"
                      >
                        <Input
                          name="search"
                          onChange={(e) => search(e.target.value)}
                          className="form-control form-control-sm ml-3 w-75 shadow"
                          type="text"
                          placeholder="Search"
                          aria-label="Search"
                        />
                      </Col>
                    </Row>
                    <hr />

                    <FormGroup>
                      <Table id="patientTable" responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Item Name</th>
                            <th>Item Sub Type</th>
                            <th>Item Price</th>
                            <th>Item Type</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemList
                            ? itemList.map((i, index) => {
                                return (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{i.name}</td>
                                    <td>
                                      {i?.subTypeId?.name
                                        ? i?.subTypeId?.name
                                        : ""}
                                    </td>
                                    <td>{i.price}</td>
                                    <td>{i.type}</td>
                                    <td>
                                      <Button
                                        outline
                                        onClick={() => editItem(i.id)}
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
                    <button
                      style={{
                        float: "right",
                        marginRight: "10px",
                        padding: "revert",
                      }}
                      className={"btn btn-success"}
                      onClick={() => bulkUpload()}
                    >
                      <IoIcons.IoMdAddCircle />
                      Bulk Upload
                    </button>
                    <h6>{action} Item</h6>
                    <Form onSubmit={validation}>
                      <hr />
                      <Row>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Item Type</Label>
                            <Input
                              type="select"
                              value={type || ""}
                              onChange={(e) => {
                                handleItemType(e.target.selectedOptions);
                              }}
                            >
                              <option value="">-- SELECT --</option>
                              <option value="Food">Food</option>
                              <option value="Beverage">Beverage</option>
                              <option value="Alcohal">Alcohal</option>
                            </Input>
                          </FormGroup>
                          <Button style={{ textAlign: "center" }} type="submit">
                            {action}
                          </Button>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Item Name</Label>
                            <Input
                              type="text"
                              onChange={(e) => setItemName(e.target.value)}
                              name="Item Input"
                              value={item || ""}
                              placeholder="Item Name"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Item Size Type</Label>
                            <Select
                              value={selectedOption}
                              onChange={setSelectedOptionAction}
                              options={sizeList}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Price</Label>
                            <Input
                              type="text"
                              onChange={(e) => setPrice(e.target.value)}
                              name="languageInput"
                              value={price || ""}
                              placeholder="Price"
                            />
                          </FormGroup>
                          <Button1
                            variant="danger"
                            style={{ float: "right" }}
                            onClick={() => cancelAdd()}
                          >
                            cancel
                          </Button1>{" "}
                        </Col>
                      </Row>
                    </Form>
                  </>
                ) : null}
              </>
            ) : null}
            {bulkShow ? (
              <>
                <button
                  style={{ float: "right", padding: "revert" }}
                  class={"btn btn-danger"}
                  onClick={() => cancel()}
                >
                  <MdIcons.MdOutlineCancel />
                  Cancel
                </button>
                <Form onSubmit={validation}>
                  <h6>Upload Bulk Items</h6>
                  <hr />
                  <Alert color="primary">
                    Hey! Pay attention...<br></br>Please upload standard format
                    file only. If you don't have one, please download it from
                    here... &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      outline
                      onClick={() => userStandardFile()}
                      className="shadow edit"
                      data-tip
                      data-for="viewFile"
                    >
                      <FaIcons.FaFileDownload />
                    </Button>{" "}
                    <ReactTooltip id="viewFile" type="warning">
                      <span>Download File</span>
                    </ReactTooltip>
                  </Alert>
                  <Row>
                    <Col md={6}>
                      <Form method="post" encType="multipart/form-data">
                        <FormGroup className="col-md-3">
                          <input
                            type="file"
                            name="file"
                            id="profileImage"
                            onChange={bulkExcel}
                          />
                        </FormGroup>{" "}
                        <FormGroup className="col-md-3">
                          <Button
                            type="submit"
                            onClick={(e) => uploadExcel(e)}
                            className="btn-success"
                          >
                            Upload Excel
                          </Button>
                        </FormGroup>
                      </Form>
                    </Col>
                  </Row>
                  {errorAlert ? (
                    <>
                      <UncontrolledAlert color="info">
                        Please find the failed report of upload file, there may
                        be duplication of mobile no...!
                      </UncontrolledAlert>
                    </>
                  ) : null}
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

export default AddItem;

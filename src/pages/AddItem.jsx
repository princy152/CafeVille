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
import Select from "react-select";
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
              onClick={() => addItemDetails()}
            >
              <IoIcons.IoMdAddCircle />
              Add
            </button>
            {showList ? (
              <>
                <h6>Item List</h6>
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
                                  {i?.subTypeId?.name ? i?.subTypeId?.name : ""}
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
          </Col>
          <Col xs={1}></Col>
        </Row>
      </Container>
    </>
  );
};

export default AddItem;

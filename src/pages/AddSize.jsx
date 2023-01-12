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
export const AddSize = () => {
  const [pageCount, setpageCount] = useState(1);
  const [showList, setshowList] = useState(true);
  const [inputDiv, setshowInput] = useState(false);
  const [size, setSizeName] = useState("");
  const [sizeList, setSizeList] = useState("");
  const [fieldId, setFieldId] = useState(true);
  const [action, setAction] = useState(true);

  const limit = 10;
  useEffect(() => {
    getSize(1, limit);
  }, []);

  const addSizeDetails = () => {
    setSizeName("");
    setshowInput(true);
    setshowList(false);
    setAction("Add");
  };

  const validation = (value) => {
    value.preventDefault();
    if (size !== "") {
      AddSizeData();
    } else {
      swal({
        title: "Warning!",
        text: "Please input the size field!",
        icon: "warning",
        dangerMode: true,
        timer: 3000,
      });
    }
  };

  const AddSizeData = () => {
    if (action === "Add") {
      const data = {
        name: size,
      };
      userServices
        .createSize(data)
        .then(function (response) {
          setSizeName("");
          getSize();
          setshowInput(false);
          setshowList(true);
          swal({
            title: "Success!",
            text: "Size have been added successfully!",
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
        name: size,
        id: fieldId,
      });
      userServices
        .updateSize(data1)
        .then(function (response) {
          setSizeName("");
          getSize();
          setshowInput(false);
          setshowList(true);
          swal({
            title: "Success!",
            text: "Size have been updated successfully!",
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
    setSizeName("");
    setshowInput(false);
    setshowList(true);
  };

  const getSize = (currentPage) => {
    userServices
      .getSizeList(currentPage, limit)
      .then((response) => {
        const filterSize = response.data.data.results;
        const total = response.data.total;
        setpageCount(Math.ceil(total / limit));
        setSizeList(filterSize);
      })
      .catch(function (error) {});
  };

  const handlePageClick = async (data) => {
    const currentPage = data.selected + 1;
    const usersFromServer = getSize(currentPage, limit);
    setSizeList(usersFromServer);
  };

  const editSize = async (id) => {
    const filteredSize = sizeList.filter((p) => p.id === id);
    setshowInput(true);
    setFieldId(id);
    setshowList(false);
    setSizeName(filteredSize[0].name);
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
              onClick={() => addSizeDetails()}
            >
              <IoIcons.IoMdAddCircle />
              Add
            </button>
            {showList ? (
              <>
                <h6>Size List</h6>
                <hr />
                <FormGroup>
                  <Table id="patientTable" responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Size Name</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeList
                        ? sizeList.map((i, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{i.name}</td>
                                <td>
                                  <Button
                                    outline
                                    onClick={() => editSize(i.id)}
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
                <h6>{action} Size</h6>
                <Form onSubmit={validation}>
                  <hr />
                  <Row>
                    <Col md={4}></Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Size Name</Label>
                        <Input
                          type="text"
                          onChange={(e) => setSizeName(e.target.value)}
                          name="Size Input"
                          value={size || ""}
                          placeholder="Size Name"
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
                    <Col md={4}></Col>
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

export default AddSize;

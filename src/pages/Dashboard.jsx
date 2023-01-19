import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  Card,
  CardTitle,
  CardText,
  FormGroup,
  Table,
  Form,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import swal from "sweetalert";
import Sidebar from "../components/Sidebar";
import userServices from "../services/user";
import ReactTooltip from "react-tooltip";
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

import Select from "react-select";

function Dashboard() {
  const locale = "en";
  const [today, setDate] = useState(new Date());
  const [billDiv, setShowBillDiv] = useState(false);
  const [itemList, setItemList] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [ordertable, setShowOrderTable] = useState(false);
  const [subtotalPrice, setSubtotal] = useState(0);
  const [totalPrice, setTotal] = useState(0);
  const [validService, setValidService] = useState(false);
  const [printBtn, setPrntBtn] = useState(true);
  const [saveBtn, setSaveBtn] = useState(false);
  const [OrderNo, setOrderNo] = useState("");
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [discountModal, setDiscountModal] = useState(false);
  const [customerList, setCustomerList] = useState(false);
  const [custVal, setCustVal] = useState("");
  const [custId, setCustId] = useState("");
  const [assignBtn, setAssignBtn] = useState(true);
  const [vatCharge, setVatCharge] = useState(false);
  const [discount, setDiscountType] = useState();
  const [disVal, setDiscountVal] = useState();
  const [flat, setFlatOffer] = useState();
  const [percentge, setPercentage] = useState();
  const [flatDisc, setFlatDisc] = useState();
  const [percentageDisc, setPercentageDisc] = useState();

  const itemArr = [];

  let subtotal = 0;
  let total = 0;
  useEffect(() => {
    getItems();
    getOrderNo();
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const onDismiss = () => setVisible(false);

  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, {
    month: "long",
  })}\n\n`;

  const hour = today.getHours();
  const wish = `Good ${
    (hour < 12 && "Morning") || (hour < 17 && "Afternoon") || "Evening"
  }, `;

  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });

  const createBillDiv = () => {
    setShowBillDiv(true);
  };

  const getOrderNo = () => {
    userServices
      .fetchOrderNo()
      .then((response) => {
        console.log(response);
        setOrderNo(response.data.data);
        // setItemList(response.data.data);
      })
      .catch(function (error) {});
  };

  const getItems = () => {
    userServices
      .getItemsData()
      .then((response) => {
        setItemList(response.data.data);
      })
      .catch(function (error) {});
  };

  const setSelectedOptionAction = (data) => {
    if (data.length > 0) {
      setVisible(false);
      setShowOrderTable(true);
    } else {
      setShowOrderTable(false);
    }
    data.forEach((val, index) => {
      let selectedPrice = val.price * val.quantity;
      data[index].currPrice = selectedPrice;
      subtotal += selectedPrice;
    });
    if (percentageDisc) {
      subtotal = subtotal - (subtotal * percentageDisc) / 100;
    }
    if (flatDisc) {
      subtotal = subtotal - flatDisc;
    }
    setSelectedOption(data);
    if (subtotal > 0) {
      if (validService && !vatCharge) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal;
      } else if (vatCharge && !validService) {
        total = subtotal * 0.05 + subtotal * 0.2 + subtotal;
      } else if (validService && vatCharge) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal * 0.2 + subtotal;
      } else {
        total = subtotal * 0.05 + subtotal;
      }
      setTotal(total);
    } else {
      total = 0;
      setTotal(total);
    }
    setSubtotal(subtotal);
  };

  const increaseItem = (id) => {
    selectedOption.filter((item, index) => {
      if (item.id === id) {
        selectedOption[index].quantity = ++item.quantity;
      }
    });
    selectedOption.forEach((val, index) => {
      itemArr.push(val);
    });
    setSelectedOption(itemArr);
    selectedOption.forEach((val, index) => {
      let calcPrice = val.price * val.quantity;
      selectedOption[index].currPrice = calcPrice;
      subtotal += calcPrice;
    });
    if (percentageDisc) {
      subtotal = subtotal - (subtotal * percentageDisc) / 100;
    }
    if (flatDisc) {
      subtotal = subtotal - flatDisc;
    }
    if (subtotal > 0) {
      if (validService && !vatCharge) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal;
      } else if (vatCharge && !validService) {
        total = subtotal * 0.05 + subtotal * 0.2 + subtotal;
      } else if (validService && vatCharge) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal * 0.2 + subtotal;
      } else {
        total = subtotal * 0.05 + subtotal;
      }
      setTotal(total);
    } else {
      total = 0;
      setTotal(total);
    }
    setSubtotal(subtotal);
  };

  const reduceItem = (id) => {
    selectedOption.filter((item, index) => {
      if (item.id === id && item.quantity !== 0) {
        selectedOption[index].quantity = --item.quantity;
      }
    });
    selectedOption.forEach((val, index) => {
      itemArr.push(val);
    });
    setSelectedOption(itemArr);
    selectedOption.forEach((val, index) => {
      let calcPrice = val.price * val.quantity;
      selectedOption[index].currPrice = calcPrice;
      subtotal += calcPrice;
    });
    if (percentageDisc) {
      subtotal = subtotal - (subtotal * percentageDisc) / 100;
    }
    if (flatDisc) {
      subtotal = subtotal - flatDisc;
    }
    if (subtotal > 0) {
      if (validService && !vatCharge) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal;
      } else if (vatCharge && !validService) {
        total = subtotal * 0.05 + subtotal * 0.2 + subtotal;
      } else if (validService && vatCharge) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal * 0.2 + subtotal;
      } else {
        total = subtotal * 0.05 + subtotal;
      }
      setTotal(total);
    } else {
      total = 0;
      setTotal(total);
    }
    setSubtotal(subtotal);
  };

  const isService = (data) => {
    setValidService(data);
    if (selectedOption !== null && data === true) {
      selectedOption.forEach((val, index) => {
        let calcPrice = val.price * val.quantity;
        selectedOption[index].currPrice = calcPrice;
        subtotal += calcPrice;
      });
      if (percentageDisc) {
        subtotal = subtotal - (subtotal * percentageDisc) / 100;
      }
      if (flatDisc) {
        subtotal = subtotal - flatDisc;
      }
      if (subtotal > 0 && vatCharge === false) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal;
      } else if (subtotal > 0 && vatCharge === true) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal * 0.2 + subtotal;
      } else {
        total = 0;
      }
      setTotal(total);
      setSubtotal(subtotal);
    } else if (data === false && selectedOption !== null) {
      selectedOption.forEach((val, index) => {
        let calcPrice = val.price * val.quantity;
        selectedOption[index].currPrice = calcPrice;
        subtotal += calcPrice;
      });
      if (percentageDisc) {
        subtotal = subtotal - (subtotal * percentageDisc) / 100;
      }
      if (flatDisc) {
        subtotal = subtotal - flatDisc;
      }
      if (subtotal > 0 && vatCharge === false) {
        total = subtotal * 0.05 + subtotal;
      } else if (subtotal > 0 && vatCharge === true) {
        total = subtotal * 0.05 + subtotal * 0.2 + subtotal;
      } else {
        total = 0;
      }
      setTotal(total);
      setSubtotal(subtotal);
    }
  };

  const isVatCharge = (data) => {
    setVatCharge(data);
    if (selectedOption !== null && data === true) {
      selectedOption.forEach((val, index) => {
        let calcPrice = val.price * val.quantity;
        selectedOption[index].currPrice = calcPrice;
        subtotal += calcPrice;
      });
      if (percentageDisc) {
        subtotal = subtotal - (subtotal * percentageDisc) / 100;
      }
      if (flatDisc) {
        subtotal = subtotal - flatDisc;
      }
      if (subtotal > 0 && validService === true) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal * 0.2 + subtotal;
      } else if (subtotal > 0 && validService === false) {
        total = subtotal * 0.05 + subtotal * 0.2 + subtotal;
      } else {
        total = 0;
      }
      setTotal(total);
      setSubtotal(subtotal);
    } else if (selectedOption !== null && data === false) {
      selectedOption.forEach((val, index) => {
        let calcPrice = val.price * val.quantity;
        selectedOption[index].currPrice = calcPrice;
        subtotal += calcPrice;
      });
      if (percentageDisc) {
        subtotal = subtotal - (subtotal * percentageDisc) / 100;
      }
      if (flatDisc) {
        subtotal = subtotal - flatDisc;
      }
      if (subtotal > 0 && validService === true) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal;
      } else if (subtotal > 0 && validService === false) {
        total = subtotal * 0.05 + subtotal;
      } else {
        total = 0;
      }
      setTotal(total);
      setSubtotal(subtotal);
    }
  };

  const setCreditUser = () => {
    setCustVal("");
    setAssignBtn(true);
    if (selectedOption !== null && selectedOption.length > 0) {
      setModal(!modal);
      userServices
        .getCustomersList()
        .then((response) => {
          setCustomerList(response.data.data);
        })
        .catch(function (error) {});
    } else {
      setVisible(true);
    }
  };

  const itemDiscount = () => {
    if (selectedOption !== null && selectedOption.length > 0) {
      setDiscountModal(!discountModal);
    } else {
      setVisible(true);
    }
  };

  const handleDiscountType = (selectedItems) => {
    const options = [];
    for (let i = 0; i < selectedItems.length; i++) {
      options.push(selectedItems[i].value);
    }
    if (options[0] === "") {
      setFlatOffer();
      setPercentage();
    }
    setDiscountType(options);
    setDiscountVal(options[0]);
  };

  function custView() {
    setModal(!modal);
  }

  function offerView() {
    setDiscountModal(!discountModal);
  }

  const Print = () => {
    var content = document.getElementById("invoice");
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  };

  const saveOrder = () => {
    const orderArr = [];
    if (selectedOption !== null && selectedOption.length > 0) {
      selectedOption.forEach((val) => {
        orderArr.push({
          price: val.price,
          totalPrice: val.currPrice,
          itemId: val.id,
          quantity: val.quantity,
        });
      });
      userServices
        .saveOrders(OrderNo, totalPrice, orderArr)
        .then((response) => {
          setSaveBtn(true);
          setPrntBtn(false);
        })
        .catch(function (error) {});
    } else {
      setVisible(true);
    }
  };

  const custhandler = (e) => {
    setCustVal(e);
    setCustId(e.id);
    setAssignBtn(false);
  };

  const assignCustomerBill = () => {
    let assignObj = {
      custId: custId,
      totalPrice: totalPrice,
    };
    userServices
      .assignBill(assignObj)
      .then((response) => {
        swal({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          dangerMode: true,
          timer: 3000,
        });
        setModal(!modal);
      })
      .catch(function (error) {});
  };

  const applyDiscount = () => {
    if (flat) {
      setPercentageDisc();
      setFlatDisc(flat);
    } else if (percentge) {
      setFlatDisc();
      setPercentageDisc(percentge);
    }
    setDiscountModal(!discountModal);
    if (selectedOption !== null) {
      selectedOption.forEach((val, index) => {
        let calcPrice = val.price * val.quantity;
        selectedOption[index].currPrice = calcPrice;
        subtotal += calcPrice;
      });
      if (percentge) {
        subtotal = subtotal - subtotal * (percentge / 100);
      }
      if (flat) {
        subtotal = subtotal - flat;
      }
      if (subtotal > 0 && validService === true) {
        total = subtotal * 0.05 + subtotal * 0.1 + subtotal * 0.2 + subtotal;
      } else if (subtotal > 0 && validService === false) {
        total = subtotal * 0.05 + subtotal * 0.2 + subtotal;
      } else {
        total = 0;
      }
      setTotal(total);
      setSubtotal(subtotal);
    }
  };

  const handleFlatOffer = (e) => {
    setPercentage();
    setFlatOffer(e);
  };

  const handlePercentage = (e) => {
    setFlatOffer();
    setPercentage(e);
  };

  return (
    <>
      <iframe
        title="print"
        id="ifmcontentstoprint"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>

      <Sidebar />
      <Container>
        <Row>
          <Col md={2} xs={1}></Col>
          <Col md={10} xs={10} className="form-container">
            <Alert color="primary">
              <h4 style={{ textAlign: "center" }}>
                <b>COFFEE VILLE Billing System...</b>
                <br></br>
                <br></br>
                {wish}
                <br></br>
                {date}
                <br></br>
                {time}
                <br></br>
                <br></br>
                <Button color="primary" onClick={() => createBillDiv()}>
                  Create Bill
                </Button>
              </h4>
            </Alert>
            {billDiv ? (
              <>
                <Row>
                  <Col sm="7">
                    <Card body>
                      <CardTitle tag="h5" style={{ textAlign: "center" }}>
                        Add Order
                      </CardTitle>
                      <Row>
                        <Col sm="2">
                          <button
                            style={{
                              float: "right",
                              marginRight: "10px",
                              padding: "revert",
                            }}
                            className={"btn btn-success"}
                            onClick={setCreditUser}
                          >
                            <FaIcons.FaUserTie />
                          </button>
                        </Col>
                        <Col sm="3">
                          <Button
                            outline
                            onClick={itemDiscount}
                            className="shadow edit"
                            data-tip
                            data-for="discount"
                          >
                            <MdIcons.MdOutlineLocalOffer />
                          </Button>{" "}
                          <ReactTooltip id="discount" type="success">
                            <span>Discount</span>
                          </ReactTooltip>
                        </Col>
                        <Col sm="4"></Col>
                        <Col sm="3">
                          <button
                            disabled={printBtn}
                            style={{
                              float: "right",
                              marginRight: "10px",
                              padding: "revert",
                            }}
                            className={"btn btn-success"}
                            onClick={Print}
                          >
                            <AiIcons.AiFillPrinter />
                          </button>
                          <button
                            disabled={saveBtn}
                            style={{
                              float: "right",
                              marginRight: "10px",
                              padding: "revert",
                            }}
                            className={"btn btn-success"}
                            onClick={saveOrder}
                          >
                            <BiIcons.BiSave />
                          </button>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="12">
                          <Alert
                            style={{ textAlign: "center" }}
                            color="warning"
                            isOpen={visible}
                            toggle={onDismiss}
                          >
                            Hey! Add some order first...!
                          </Alert>
                        </Col>
                      </Row>
                      <br></br>
                      <Form>
                        <FormGroup check inline>
                          <Input
                            type="checkbox"
                            onClick={(e) => isService(e.target.checked)}
                          />
                          <Label check>Service Charge</Label>
                        </FormGroup>
                      </Form>
                      <Form>
                        <FormGroup check inline>
                          <Input
                            type="checkbox"
                            onClick={(e) => isVatCharge(e.target.checked)}
                          />
                          <Label check>VAT Charge</Label>
                        </FormGroup>
                      </Form>
                      <br></br>
                      <CardText>
                        <FormGroup tag="fieldset">
                          <Row>
                            <Col md={12} xs={12}>
                              <Select
                                value={selectedOption}
                                onChange={setSelectedOptionAction}
                                options={itemList}
                                isMulti
                              />
                            </Col>
                          </Row>
                          {ordertable ? (
                            <>
                              <Row>
                                <Table responsive striped>
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>item Name</th>
                                      <th>item price</th>
                                      <th>Quantity</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedOption
                                      ? selectedOption.map((i, index) => {
                                          return (
                                            <tr key={index}>
                                              <th scope="row">{index + 1}</th>
                                              <td>{i.label}</td>
                                              <td>{i.price} &#8377;</td>
                                              <td>{i.quantity}</td>
                                              <td style={{ display: "flex" }}>
                                                <button
                                                  style={{
                                                    float: "right",
                                                    marginRight: "10px",
                                                    padding: "revert",
                                                  }}
                                                  className={"btn btn-success"}
                                                  onClick={() =>
                                                    increaseItem(i.id)
                                                  }
                                                >
                                                  <IoIcons.IoMdAddCircle />
                                                </button>
                                                <button
                                                  style={{
                                                    float: "right",
                                                    marginRight: "10px",
                                                    padding: "revert",
                                                  }}
                                                  className={"btn btn-success"}
                                                  onClick={() =>
                                                    reduceItem(i.id)
                                                  }
                                                >
                                                  <AiIcons.AiOutlineMinusCircle />
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })
                                      : null}
                                  </tbody>
                                </Table>
                              </Row>
                            </>
                          ) : null}
                        </FormGroup>
                      </CardText>
                    </Card>
                  </Col>
                  <Col sm="5">
                    <div id="invoice">
                      <Form>
                        <div
                          style={{
                            textAlign: "center",
                            width: "70%",
                          }}
                        >
                          <h5
                            style={{
                              fontFamily: "cursive",
                            }}
                          >
                            COFFEE VILLE
                          </h5>
                          Tower B1-B2, Ground Floor Spaze i-Tech Park, Sector
                          49, Gurugram, Haryana 122018
                          <br></br>
                          Order No. - <b>{OrderNo}</b>
                        </div>
                        <Table responsive borderless>
                          <thead>
                            <tr>
                              <th
                                style={{
                                  textAlign: "left",
                                  fontFamily: "cursive",
                                  fontSize: "12px",
                                }}
                              >
                                Item Name
                              </th>
                              <th
                                style={{
                                  textAlign: "left",
                                  fontFamily: "cursive",
                                  fontSize: "12px",
                                }}
                              >
                                Price
                              </th>
                              <th></th>
                            </tr>
                          </thead>
                          <thead>
                            {selectedOption
                              ? selectedOption.map((i, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                        style={{
                                          textAlign: "left",
                                          width: "50%",
                                          fontFamily: "cursive",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {i.quantity} {i.label}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "left",
                                          fontFamily: "cursive",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {i.currPrice} &#8377;
                                      </td>
                                    </tr>
                                  );
                                })
                              : null}
                            <tr>
                              <th
                                style={{
                                  textAlign: "left",
                                  width: "50%",
                                }}
                              >
                                ---------------------
                              </th>
                            </tr>
                            <tr>
                              <th
                                style={{
                                  textAlign: "left",
                                  width: "50%",
                                  fontFamily: "cursive",
                                  fontSize: "12px",
                                }}
                              >
                                GST
                              </th>
                              <th
                                style={{
                                  textAlign: "left",
                                  fontFamily: "cursive",
                                  fontSize: "12px",
                                }}
                              >
                                5%
                              </th>
                            </tr>
                            {validService ? (
                              <>
                                <tr>
                                  <th
                                    style={{
                                      textAlign: "left",
                                      width: "50%",
                                      fontFamily: "cursive",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Service Charge
                                  </th>
                                  <th
                                    style={{
                                      textAlign: "left",
                                      fontFamily: "cursive",
                                      fontSize: "12px",
                                    }}
                                  >
                                    10%
                                  </th>
                                </tr>
                              </>
                            ) : null}
                            {vatCharge ? (
                              <>
                                <tr>
                                  <th
                                    style={{
                                      textAlign: "left",
                                      width: "50%",
                                      fontFamily: "cursive",
                                      fontSize: "12px",
                                    }}
                                  >
                                    VAT Charge
                                  </th>
                                  <th
                                    style={{
                                      textAlign: "left",
                                      fontFamily: "cursive",
                                      fontSize: "12px",
                                    }}
                                  >
                                    20%
                                  </th>
                                </tr>
                              </>
                            ) : null}
                            {flatDisc ? (
                              <>
                                <tr>
                                  <th
                                    style={{
                                      textAlign: "left",
                                      width: "50%",
                                      fontFamily: "cursive",
                                      fontSize: "12px",
                                    }}
                                  >
                                    FLAT Discount
                                  </th>
                                  <th
                                    style={{
                                      textAlign: "left",
                                      fontFamily: "cursive",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {flatDisc} &#8377;
                                  </th>
                                </tr>
                              </>
                            ) : null}
                            {percentageDisc ? (
                              <>
                                <tr>
                                  <th
                                    style={{
                                      textAlign: "left",
                                      width: "50%",
                                      fontFamily: "cursive",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Discount
                                  </th>
                                  <th
                                    style={{
                                      textAlign: "left",
                                      fontFamily: "cursive",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {percentageDisc} %
                                  </th>
                                </tr>
                              </>
                            ) : null}
                            <tr>
                              <th
                                style={{
                                  textAlign: "left",
                                  width: "50%",
                                  fontFamily: "cursive",
                                  fontSize: "12px",
                                }}
                              >
                                Sub Total
                              </th>
                              <th
                                style={{
                                  textAlign: "left",
                                  fontFamily: "cursive",
                                  fontSize: "12px",
                                }}
                              >
                                {subtotalPrice} &#8377;
                              </th>
                            </tr>
                            <hr />
                            <tr>
                              <th
                                style={{
                                  textAlign: "left",
                                  width: "50%",
                                  fontFamily: "cursive",
                                  fontSize: "12px",
                                }}
                              >
                                Total
                              </th>
                              <th
                                style={{
                                  textAlign: "left",
                                  fontFamily: "cursive",
                                  fontSize: "12px",
                                }}
                              >
                                {totalPrice} &#8377;
                              </th>
                              <hr
                                style={{
                                  height: "2px",
                                  borderWidth: "0",
                                  color: "gray",
                                }}
                              ></hr>
                            </tr>
                            <hr />
                            <tr>
                              <th style={{ textAlign: "left", width: "50%" }}>
                                ---------------------
                              </th>
                            </tr>
                            <tr>
                              <td></td>
                              <td style={{ textAlign: "left" }}>_</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td></td>
                              <td style={{ textAlign: "left" }}>_</td>
                              <td></td>
                            </tr>
                          </thead>
                        </Table>
                      </Form>
                    </div>
                  </Col>
                </Row>
              </>
            ) : null}
          </Col>
          <Col md={2} xs={12}></Col>
          <Modal isOpen={modal} toggle={custView}>
            <ModalHeader toggle={custView}> Select Customer </ModalHeader>
            <ModalBody>
              <Select
                value={custVal}
                onChange={custhandler}
                options={customerList}
              />
              <br></br>
              <Button
                disabled={assignBtn}
                color="info"
                onClick={() => assignCustomerBill()}
              >
                Assign Bill
              </Button>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Modal>
          <Modal isOpen={discountModal} toggle={offerView}>
            <ModalHeader toggle={offerView}> Select Discount </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Discount Type</Label>
                <Input
                  type="select"
                  value={discount || ""}
                  onChange={(e) => {
                    handleDiscountType(e.target.selectedOptions);
                  }}
                >
                  <option value="">-- SELECT --</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Flat">Flat</option>
                </Input>
              </FormGroup>
              {disVal === "Percentage" ? (
                <>
                  <FormGroup>
                    <Label>Percentage</Label>
                    <Input
                      type="text"
                      onChange={(e) => handlePercentage(e.target.value)}
                      name="Percentage"
                      value={percentge || ""}
                      placeholder="Percentage"
                    />
                  </FormGroup>
                </>
              ) : null}
              {disVal === "Flat" ? (
                <>
                  <FormGroup>
                    <Label>Flat Discount</Label>
                    <Input
                      type="text"
                      onChange={(e) => handleFlatOffer(e.target.value)}
                      name="Flat Discount"
                      value={flat || ""}
                      placeholder="Flat Discount"
                    />
                  </FormGroup>
                </>
              ) : null}
              <br></br>
              <Button color="info" onClick={() => applyDiscount()}>
                Apply Discount
              </Button>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Modal>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;

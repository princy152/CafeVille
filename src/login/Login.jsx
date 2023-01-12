import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Form,
  Label,
} from "reactstrap";
import "../login/Login.css";
import swal from "sweetalert";
import GLOBALS from "../constants/global";
import loginServices from "../services/login";

function Login() {
  // Login API Integration
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState();

  useEffect(() => {
    const data = localStorage.getItem("userdata");
    // console.log("data in effect :::: ",JSON.parse(data));
    setSession(JSON.parse(data));
  });

  const validation = (evt) => {
    evt.preventDefault();
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (username && password && regex.test(username.toLowerCase())) {
      loginUser();
    } else {
      //console.log("enter valid info");
      swal({
        title: "Warning!",
        text: "Please fill the required field!",
        icon: "warning",
        dangerMode: true,
        timer: 3000,
      });
    }
  };

  const loginUser = async () => {
    var data = JSON.stringify({
      email: username,
      type: "ADMIN",
      password: password,
    });

    loginServices
      .getlogin(data)
      .then(function (response) {
        console.log(response.data.data, response.data.token);
        localStorage.setItem("userToken", JSON.stringify(response.data.token));
        localStorage.setItem("userdata", JSON.stringify(response.data));
        GLOBALS.USER_TOKEN = response.data.token;
        window.location.href = "/dashboard";
      })
      .catch(function (error) {
        console.log(error);
        swal({
          title: "Error!",
          text: "Your Username or Password is wrong!",
          icon: "error",
          dangerMode: true,
          timer: 3000,
        });
      });
  };

  if (session) {
    console.log(session);
    window.location.href = "/dashboard";
  } else {
    return (
      <Container className="login-container">
        <Row>
          <Col sm="3"></Col>
          <Col sm="6">
            <div className="login-form">
              <h3>Login</h3>
            </div>
            <Form onSubmit={validation}>
              <FormGroup>
                <Label for="exampleEmail" hidden>
                  Email
                </Label>
                <Input
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  className="form-control"
                  name="username"
                  placeholder="Email"
                />
              </FormGroup>{" "}
              <FormGroup>
                <Label for="examplePassword" hidden>
                  Password
                </Label>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  name="password"
                  placeholder="Password"
                />
              </FormGroup>{" "}
              <Button
                type="submit"
                className="login-button btn btn-primary btn-lg btn-block"
              >
                Sign In
              </Button>
            </Form>
          </Col>
          <Col sm="2"></Col>
        </Row>
      </Container>
    );
  }
}

export default Login;

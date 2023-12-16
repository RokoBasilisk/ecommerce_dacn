import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import FrontImage from "../assets/profileFrontImage.jpg";
import Women from "../assets/women.jpg";

import { getShopEvents } from "../actions/eventActions";
import { updateUserProfile } from "../actions/userAction";

import Meta from "../components/atoms/Meta";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Image,
  InputGroup,
  ListGroup,
  ProgressBar,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { toast } from "react-toastify";

export function Profile({
  userInfo,
  getShopEvents,
  events,
  updateUserProfile,
}) {
  useEffect(() => {
    getShopEvents();
  }, [getShopEvents]);

  const fileInputRef = useRef(null);

  const handleCardImgClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click event
    }
  };

  const dateJoin = new Date(userInfo.createdAt);
  const monthJoin = dateJoin.getMonth() + 1;
  const yearJoin = dateJoin.getFullYear();
  const [formData, setFormData] = useState({
    name: userInfo.name,
    paypalEmail: userInfo.paypalEmail,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onSubmit = (e) => {
    const updateData = {
      name: formData.name,
      paypalEmail: formData.paypalEmail,
    };
    if (
      formData.oldPassword != "" &&
      formData.newPassword != "" &&
      formData.confirmPassword != ""
    ) {
      if (formData.oldPassword == formData.newPassword) {
        alert("New Password must not be the same");
        return;
      }
      if (formData.newPassword != formData.confirmPassword) {
        alert("New Password must be the same as Confirm Password");
        return;
      }
      updateData.oldPassword = formData.oldPassword;
      updateData.newPassword = formData.newPassword;
    }
    const status = updateUserProfile(updateData);
    if (status) {
      toast("Update success");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <Meta title={`Profile ${userInfo.name}`} />
      <Row className="justify-content-lg-center">
        <Col lg={11}>
          <div className="profile-cover">
            <div className="profile-cover-img-wrapper">
              <Image
                className="profile-cover-img"
                src={FrontImage}
                alt="Image Description"
              />
            </div>
          </div>
          <div className="text-center mb-5">
            <div className="profile-cover-avatar">
              <Image
                style={{ zIndex: 9999 }}
                className="avatar-img"
                src={Women}
                alt="Image Description"
                roundedCircle
                thumbnail
                onClick={handleCardImgClick}
              />
              <input
                type="file"
                accept="image/*"
                className="mb-3"
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>

            <h1 className="page-header-title">
              {userInfo.name}
              <i
                className="bi-patch-check-fill fs-2 text-primary"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                aria-label="Top endorsed"
              ></i>
            </h1>

            <ul className="list-inline list-px-2">
              <li className="list-inline-item mr-4">
                <i
                  className="nav-icon fa fa-building mr-1"
                  arial-hidden={true}
                ></i>
                <span>Htmlstream</span>
              </li>

              <li className="list-inline-item mr-4">
                <i
                  className="nav-icon fa fa-map-marker mr-1"
                  arial-hidden={true}
                ></i>
                <span>San Francisco, US</span>
              </li>

              <li className="list-inline-item">
                <i
                  className="nav-icon fa fa-calendar mr-1"
                  arial-hidden={true}
                ></i>
                <span>
                  Joined {monthJoin}/{yearJoin}
                </span>
              </li>
            </ul>
          </div>
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-4"
          >
            <Tab eventKey="profile" title="Profile" />
          </Tabs>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <Card className="card-body mb-3 mb-lg-4">
                <Card.Header>
                  <Card.Title>
                    <h4>Complete your profile</h4>
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row className="justify-content-between align-items-center">
                    <ProgressBar style={{ width: "82%" }} now={82} />
                    <span>82%</span>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="card-body mb-3 mb-lg-5">
                <Card.Header>
                  <Row className="justify-content-between">
                    <Card.Title>
                      <h4>Profile</h4>
                    </Card.Title>
                    <Button variant="primary" onClick={onSubmit}>
                      Update
                    </Button>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <ListGroup as="ul" className="mb-3">
                    <Card.Subtitle className="mb-2">User Info</Card.Subtitle>
                    <ListGroup.Item as="li">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Username</InputGroup.Text>
                        <Form.Control
                          placeholder="Enter Username..."
                          name="name"
                          value={formData.name}
                          onChange={onChange}
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Email</InputGroup.Text>
                        <Form.Control
                          placeholder="Enter Email..."
                          value={userInfo.email}
                          disabled
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Paypal Email</InputGroup.Text>
                        <Form.Control
                          placeholder="Enter Paypal Email..."
                          name="paypalEmail"
                          value={formData.paypalEmail}
                          onChange={onChange}
                        />
                      </InputGroup>
                    </ListGroup.Item>
                  </ListGroup>
                  <ListGroup as="ul">
                    <Card.Subtitle className="mb-2">User Secret</Card.Subtitle>
                    <ListGroup.Item as="li">
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Old Password</InputGroup.Text>
                        <Form.Control
                          value={formData.oldPassword}
                          name="oldPassword"
                          type="password"
                          onChange={onChange}
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>New Password</InputGroup.Text>
                        <Form.Control
                          value={formData.newPassword}
                          name="newPassword"
                          type="password"
                          onChange={onChange}
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Confirm Password</InputGroup.Text>
                        <Form.Control
                          value={formData.confirmPassword}
                          name="confirmPassword"
                          type="password"
                          onChange={onChange}
                        />
                      </InputGroup>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={8} md={6} sm={12}>
              <Card className="card-body">
                <Card.Header>
                  <Card.Title>
                    <h4>Activity</h4>
                  </Card.Title>
                </Card.Header>
                <Card.Body
                  style={{
                    height: "30rem",
                    overflow: "hidden",
                    overflowY: "auto",
                  }}
                >
                  <ul class="step step-icon-xs mb-0">
                    {events && events.length > 0 ? (
                      events.map((event, idx) => {
                        return (
                          <>
                            <li class="step-item mb-3" key={event._id}>
                              <div class="step-content-wrapper">
                                <span class="step-icon step-icon-pseudo step-icon-soft-dark"></span>

                                <div class="step-content">
                                  <h5 class="step-title">
                                    <a class="text-dark">{event.eventName}</a>
                                  </h5>

                                  <p class="fs-5 mb-1">{event.eventContext}</p>

                                  <span class="text-muted small text-uppercase">
                                    {
                                      new Date(event.createdAt)
                                        .toString()
                                        .split("GMT")[0]
                                    }
                                  </span>
                                </div>
                              </div>
                            </li>
                          </>
                        );
                      })
                    ) : (
                      <h1>There is no activity!</h1>
                    )}
                    {/* <li class="step-item">
                      <div class="step-content-wrapper">
                        <span class="step-icon step-icon-pseudo step-icon-soft-dark"></span>

                        <div class="step-content">
                          <h5 class="step-title">
                            <a class="text-dark" href="#">
                              Dean added a new team member
                            </a>
                          </h5>

                          <p class="fs-5 mb-1">
                            Added a new member to Front Dashboard
                          </p>

                          <span class="text-muted small text-uppercase">
                            May 15
                          </span>
                        </div>
                      </div>
                    </li> */}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className="position-sticky" style={{ top: 0 }}>
        dasdas
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  events: state.eventList.events,
});

const mapDispatchToProps = {
  getShopEvents,
  updateUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

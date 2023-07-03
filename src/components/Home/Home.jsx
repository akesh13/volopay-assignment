//--------------------------------------------------------------------------------------------------------//
// IMPORT START ------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------//
import {
  Card,
  Col,
  Row,
  Progress,
  Menu,
  Popover,
  Radio,
  Button,
  Typography,
  Input,
  Space,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FilterOutlined, SyncOutlined, FireOutlined } from "@ant-design/icons";
import "./Home.css";
//--------------------------------------------------------------------------------------------------------//
// IMPORT END ------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------//

const Homes = () => {
  const [data, setData] = useState([]); // fetching data from api and storing in data
  const [filteredData, setFilteredData] = useState([]); // storing the filtered data
  const [selectedCardType, setSelectedCardType] = useState(""); // storing the currently selected card type
  const [query, setQuery] = useState(""); // storing the user input query to search by card name

  // fetching data from API and storing it in data
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/data");
      setData(res.data);
    } catch (err) {
      console.log("Error in API Call", err);
    }
  };

  // invoking fetchData inside useEffect
  useEffect(() => {
    fetchData();
  }, []);

  // for filter data by card type
  useEffect(() => {
    let filtered = data;
    if (selectedCardType) {
      filtered = filtered.filter((card) => card.card_type === selectedCardType);
    }
    // for searching data by card name
    if (query) {
      const searchPattern = new RegExp(query, "i");
      filtered = filtered.filter((card) => searchPattern.test(card.name));
    }
    setFilteredData(filtered);
  }, [selectedCardType, query, data]); // passing values to dependency array to fetch api whenever the data changes

  // change Handler for choosing card type in Radio buttons
  const handleCardTypeChange = (e) => {
    setSelectedCardType(e.target.value);
    setQuery("");
  };

  // search Handler for searching card by card name
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setSelectedCardType("");
  };

  return (
    <div>
      <Menu
        className="appHeader"
        style={{ padding: "20px" }}
        mode="horizontal"
        items={[
          {
            label: "Your",
            key: "your",
          },
          {
            label: "All",
            key: "all",
          },
          {
            label: "Blocked",
            key: "blocked",
          },
        ]}
      />

      <Row // for the secondary header  search and filter menu
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          marginRight: "40px",
          gap: "20px",
        }}
      >
        <Col>
          <Input
            className="input_bar"
            style={{ maxWidth: "250px" }}
            placeholder="Enter card name to search"
            onChange={handleSearch}
            value={query}
          />
        </Col>
        <Col>
          <Popover // for the menu when clicking the filter icon
            placement="bottomRight"
            title="Filter"
            trigger="click"
            content={
              <div className="popover">
                <Row>
                  <Col>
                    <Radio.Group
                      className="radio_btn"
                      onChange={handleCardTypeChange}
                      value={selectedCardType}
                    >
                      <Radio value="">all</Radio>
                      <Radio value="subscription">Subscription</Radio>
                      <Radio value="burner">Burner</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
                <Row
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Col>
                    <Button
                      onClick={() => message.info("yet to be implemented")}
                      className="apply_btn"
                    >
                      Apply
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => {
                        setSelectedCardType("");
                      }}
                      className="clear_btn"
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </div>
            }
          >
            <Button className="filter_btn">
              <FilterOutlined /> filter
            </Button>
          </Popover>
        </Col>
      </Row>
      <Row gutter={16}>
        {/* card display starts */}

        {filteredData.map((item, id) => (
          <Col span={8} md={12} sm={8} lg={8} key={id}>
            <Card className="payment_card">
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Col span={12}>
                  <Typography
                    style={{
                      fontWeight: "bolder",
                      textTransform: "capitalize",
                      fontSize: "25px",
                    }}
                  >
                    {item.name}
                  </Typography>
                </Col>
                <Col span={12}>
                  <span>
                    {item.card_type === "burner" ? (
                      <FireOutlined
                        style={{
                          backgroundColor: "#ffeef3",
                          padding: "15px",
                          borderRadius: "50%",
                          color: "#fe3c73",
                        }}
                      />
                    ) : (
                      <SyncOutlined
                        style={{
                          backgroundColor: "#fff5ec",
                          padding: "15px",
                          borderRadius: "50%",
                          color: "#ff982a",
                        }}
                      />
                    )}
                  </span>
                </Col>
              </Row>

              <table className="payment-card-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th>{item.card_type === "burner" ? "Expiry" : "Limit"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table_tr">
                    <td>
                      {item.limit} {item.currency}
                    </td>
                    <td>{item.frequency}</td>
                    <td>
                      {item.card_type === "burner"
                        ? item.expiry
                        : `${item.limit}  ${item.currency}`}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Progress
                showInfo={false}
                strokeColor="#ff0063"
                percent={100}
                success={{
                  percent: `${
                    (item.spent.value / item.available_to_spend.value) * 100
                  }`,
                  strokeColor: "#00994b",
                }}
              />
              <table className="payment-card-table">
                <thead>
                  <tr>
                    <th>
                      {" "}
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          maxWidth: "55px",
                          backgroundColor: "#00994b",
                          padding: "",
                          borderRadius: "15px",
                          fontWeight: "lighter",
                          color: "white",
                        }}
                      >
                        Spent
                      </span>
                    </th>
                    <td>
                      {item.spent.value} {item.spent.currency}
                    </td>
                    <th>
                      {" "}
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          maxWidth: "55px",
                          backgroundColor: "#ff0063",
                          padding: "",
                          borderRadius: "15px",
                          fontWeight: "lighter",
                          color: "white",
                        }}
                      >
                        Balance
                      </span>
                    </th>
                    <td>
                      {item.available_to_spend.value}{" "}
                      {item.available_to_spend.currency}
                    </td>
                  </tr>
                </thead>
                {/* <tbody>
                  <tr className="table_tr"></tr>
                </tbody> */}
              </table>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Homes;

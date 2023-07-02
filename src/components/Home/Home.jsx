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
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FilterOutlined } from "@ant-design/icons";
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
  };

  // search Handler for searching card by card name
  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  // const clearBtn = () => {
  //   setFilteredData([])
  // };

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

      <Row // for the secondary header  search and filter
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
                    <Button className="apply_btn">Apply</Button>
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
            <Button>
              <FilterOutlined /> filter
            </Button>
          </Popover>
        </Col>
      </Row>
      <Row gutter={24}>
        {/* card display starts */}
        {filteredData.map((item, id) => (
          <Col span={8} key={id}>
            <Card className="payment_card" title={item.name}>
              <Typography>Card type : {item.card_type}</Typography>

              <table className="payment-card-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th>Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table_tr">
                    <td>
                      {item.limit} {item.currency}
                    </td>
                    <td>{item.frequency}</td>
                    <td>{item.expiry}</td>
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
                    <th>Spent</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table_tr">
                    <td>
                      {item.spent.value} {item.spent.currency}
                    </td>
                    <td>
                      {item.available_to_spend.value}{" "}
                      {item.available_to_spend.currency}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Homes;

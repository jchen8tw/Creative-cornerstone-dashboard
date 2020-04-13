import React from "react";
import { Table } from "reactstrap";
const colors = [
  "brown",
  "red",
  "orange",
  "gold",
  "green",
  "lightseagreen",
  "dodgerblue",
  "darkblue",
  "darkmagenta",
  "indigo",
];
export default (props) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>rank#</th>
          <th>Group Name</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div
              style={{
                fontSize: "20px",
                color: "white",
                lineHeight: "60px",
                width: "60px",
                height: "60px",
                background: colors[0],
                borderRadius: "50%",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              1
            </div>
          </td>
          <td style={{ verticalAlign: "middle", fontSize: "20px" }}>team 1</td>
          <td style={{ verticalAlign: "middle", fontSize: "20px" }}>100</td>
        </tr>
        <tr>
          <td>
            <div
              style={{
                fontSize: "20px",
                color: "white",
                lineHeight: "60px",
                width: "60px",
                height: "60px",
                background: colors[1],
                borderRadius: "50%",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              2
            </div>
          </td>
          <td style={{ verticalAlign: "middle", fontSize: "20px" }}>team 2</td>
          <td style={{ verticalAlign: "middle", fontSize: "20px" }}>50</td>
        </tr>
      </tbody>
    </Table>
  );
};

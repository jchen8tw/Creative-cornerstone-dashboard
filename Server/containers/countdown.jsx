import React, { useEffect, useState } from "react";
import { ListGroupItem } from "reactstrap";
export default (props) => {
  let [seconds, setseconds] = useState(120);
  useEffect(() => {
    const timer = setInterval(
      () =>
        setseconds((second) => {
          if (second > 0) return second - 1;
          else return 0;
        }),
      1000
    );
    return () => clearInterval(timer);
  });
  let minutes = Math.floor(seconds / 60);
  let show_seconds = seconds - minutes * 60;
  return (
    <>
      <ListGroupItem>
        <h2>Time Remaining</h2>
      </ListGroupItem>
      <ListGroupItem>
        {minutes} minutes {show_seconds} seconds
      </ListGroupItem>
    </>
  );
};

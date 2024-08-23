import Button from "../Button/Button";
import React from "react";
import styles from "./Body.module.css";

function Body({setActive, selected}) {
  return (
    <div className={styles.body}>
      <Button text="Join a deal" inactive onClick={() => setActive(1)} disabled={selected === 1}/>
      <Button text="Create a deal" inactive onClick={() => setActive(2)} disabled={selected === 2}/>
      <Button text="Pending deals" inactive onClick={() => setActive(3)} disabled={selected === 3}/>
    </div>

  );
}

export default Body;

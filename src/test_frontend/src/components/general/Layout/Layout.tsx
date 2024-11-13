import React from "react";
import styles from "./Layout.module.css";
import { Container } from "reactstrap";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.Layout}>{children}</div>;
};

export const LayoutHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.Header}>{children}</div>;
};

export const LayoutBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container fluid className={styles.Body}>
      {children}
    </Container>
  );
};

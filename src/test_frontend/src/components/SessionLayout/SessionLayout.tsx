import { Outlet, useNavigate } from "react-router-dom";
import { Layout, LayoutBody, LayoutHeader } from "../general/Layout/Layout";
import { Navbar, NavbarBrand, Nav, NavItem, Button } from "reactstrap";
import styles from "./SessionLayout.module.css";
import { useAuthContext } from "../../context/hooks/useAuthContext";

const SessionLayout = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();

  return (
    <Layout>
      <LayoutHeader>
        <Navbar expand="md">
          <NavbarBrand className={styles.NavBrand}>mHome</NavbarBrand>
          <Nav className={styles.Nav} navbar>
            <NavItem>
              <Button
                onClick={() => {
                  navigate("/admin/home");
                }}
                className={styles.NavButton}
              >
                Home
              </Button>
            </NavItem>
            <NavItem>
              <Button
                onClick={() => {
                  navigate("/admin/voting");
                }}
                className={styles.NavButton}
              >
                Nueva Votación
              </Button>
            </NavItem>
            <NavItem>
              <Button
                onClick={() => auth.logout()}
                className={styles.NavButton}
              >
                Salir!
              </Button>
            </NavItem>
          </Nav>
        </Navbar>
      </LayoutHeader>
      <LayoutBody>
        <Outlet />
      </LayoutBody>
    </Layout>
  );
};

export default SessionLayout;

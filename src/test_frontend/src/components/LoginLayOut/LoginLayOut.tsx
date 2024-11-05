import mHomeLogo from "../../assets/Login/MHomeLogo.svg";
import styles from "./LoginLayOut.module.css";

const LoginLayOut = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <img className={styles.image} src={mHomeLogo} alt="MHome" />
      </div>
      <div className={styles.sideBar}>{children}</div>
      <div className={styles.imageContainer} />
    </div>
  );
};

const SideBarComponent = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.sideBarContent}>{children}</div>;
};

LoginLayOut.SideBarComponent = SideBarComponent;

export default LoginLayOut;

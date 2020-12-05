import * as React from "react";

interface NavBarProps {
  title: string;
}
const NavBar = (props: NavBarProps) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="navbar-brand">{props.title}</div>
    </nav>
  );
};

export default NavBar;

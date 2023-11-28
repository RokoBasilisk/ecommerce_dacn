import React, { useEffect } from "react";
import { connect } from "react-redux";

export function Product({ match, history }) {
  return (
    <>
      <>hi</>
    </>
  );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Product);

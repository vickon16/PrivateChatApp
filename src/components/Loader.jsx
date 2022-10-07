import {ColorRing} from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <ColorRing
        visible={true}
        height="50"
        width="50"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["steelblue", "#ccc", "white", "steelblue", "white"]}
      />
    </div>
  );
};

export default Loader;
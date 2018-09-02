
const globalStyles = require("../global.scss").default;

export default (props: any) => {
  return (
    <div>
      {props.children}
      <style jsx global>{globalStyles}</style>
    </div>
  );
};
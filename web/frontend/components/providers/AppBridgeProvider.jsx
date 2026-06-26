export const AppBridgeProvider = (props) => {
  const children = props.children;
  
  if (children != undefined) {
    console.log("AppBridgeProvider is rendering with children");
    return <>{children}</>;
  } else {
    console.log("No children passed to AppBridgeProvider!");
    return <></>;
  }
}

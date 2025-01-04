export const getUserLatAndLng = (): [number, number] => {
  let newPosition: [number, number] = [0, 0];
  navigator.geolocation.getCurrentPosition((position) => {
    const latNum = position.coords.latitude;
    const lngNum = position.coords.longitude;
    const pos: [number, number] = [latNum, lngNum];
    newPosition = pos;
  });

  return newPosition;
};

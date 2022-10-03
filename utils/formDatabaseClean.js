exports.secureRegistro = (res, params) => {
  params.forEach((element) => {
    if (res[element]) {
      delete res[element];
    }
  });

  return res;
};

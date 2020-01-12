// Created by CunjunWang on 2020/1/12

module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

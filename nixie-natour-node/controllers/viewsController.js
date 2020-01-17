// Created by CunjunWang on 2020/1/17

exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours'
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
};

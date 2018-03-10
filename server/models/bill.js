module.exports = (sequelize, DataTypes) => {
  const Bill = sequelize.define('Bill', {
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
      title: {
          type: DataTypes.STRING,
          allowNull: false
      }
  }, {});


  Bill.associate = function(models) {
    // associations can be defined here
  };
  return Bill;
};
module.exports = (sequelize, DataTypes) => {
  const Bill = sequelize.define('Bill', {
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
      title: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      check: {
        type: DataTypes.BOOLEAN,
          default: false
      }
  }, {});


  Bill.associate = function(models) {
    // associations can be defined here
  };
  return Bill;
};
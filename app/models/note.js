module.exports = function(sequelize, Sequelize) {

    var Note = sequelize.define('note', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        userid: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        text: {
            type: Sequelize.TEXT
        },
        done: {
            type: Sequelize.CHAR(1),
        }
      }, {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps: false
    });
    return Note;
}

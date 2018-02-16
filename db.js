import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

const Conn = new Sequelize(
  'sample',
  'root',
  'root',
  {
    dialect: 'mysql',
    host: 'localhost',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  });

const Person = Conn.define('person', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

const Post = Conn.define('post', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Comment = Conn.define('comment', {
  content: {
    type: Sequelize.STRING,
    allowNull:false
  }
});

Person.hasMany(Post);
Person.hasMany(Comment);
Post.hasMany(Comment);
Post.belongsTo(Person);
Comment.belongsTo(Person);
Comment.belongsTo(Post);

export default Conn;
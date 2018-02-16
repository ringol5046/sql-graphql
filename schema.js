import { GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull } from 'graphql';
import Db from './db';


const Person = new GraphQLObjectType({
  name: 'Person',
  description:'This represents a Person',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(person) {
          return person.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(person) {
          return person.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(person) {
          return person.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve(person) {
          return person.email;
        }
      },
      posts: {
        type: GraphQLList(Post),
        resolve(person) {
          return person.getPosts();
        }
      },
      comment: {
        type: GraphQLList(Comment),
        resolve(person) {
          return person.getComments();
        }
      }
    };
  }
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'This is a Post',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(post) {
          return post.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve(post) {
          return post.title;
        }
      },
      content: {
        type: GraphQLString,
        resolve(post) {
          return post.content;
        }
      },
      comments: {
        type: GraphQLList(Comment),
        resolve(post) {
          return post.getComments();
        }
      },
      person: {
        type: Person,
        resolve(post) {
          return post.getPerson();
        }
      }
    };
  }
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(comment) {
          return comment.id;
        }
      },
      content: {
        type: GraphQLString,
        resolve(comment) {
          return comment.content;
        }
      },
      person: {
        type: Person,
        resolve(comment) {
          return comment.getPerson();
        }
      },
      post: {
        type: Post,
        resolve(comment) {
          return comment.getPost();
        } 
      }
    }
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return {
      people: {
        type: new GraphQLList(Person),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return Db.models.person.findAll({ where: args });
        } 
      },
      posts: {
        type: new GraphQLList(Post),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return Db.models.post.findAll({ where: args });
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return Db.models.comment.findAll({ where: args });
        }
      },
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPeople: {
      type: Person,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(root, { firstName, lastName, email }) {
        return Db.models.person.create({
          firstName,
          lastName,
          email: email.toLowerCase()
        })
      }
    },
    deletePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(root, { id }) {
        return Db.models.post.destroy({ where: { id } });
      }
    },
    updateComment: {
      type: Comment,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        content: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(root, { id, content }) {
        let value = { content: content }
        return Db.models.comment.update(value, { where: { id } });
      }
    } 
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;

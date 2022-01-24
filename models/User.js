const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create user model
class User extends Model{
    //set up method to run on instance data(per user) to check password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//define table columns and configuration
User.init(
    {
        //define an id column
        id:{
            //use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        //define a username column
        username:{
            type: DataTypes.STRING,
            allowNull: false
        },
        //define and email column
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            //cant be duplicates
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating the table data
            validate:{
                isEmail: true
            }
        },
        //define password column
        password:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                //this means the password is atleast four characters long
                len: [4]
            }
        }
    },
    {
        hooks:{
            //set up beforeCreate lifecycle hook functionality
            async beforeCreate(newUserData){
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            //set up beforeUpdate lifecycle hook functionality
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //table config options go here
        //pass in out imported sequelize connection (direct connection to our database)
        sequelize,
        //dont automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        //dont pluralize name of database table
        freezeTableName: true,
        //use underscored instead of camel-casing
        underscored:true,
        //make it so our model name stays lowercase in the database
        modelName:'user'
    },
);

module.exports=User;
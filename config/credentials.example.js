/**
 * Created with JetBrains WebStorm.
 * User: atreceno
 * Date: 06/05/2013
 * Time: 19:30
 */
module.exports = {
    development: {
        db: {uri: 'mongodb://host[:port]/[database]',
            options: {
                //db: { native_parser: true },
                //server: { poolSize: 5 },
                //replset: { rs_name: 'myReplicaSetName' },
                user: '',
                pass: ''
            } }
    },
    production: {
        db: {uri: 'mongodb://host[:port]/[database]',
            options: {
                //db: { native_parser: true },
                //server: { poolSize: 5 },
                //replset: { rs_name: 'myReplicaSetName' },
                user: '',
                pass: ''
            } }
    }
};

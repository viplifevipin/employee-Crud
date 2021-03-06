var MongoClient=require('mongodb').MongoClient;
var state={
    db:null,
};
module.exports.connect=function(done){
    if(state.db)return done();

    const url='mongodb://localhost:27017';

    const dbName='mine';
    const client=new MongoClient(url,{useNewUrlParser:true,useUnifiedTopology:true});

    client.connect(function (err) {

        if(err) return done(err);
        console.log("connnected successfully to Database");
        const dbs=client.db(dbName)
        state.db=dbs;
        done();


    });
};
module.exports.get=function () {
    return state.db;
};

//const Datastore = require('nedb-multi')(Number(process.env.NEDB_MULTI_PORT||3333));
const Datastore = require('nedb');
const moment = require('moment-timezone');
const path = require('path');
const fs = require('fs');
var S3;// = require("../aws/s3");
var schedule = require('node-schedule');

class NeDB{
	static backupConfig(defaultList,scheduleTime){		
		if(scheduleTime){
			console.log(`backup:\ttime: ${scheduleTime}`.green)			
			schedule.scheduleJob(scheduleTime, ()=>{
					NeDB.backup(defaultList)
				})
		}
		console.log(`\tlist: ${defaultList}`.green)
		NeDB._backupList=defaultList
	}
	static copyConfig(defaultList){
		console.log(`copy:\tlist: ${defaultList}`.green)
		NeDB._copyList=defaultList
	}
	static backupTime(schedule){
		NeDB._instance.forEach(item=>{
			item.setBackupTime(schedule);
		})
	}
	static getInstances(){
		return NeDB._instance;
	}
	static async copyMostRecentDB(list){
		list=list||NeDB._copyList;
		var result = []
		for (var i in NeDB._instance){
			var nedb = NeDB._instance[i];
			if(!list || list.indexOf(nedb.id)>=0){
				var data={}
				try{data = await nedb.copyFromS3();}
				catch(e){data.error=e}
				data.db=nedb.name;
				result.push(data);
			}
		}
		setTimeout(()=>{process.exit(0)},10000)
		return result;
	}
	static async backup(list){		
		list=list||NeDB._backupList;
		var result = []
		for (var i in NeDB._instance){
			var nedb = NeDB._instance[i];
			if(!list || list.indexOf(nedb.id)>=0){
				var data={}
				try{data.s3 = await nedb.copyToS3();}
				catch(e){data.error=e}
				data.db=nedb.name;
				result.push(data);
			}
		}
		return result;
	}
	static instance(config,s3,backupTime){
		NeDB._instance=NeDB._instance||[];

		var name =config.filename;				
		var instance = NeDB._instance.find(item=>item.name==name)
		if(instance) return instance;
		return new NeDB(config,s3,backupTime)
	}

	constructor(config,s3,backupTime){				
		this.db = new Datastore(config);
		this.db.loadDatabase(()=>console.log("loaded",this.name));	
		this.name=config.filename;		
		this.file=config.filename;	
		this.id = path.basename(this.name,".nedb")
		if(!NeDB._instance) NeDB._instance=[];
		NeDB._instance.push(this);
		console.log(`dbase:\t${this.id}`.green,this.file)

		if(s3)	this.s3 = S3.instance(s3.key,s3.secret,s3.bucketName,s3.root);
		if(backupTime) this.setBackupTime(backupTime);
		}


	ensureIndex(config){
		this.db.ensureIndex(config);
	}
	async update(select,update,options){		
		return new Promise((ok,ko)=>{
			this.db.update(select,update,options||{},(err,doc)=>{
				if(err) return ko(err);
				ok(doc);
			})
		})
	}
	async count(select){
		select=select||{};
		return new Promise((ok,ko)=>{
			this.db.count(select||{},(err,doc)=>{
				if(err) return ko(err);
				ok(doc);
			})
		})	
	}
	async find(select,opt){		
		return new Promise((ok,ko)=>{
			var query = this.db.find(select);			
			if(opt && opt.skip) query=query.skip(parseInt(opt.skip))
			if(opt && opt.limit) query=query.limit(parseInt(opt.limit))
			if(opt && opt.sort) query=query.sort(opt.sort)
			query.exec((err,doc)=>{
				if(err) return ko(err);
				ok(doc);
			})
		})	
	} 
	async findOne(select){
		return new Promise((ok,ko)=>{
			this.db.findOne(select,(err,doc)=>{
				if(err) return ko(err);
				ok(doc);
			})
		})	
	}
	async insert(data){				
		return new Promise((ok,ko)=>{
			this.db.insert(data,(err,doc)=>{
				if(err) return ko(err);
				ok(doc);
			})
		})		
	}
	async remove(data){
		return new Promise((ok,ko)=>{
			this.db.remove(data,(err,doc)=>{
				if(err) return ko(err);
				ok(doc);
			})
		})		
	}

	
	setBackupTime(time){
		if(this.s3)	schedule.scheduleJob(time, ()=>{this.copyToS3();});
	}
	setBackupOnS3(s3){
		this.s3=s3;
	}
	async backup(){
		await this.copyToS3()
	}
	async copyToS3(){
		console.log("backup: "+this.file)
		if(!this.s3) throw "no S3 defined 'setBackupOnS3'";
		var date = moment(new Date()).format("yyyy-MM-DD")
		var name = path.basename(this.file);
		console.log(this.file+"-->"+`${name}/${date}.nedb`)
		return await this.s3.saveFile(this.file,`${name}/${date}.nedb`);		
	}
	async copyFromS3(){

		return new Promise(async (ok,ko)=>{
			if(!this.s3) return ko(this.name+": no S3! defined 'setBackupOnS3'");
			var name = path.basename(this.file);			
			var file = await this.s3.loadLastModifiedFile(name);
			if(file==null)	return ko(this.name+": no found on S3!");
			var readStream = this.s3.getReadStream(file.Key)
			var writeStream = fs.createWriteStream(this.file)

				readStream.on('error', (e) => {writeStream.destroy(); ko(e)});					
				writeStream.on('close', () => {readStream.destroy(); ok(file);});
				writeStream.on('error', (e) => {readStream.destroy(); ko(e);});			
			readStream.pipe(writeStream);
		})
	}
	
}

module.exports = {NeDB:NeDB};

 
/*
(async ()=>{
	//try to save db on S3
	var s3 = require("../aws/s3").instance("AKIAITNQVHVOOKXBTO2A","H/R74z/qwWgOPgJ6Jo1ViM1Q6ZbPTtpNczb5bXgl","basepaws-archive");

	var db = NeDB.instance({ filename: path.resolve(__dirname,'test.nedb'), autoload: true });
	db.setBackupOnS3(s3);
	//db.insert({ciao:"ciao"})
	//await db.copyToS3()
	await db.copyFromS3()
	

})()
*/
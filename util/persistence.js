var {NeDB:Db} = require("./nedb")
var path = require("path")
var {v4:uuid} = require("uuid");
var services = require("./services");

class Document{

	static config(dir,s3,backupTime){
		
		this.setDB(dir,s3,backupTime);	
	}
	static setDB(dir,s3,backupTime){
		if(typeof(dir)!="string") {this.db=dir; return;}

		var dbName = this.name.toLowerCase()+".nedb"
		var dir = path.resolve(process.cwd(),dir)
		var db = Db.instance({ filename: path.resolve(dir,dbName), autoload: true },s3,backupTime);			
		this.configDB&&this.configDB(db);

		this.db = db
	}
	
	constructor(data,action){		
		data=data||{}

		this.waitingList=[];		
		this.stop=0;

		this.action=action;
		const isNew = !data.id		
		data.id=data.id||uuid()
		Object.assign(this,data)
		if(isNew) this.isNew=true;		
	}
	schema(schema){

	}
	static async newObject(data,action){
		var obj=new (this)(data,action);
		await obj.waiting();
		return obj;
	}

	static async delete(id){
		await this.db.delete({id:id});
	}
	static async update(select,update,options){
		console.log(select,update,options)
		return await this.db.update(select,update,options);	
	}

	static async get(search){		
		var data = await this.db.findOne(search)
		if(!data) return null;		
		var value= await this.newObject(data)
		
		return value;
	}
	
	static async count(search){
		return await this.db.count(search);
	}

	static async find(search,page=0,pageSize,sort){		
		var opt={}
		if(pageSize!=null)
			opt={limit:pageSize,skip:pageSize*page}		
		if(sort!=null)
			opt["sort"]=sort;

		const list = await this.db.find(search,opt);		
		var values =await Promise.all(list.map(item=>this.newObject(item,"load")))

		return values;
	}
	static async new(data,user){		
		var obj = await this.newObject(data,"new");				
		await obj.save(user);
		
		return obj;
	}
	get db(){
		return this.constructor.db;
	}

	get id(){return this._uuid;}
	set id(value)	{
		if(!value) return;
		this._uuid=value;
		this.isNew=false;
	}

	async waiting(){		
		if(this.stop==0) return;
		return new Promise(ok=>{
			this.waitingList.push(ok);
		})		
	}
	async go(){
		this.waitingList.concat([]).forEach(ok=>ok())
		this.waitingList=[];
	}
	async load(){}
	async get(url){
		this.stop++
		try{	return await services.get(url);}
		finally{
			this.stop--
			if(this.stop==0) this.go();	
		}
	}
	async delete(){
		await this.db.remove({id:this.id});
	}
	toDB(){
					
	}

	async save(user){
		await this.waiting();
		var data;
		if(this.toJSONDB) 	data= this.toJSONDB();
		else 				data= this.toJSON("db");	

		if(this.isNew)			{
			this.isNew=false;
			this.creation_time=new Date();
			this.created_by=user?user.email||user.name:null;
			data.creation_time=this.creation_time;
			data.created_by=this.created_by;
			return await this.db.insert(data)
		}
		
		this.updated_time=new Date();
		this.updated_by= user?user.email||user.name:null;
		data.updated_time=this.updated_time;
		data.updated_by=this.updated_by;
		await this.db.update({id:this.id},{$set:data})		
	}
	toJSON(){
		return this;
	}
}
module.exports = {Document:Document}
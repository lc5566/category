
class Media extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showChildren: true
		};
		this.add = this.add.bind(this)
		this.change = this.change.bind(this)
		this.toggle = this.toggle.bind(this)
		this.d = this.d.bind(this)
	}
	d() {
		this.props.d(this.props.id)
	}
	toggle() {
		this.setState((prev) =>
			({ showChildren: !prev.showChildren })
		)

	}
	change(e) {
		this.props.c(e.target.value, this.props.id);
	}
	add() {
		this.props.x(this.props.id)
	}
	render() {
		var span;
		if (this.props.children) {
			span = <span onClick={this.toggle}>{this.state.showChildren ? '-' : '+'}</span>
		}
		return (
			<div className="media">
				<div className="media-left">
					{span}
				</div>
				<div className="media-body">
					<h4 className="media-heading">
						<input type="text" className="from-control" onChange={this.change} defaultValue={this.props.head} />
					</h4>
					<div className="add" onClick={this.add}>
						<span className="jia">+</span>
					</div>
					<div className="delete" onClick={this.d}>
						<span>x</span>
					</div>
					<div style={{ display: (this.state.showChildren ? 'block' : 'none') }}>
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
}
class Panel extends React.Component {
	render() {
		return (
			<div className="panel panel-danger">
				<div className="panel-heading">
					{this.props.title}
				</div>
				<div className="panel-body">
					{this.props.children}
				</div>
			</div>
		)
	}
}
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cats: []
		}
		this.add1 = this.add1.bind(this);
		this.update = this.update.bind(this);
		this.delete = this.delete.bind(this);
	}
	delete(id) {
		var r = {};
		function L(cats, id) {
			cats.forEach(function (v) {
				if (v.parentId === id) {
					r[v.id] = true;
					L(cats, v.id)
				}
			})
		}
		L(this.state.cats, id);
		r[id] = true;
		$.ajax({
			url: '/cats',
			type: 'delete',
			data: { ids: Object.keys(r).join(',') }
		});

		this.setState(function (prev) {
			var arr = prev.cats.filter(function (v) {
				return !r[v.id];
			});
			return {
				cats: arr
			}
		})
	}
	update(value, id) {
		$.ajax({
			url: '/cats',
			type: 'put',
			data: { id: id, title: value },
			success: function (res) {
				if (res.state == 'ok') {
				}
			}
		})
		this.setState(function (prev) {
			prev.cats.forEach(function (v, i) {
				if (v.id === id) {
					prev.cats[i].title = value;
				}
			})
		})
	}
	add1(id) {
		$.ajax({
			type: 'post',
			url: '/cats',
			data: { title: '', id: id },
			success: (function (insertid) {
				this.setState((prev) => {
					var item = {
						id: insertid,
						title: "",
						parentid: id
					}
					prev.cats.push(item);
					return { cats: prev.cats }
				})
			}).bind(this)
		})
	}
	componentDidMount() {
		$.ajax({
			url: '/cats',
			type: 'get',
			success: (function (data) {
				console.log(data);
				this.setState({
					cats: data
				})
			}).bind(this)
		})
	}
	render() {
		var cats = this.state.cats;
		var self = this;
		//		function findByparentId(arr,pid){
		//		    return 	arr.filter(function(v){
		//		    	return v.parentId===v.id;
		//		    })
		//		}
		//		function V(pid){
		//			var tem=findByparentId(cats,pid);
		//			if(tem.length){
		//				return tem.map(function(v){
		//					return (
		//						<Media key={v.id} head={v.title}>
		//						  {V(v.id)}
		//						</Media>
		//					)
		//				})
		//			}else{
		//				return null
		//			}
		//			
		//		}
		function V(root) {
			var subCates = cats.filter((v) => v.parentid === root)
			if (subCates.length) {
				return subCates.map((v) =>
					<Media id={v.id} c={self.update} x={self.add1} d={self.delete} key={v.id} head={v.title}>{V(v.id)}</Media>
				)
			} else {
				return null
			}

		}
		var views = V(0);
		return (
			<div>
				<Panel title="标题">
					<h4>内容部分</h4>
				</Panel>
				<Panel title="目录">
					{views}

				</Panel>

			</div>
		)
	}
}
//class Hello extends React.Component{
//	render(){
//		return(
//			<div>	
//			   <h1>hello</h1>
//			</div>
//		)
//	}
//}
//const cats=[
//{id:1,title:"1",parentId:0},
//{id:2,title:"2",parentId:0},
//{id:3,title:"3",parentId:0},
//{id:4,title:"2-1",parentId:2},
//{id:5,title:"2-1-1",parentId:4},
//{id:6,title:"3-1",parentId:3},
//{id:7,title:"3-1-1",parentId:6},
//{id:8,title:"3-1-1-1",parentId:7},
//]
//	

ReactDOM.render(<App />, document.querySelector(".container"))

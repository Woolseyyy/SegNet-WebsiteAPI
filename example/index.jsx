var React=require("react");
var ReactDOM=require("react-dom");
var routeObj=require("react-router");
var Router=routeObj.Router;
var hashHistory=routeObj.hashHistory;
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
var style=require('./Common/init.css');

injectTapEventPlugin();

class App extends React.Component{
    componentDidMount(){
        let config = {
            vx: 4,//点x轴速度,正为右，负为左
            vy:  4,//点y轴速度
            height: 2,//点高宽，其实为正方形，所以不宜太大
            width: 2,
            count: 100,//点个数
            color: "121, 162, 185",//点颜色
            stroke: "130,255,255",//线条颜色
            dist: 6000,//点吸附距离
            e_dist: 20000,//鼠标吸附加速距离
            max_conn: 10//点到点最大连接数
        };
        //调用
        CanvasParticle(config);
    }
    render(){
        return(
            <MuiThemeProvider>
                <div id="mydiv">
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        )
    }
}

var rootRoute={
    childRoutes:[{
        path:'/',
        component:App,
        indexRoute:require("./Page/Train"),
        childRoutes:[
            require('./Page/Use')
        ]
    }]
};

class Root extends React.Component{
    render(){
        return(
            <Router
                history={hashHistory}
                routes={rootRoute}
            />
        )
    }
}

ReactDOM.render(
    <Root />,
    document.getElementById("app")
);


//通用方法
let isArrayLike = (o) => {
    return !!(o &&                                // o is not null, undefined, etc.
    typeof o === 'object' &&            // o is an object
    isFinite(o.length) &&               // o.length is a finite number
    o.length >= 0 &&                    // o.length is non-negative
    o.length === Math.floor(o.length) &&  // o.length is an integer
    o.length < 4294967296);                       // Otherwise it is not
};

let ArrayLikeParse = (ob) => {
    let array = [];
    for (let index in ob) {
        array.push(ob[index]);
    }
    return array;
};

let obParse = (ob) => {
    if (typeof(ob) === 'object') {
        for (let art in ob) {
            ob[art] = obParse(ob[art]);
        }
        if (isArrayLike(ob)) {
            //console.log(ArrayLikeParse(ob));
            //console.log(typeof ArrayLikeParse(ob));
            return ArrayLikeParse(ob);
        }
        else {
            //console.log(ob);
            let result = {};
            for (let art in ob) {
                //console.log(art);
                result[art] = ob[art];
            }
            return result;
        }
    }
    else {
        return ob;
    }
};

//let url = 'http://47.89.179.202:3000';
let url = 'http://10.214.143.19:3000';
window.gloable = {
    obParse: obParse,
    url:url
};

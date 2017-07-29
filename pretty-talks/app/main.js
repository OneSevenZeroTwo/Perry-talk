import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import VueAwesomeSwiper from 'vue-awesome-swiper'
import axios from "axios";
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import lodash from 'lodash';
import $ from "jquery";

Vue.use(MuseUI);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueAwesomeSwiper);
Vue.prototype.$ajax = axios;
Vue.prototype._ = lodash;
Vue.prototype.$ = $;

// 样式
import "./css/base.css";
import "./css/weui.css";

// 组件
import Pindex from './router/pindex.vue';
import Phome from './router/router/phome.vue'
import Psort from "./router/router/psort.vue"
import Plogin from "./router/plogin.vue";
import Preg from "./router/preg.vue";
import Regstep1 from "./router/router/regstep1.vue";
import Regstep2 from "./router/router/regstep2.vue";
import sub from "./router/pmine.vue";
import Pchlist from "./component/pchlist.vue";
import car from "./router/pcar.vue";
import Plist from "./router/plist.vue";
import Plong from "./router/pdate.vue";
import Plisting from "./router/plisting.vue";
import order from "./router/porder.vue";
import address from "./router/paddress.vue";
import addaddr from "./router/paddaddr.vue";
import Pmycenter from "./router/pmycenter.vue";

//路由
var router = new VueRouter({
    routes: [{
            path: '/index',
            component: Pindex,
            children: [{
                path: 'home',
                component: Phome,
                children: [{
                    path: 'list/:sort/:page',
                    component: Pchlist,
                }]
            }, {
                path: 'category',
                component: Psort

            }]
        },
        {
            path: '/subCategory/:pid',
            component: sub,
        },
        {
            path: '/login',
            component: Plogin
        },
        {
            path: "/car",
            component: car
        },
        {
            path: "/order",
            component: order
        },
        {
            path: "/address",
            component: address
        },
        {
            path: "/addaddr",
            component: addaddr
        },
        {
            path: '/reg',
            component: Preg,
            children: [{
                path: 'step1',
                component: Regstep1,
            }, {
                path: 'step2/:phone',
                component: Regstep2,
            }]
        },{
	        path: "/mycenter",
	        component: Pmycenter
        },{
            path: '/',
            redirect: 'index/home/list/pop'
        },{
        	path:'/listed/:pcid',
        	component:Plist,
        },{
        	path:'/detail/:iid',
        	component:Plong
        },{
        	path:'/listing/:pcid',
        	component:Plisting,
    }]

})

//vuex
var store = new Vuex.Store({
    state: {
        carList: [],
        pid: null,
        carProId: null,
        carProNum: null,
        // delList: null,
        carousel: null,
        special: null,
        liactive: null,
        litime: null,
        sort: 'pop',
        list: [],
        news:null,
        res:null,
        now:null,
        iid:null,
        gooding:null,
        choose:null,
        pcid:null,
        chin:null,
        sented:true,
        rus:null,
        isChecked: [],
        orderList: [],
        addressPid: null,
        addressCid: null,
        addressDid: null,
		userAddr:null,
		addrListId:null,
		addrList:null,
		useAddrId:null,
		isAddrDefault:"0",
        isshowmore: true,
        isshowsearch: false,
        isshowtsea: true
    },  

    getters:{

    },

	//分发状态
	mutations: {
		//获取购物车列表数据
		getCarList(state) {
			axios.get("http://localhost:5555/read")
				.then((res) => {
					state.carList = state.carList.concat(res.data);
					state.isChecked = state.carList.map(function(item) {
						return item.id;
					});
					console.log(state.isChecked);
				}).catch((err) => {})
		},
		//修改购物车列表选中项数据
		setCarList(state) {
			axios.get("http://localhost:5555/write", {
					params: {
						id: state.carProId,
						num: state.carProNum,
					}
				})
				.then((res) => {
					console.log("数据写入成功：" + res);
				}).catch((err) => {})
		},
		//删除购物车列表选中项数据
		delCarList(state) {
			axios.get("http://localhost:5555/delete", {
					params: {
						id: state.carProId,
					}
				})
				.then((res) => {
					console.log("数据删除成功：" + res);
				}).catch((err) => {})
		},
		//设置收货地址
		setAddrList(state) {
			axios.get("http://localhost:5555/setAddr", {
					params: {
						address: state.userAddr,
					}
				})
				.then((res) => {
					console.log("设置收货地址成功：" + res);
				}).catch((err) => {})
		},
		//获取收货地址列表
		getAddrList(state) {
			axios.get("http://localhost:5555/getAddr")
				.then((res) => {
					console.log(state.useAddrId);
					if(state.useAddrId == null){
						console.log("res.data",res.data);
						state.addrList = res.data;
					}else{
						res.data.forEach((item)=>{
							if(item.id == state.useAddrId){
								state.addrList = item;
								console.log(state.addrList);
							}
						})
					}
				}).catch((err) => {})
		},
		//获取订单页收货地址
		getOrderAddr(state) {
			axios.get("http://localhost:5555/getAddr")
				.then((res) => {
					res.data.forEach((item)=>{
						if(item.isDefault == 1){
							state.addrList = item;
							console.log(state.addrList);
						}
					})
					
				}).catch((err) => {})
		},
		//修改收货地址
		modifyAddrList(state) {
			axios.get("http://localhost:5555/modifyAddr", {
					params: {
						id: state.useAddrId,
						address: state.userAddr,
					}
				})
				.then((res) => {
					console.log("修改收货地址成功：" + res);
				}).catch((err) => {})
		},
		//修改收货地址默认值0
		isnomodifyAddr(state) {
			axios.get("http://localhost:5555/isnomodifyAddr")
				.then((res) => {
					console.log("默认值写入成功：" + res);
				}).catch((err) => {})
		},
		//修改收货地址默认值1
		ismodifyAddr(state) {
			axios.get("http://localhost:5555/ismodifyAddr",{
				params:{
					id:state.useAddrId
				}
			})
				.then((res) => {
					console.log("默认值写入成功：" + res);
				}).catch((err) => {})
		},
		//删除收货地址
		delAddrList(state) {
			axios.get("http://localhost:5555/delAddr", {
					params: {
						id: state.addrListId,
					}
				})
				.then((res) => {
					console.log("数据删除成功：" + res);
				}).catch((err) => {})
		},
        // 获取城市列表
        setCityList(state) {
            axios.get("http://s17.mogucdn.com/new1/v1/bmisc/82c3fb334ddbd3af52bc4f148fbb4a67/199792409494.json")
                .then((res) => {
                    state.addressPid = res.data.result.location['0'];
                    // state.addressCid = state.addressPid.province;
                    // state.addressDid = state.addressCid.municipality;
                    console.log(state.addressPid);
                }).catch((err) => {})
        },
		setNews(state) {
			axios.get('http://localhost:999/fsort', {
					params: {

					},
				})
				.then((response) => {
					//state.news = state.news.concat(response.data.data)
				})
				.catch((error) => {
					console.log(error);
				});
		},
		getActive(state, data) {
			axios.get('http://localhost:999/active').then((data) => {
				// 轮播图
				state.carousel = data.data.data['43542'].list;
				// 9.9包邮活动
				state.special = data.data.data['13730'].list;
				// 限时活动
				state.liactive = data.data.data['42287'].list;
				// 实现时间
				state.litime = data.data.data['42287'].context.currentTime;
			}).catch((err) => {

			})
		},
		getActive(state) {

			axios.get("http://localhost:999/tsort", {
					params: {
						pid: state.pid
					}
				}).then((response) => {
					console.log(response)
					//state.res = response.data.data
					console.log(state.res)
				})
				.catch((error) => {
					console.log(error)
				})
		},
		getList(state, data) {
			axios.get('http://localhost:999/home', {
				params: {
					page: state.page,
					sort: state.sort
				}
			}).then((data) => {
				state.list = state.list.concat(data.data.data.list);
				// console.log(data.data.data.list)
			}).catch((err) => {

			})
		},
		setChar(state) {

			axios.get("http://localhost:999/tsort", {
					params: {
						pid: state.pid
					}
				}).then((response) => {
					console.log(response)
					//state.res = response.data.data
					console.log(state.res)
				})
				.catch((error) => {
					console.log(error)
				})

		},
        //详情页
        setDetail(state) {
            axios.get("http://localhost:999/main", {
                    params: {
                        iid: state.iid
                    }
                }).then((response) => {
                    console.log(response)
                    state.gooding = response.data.result
                    state.rus = response.data.result.detailInfo.detailImage
                    console.log(state.gooding)
                    console.log(state.rus)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        // 分类2
        setChar(state) {

            axios.get("http://localhost:999/tsort", {
                    params: {
                        pid: state.pid
                    }
                }).then((response) => {
//                  console.log(response)
                    state.res = response.data.value.category_1.list
					state.now = response.data.value.category_2.list
//                  console.log(state.res)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        //列表页1
        setChoose(state) {
            axios.get("http://localhost:999/choose", {
                    params: {
                        pcid: state.pcid
                    }
                }).then((response) => {
//                  console.log(response)
                    state.choose = response.data.data.list
                    console.log(state.choose)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
	},

	actions: {
		//提交触发 mutations 的 setCarList 获取 购物车 列表数据函数
		getCarList(context) {
			context.commit("getCarList");
		},
		//修改购物车数据函数
		setCarList(context) {
			context.commit("setCarList");
		},
		//修改购物车数据函数
		delCarList(context) {
			context.commit("delCarList");
		},
		//获取 城市 列表数据函数
		setCityList(context) {
			context.commit("setCityList");
		},
		//设置地址列表数据函数
		setAddrList(context) {
			context.commit("setAddrList");
		},
		//获取 地址 列表数据函数
		getAddrList(context) {
			context.commit("getAddrList");
		},
		//获取 地址 列表数据函数
		getOrderAddr(context) {
			context.commit("getOrderAddr");
		},
		//修改地址列表数据函数
		modifyAddrList(context) {
			context.commit("modifyAddrList");
		},
		//取消地址列为默认
		isnomodifyAddr(context) {
			context.commit("isnomodifyAddr");
		},
		//设置地址列为默认
		ismodifyAddr(context) {
			context.commit("ismodifyAddr");
		},
		//删除地址列表数据函数
		delAddrList(context) {
			context.commit("delAddrList");
		},
		setNews(context, data) {
			context.commit('setNews')
		},
		setChar(context, data) {
			context.commit('setChar')
		},
		getActive(context, data) {
			context.commit('getActive')
		},
		getList(context, data) {
			context.commit('getList')
		},
        setDetail(context, data) {
            context.commit('setDetail')
        },
        setChoose(context, data) {
            context.commit('setChoose')
        },
        setChing(context, data) {
            context.commit('setChing')
        },
	}
})

new Vue({
    el: '#pretty-talks',
    template: `<router-view></router-view>`,
    store,
    router,
})
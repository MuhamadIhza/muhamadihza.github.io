(function(t){function a(a){for(var s,i,r=a[0],l=a[1],c=a[2],p=0,u=[];p<r.length;p++)i=r[p],Object.prototype.hasOwnProperty.call(n,i)&&n[i]&&u.push(n[i][0]),n[i]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(t[s]=l[s]);m&&m(a);while(u.length)u.shift()();return o.push.apply(o,c||[]),e()}function e(){for(var t,a=0;a<o.length;a++){for(var e=o[a],s=!0,r=1;r<e.length;r++){var l=e[r];0!==n[l]&&(s=!1)}s&&(o.splice(a--,1),t=i(i.s=e[0]))}return t}var s={},n={app:0},o=[];function i(a){if(s[a])return s[a].exports;var e=s[a]={i:a,l:!1,exports:{}};return t[a].call(e.exports,e,e.exports,i),e.l=!0,e.exports}i.m=t,i.c=s,i.d=function(t,a,e){i.o(t,a)||Object.defineProperty(t,a,{enumerable:!0,get:e})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,a){if(1&a&&(t=i(t)),8&a)return t;if(4&a&&"object"===typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(i.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&a&&"string"!=typeof t)for(var s in t)i.d(e,s,function(a){return t[a]}.bind(null,s));return e},i.n=function(t){var a=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(a,"a",a),a},i.o=function(t,a){return Object.prototype.hasOwnProperty.call(t,a)},i.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],l=r.push.bind(r);r.push=a,r=r.slice();for(var c=0;c<r.length;c++)a(r[c]);var m=l;o.push([0,"chunk-vendors"]),e()})({0:function(t,a,e){t.exports=e("56d7")},"034f":function(t,a,e){"use strict";e("85ec")},"56d7":function(t,a,e){"use strict";e.r(a);e("e260"),e("e6cf"),e("cca6"),e("a79d");var s=e("2b0e"),n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{attrs:{id:"app"}},[e("app-nav",{attrs:{loggedIn:t.loggedIn}}),e("div",{staticClass:"container"},[e("router-view")],1)],1)},o=[],i=(e("b0c0"),function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("nav",{staticClass:"navbar navbar-expand-lg navbar-dark bg-dark"},[e("div",{staticClass:"container"},[e("router-link",{staticClass:"navbar-brand",attrs:{to:t.loggedIn?"/":"signin"}},[t._v(t._s(t.brand))]),t._m(0),e("div",{staticClass:"collapse navbar-collapse",attrs:{id:"navbarSupportedContent"}},[t.loggedIn?e("ul",{staticClass:"navbar-nav mr-auto"},[e("MenuLink",{attrs:{path:"/",text:"Home"}}),e("li",{staticClass:"nav-item"},[e("a",{staticClass:"nav-link",attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.logout()}}},[t._v("Logout")])])],1):e("ul",{staticClass:"navbar-nav mr-auto"},[e("MenuLink",{attrs:{path:"/signin",text:"Signin"}}),e("MenuLink",{attrs:{path:"/signup",text:"Signup"}})],1)])],1)])}),r=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("button",{staticClass:"navbar-toggler",attrs:{type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation"}},[e("span",{staticClass:"navbar-toggler-icon"})])}],l=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("router-link",{staticClass:"nav-item",attrs:{"active-class":"active",to:t.path,tag:"li"}},[e("a",{staticClass:"nav-link"},[t._v(t._s(t.text))])])},c=[],m={props:["path","text"]},p=m,u=e("2877"),d=Object(u["a"])(p,l,c,!1,null,null,null),v=d.exports,f={props:["loggedIn"],data:function(){return{brand:"Personal Assesment Web"}},components:{MenuLink:v},methods:{logout:function(){this.$store.dispatch("logout")}}},g=f,h=Object(u["a"])(g,i,r,!1,null,null,null),_=h.exports,w={computed:{loggedIn:function(){return this.$store.getters.loginState}},name:"App",components:{appNav:_},created:function(){var t=localStorage.getItem("expires"),a=localStorage.getItem("token");if(t&&a){var e=new Date(t),s=new Date;s=s.getTime(),e=e.getTime(),s>e?this.$store.dispatch("logout"):this.$store.dispatch("login",e-s)}else"Signin"!==this.$router.currentRoute.name&&this.$router.push({name:"Signin"})}},b=w,C=(e("034f"),Object(u["a"])(b,n,o,!1,null,null,null)),x=C.exports,k=e("8c4f"),y=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"row"},[e("div",{staticClass:"col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 mt-5 pt-3 pb-3 bg-white from-wrapper"},[e("div",{staticClass:"container"},[e("h3",[t._v("Sign In")]),e("hr"),e("form",{attrs:{action:"/",method:"post"},on:{submit:function(a){return a.preventDefault(),t.signin()}}},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"email"}},[t._v("Email address")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],staticClass:"form-control",attrs:{type:"text",name:"email",id:"email"},domProps:{value:t.email},on:{input:function(a){a.target.composing||(t.email=a.target.value)}}})]),e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"password"}},[t._v("Password")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"form-control",attrs:{type:"password",name:"password",id:"password"},domProps:{value:t.password},on:{input:function(a){a.target.composing||(t.password=a.target.value)}}})]),t.msg?e("alert",{attrs:{msg:t.msg,classAlert:t.classAlert}}):t._e(),e("div",{staticClass:"row"},[t._m(0),e("div",{staticClass:"col-12 col-sm-8 text-right"},[e("router-link",{attrs:{to:"/signup"}},[t._v("Don't have an account yet?")])],1)])],1)])])])},P=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"col-12 col-sm-4"},[e("button",{staticClass:"btn btn-primary",attrs:{type:"submit"}},[t._v("Login")])])}],$=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"col-12"},[e("div",{class:"alert alert-"+t.classAlert,attrs:{role:"alert"},domProps:{innerHTML:t._s(t.msg)}})])},A=[],I={props:["msg","classAlert"]},S=I,N=Object(u["a"])(S,$,A,!1,null,null,null),D=N.exports,O={data:function(){return{token:null,expires_in:null,email:"",password:"",msg:null,classAlert:null}},components:{Alert:D},methods:{signin:function(){var t=this,a={username:"testclient",password:"testsecret"},e=new FormData;e.append("username",this.email),e.append("password",this.password),e.append("grant_type","password"),this.$guest.post("/login",e,{auth:a}).then((function(a){t.msg="You have been successfully logged in!",t.classAlert="success",t.email="",t.password="",t.token=a.data.access_token,t.expires_in=a.data.expires_in;var e=1e3*t.expires_in,s=new Date,n=new Date(s.getTime()+e);localStorage.setItem("token",t.token),localStorage.setItem("expires",n),t.$store.dispatch("login",e)})).catch((function(a){console.log(a),t.msg=a.response.data.error_description,t.classAlert="danger"}))}}},j=O,E=Object(u["a"])(j,y,P,!1,null,null,null),M=E.exports,L=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"row"},[e("div",{staticClass:"col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 mt-5 pt-3 pb-3 bg-white from-wrapper"},[e("div",{staticClass:"container"},[e("h3",[t._v("Register")]),e("hr"),e("form",{attrs:{action:"/register",method:"post"},on:{submit:function(a){return a.preventDefault(),t.register()}}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-12 col-sm-6"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"firstname"}},[t._v("First Name")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.firstname,expression:"firstname"}],staticClass:"form-control",attrs:{type:"text",name:"firstname",id:"firstname"},domProps:{value:t.firstname},on:{input:function(a){a.target.composing||(t.firstname=a.target.value)}}})])]),e("div",{staticClass:"col-12 col-sm-6"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"lastname"}},[t._v("Last Name")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.lastname,expression:"lastname"}],staticClass:"form-control",attrs:{type:"text",name:"lastname",id:"lastname"},domProps:{value:t.lastname},on:{input:function(a){a.target.composing||(t.lastname=a.target.value)}}})])]),e("div",{staticClass:"col-12"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"email"}},[t._v("Email address")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],staticClass:"form-control",attrs:{type:"text",name:"email",id:"email"},domProps:{value:t.email},on:{input:function(a){a.target.composing||(t.email=a.target.value)}}})])]),e("div",{staticClass:"col-12 col-sm-6"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"password"}},[t._v("Password")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"form-control",attrs:{type:"password",name:"password",id:"password",value:""},domProps:{value:t.password},on:{input:function(a){a.target.composing||(t.password=a.target.value)}}})])]),e("div",{staticClass:"col-12 col-sm-6"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"password_confirm"}},[t._v("Confirm Password")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.password_confirm,expression:"password_confirm"}],staticClass:"form-control",attrs:{type:"password",name:"password_confirm",id:"password_confirm"},domProps:{value:t.password_confirm},on:{input:function(a){a.target.composing||(t.password_confirm=a.target.value)}}})])]),t.msg?e("alert",{attrs:{msg:t.msg,classAlert:t.classAlert}}):t._e()],1),e("div",{staticClass:"row"},[t._m(0),e("div",{staticClass:"col-12 col-sm-8 text-right"},[e("router-link",{attrs:{to:"/signin"}},[t._v(" Already have an account")])],1)])])])])])},T=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"col-12 col-sm-4"},[e("button",{staticClass:"btn btn-primary",attrs:{type:"submit"}},[t._v("Register")])])}],R={data:function(){return{firstname:"",lastname:"",email:"",password:"",password_confirm:"",msg:null,classAlert:null}},methods:{register:function(){var t=this,a=new FormData;a.append("firstname",this.firstname),a.append("lastname",this.lastname),a.append("email",this.email),a.append("password",this.password),a.append("password_confirm",this.password_confirm),this.$guest.post("/register",a).then((function(){t.msg="You have been successfully registered!",t.classAlert="success",t.firstname="",t.lastname="",t.email="",t.password="",t.password_confirm=""})).catch((function(a){t.msg=a.response.data.messages.error,t.classAlert="danger"}))}},components:{Alert:D}},H=R,q=Object(u["a"])(H,L,T,!1,null,null,null),F=q.exports,X=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"row"},[e("div",{staticClass:"col-12  mt-5 pt-3 pb-3 bg-white from-wrapper"},[e("h3",[t._v("Tambah Data Mahasiswa Baru")]),e("hr"),e("form",{on:{submit:function(a){return a.preventDefault(),t.save()}}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-12 col-sm-6"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"nim"}},[t._v("NIM")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.nim,expression:"nim"}],staticClass:"form-control",attrs:{type:"text",name:"nim",id:"nim"},domProps:{value:t.nim},on:{input:function(a){a.target.composing||(t.nim=a.target.value)}}})])]),e("div",{staticClass:"col-12 "},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"nama"}},[t._v("Nama")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.nama,expression:"nama"}],staticClass:"form-control",attrs:{type:"text",name:"nama",id:"nama"},domProps:{value:t.nama},on:{input:function(a){a.target.composing||(t.nama=a.target.value)}}})])]),e("div",{staticClass:"col-12"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"alamat"}},[t._v("Alamat")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.alamat,expression:"alamat"}],staticClass:"form-control",attrs:{type:"text",name:"alamat",id:"alamat"},domProps:{value:t.alamat},on:{input:function(a){a.target.composing||(t.alamat=a.target.value)}}})])]),e("div",{staticClass:"col-12 col-sm-6"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"nohp"}},[t._v("Nomor HP")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.nohp,expression:"nohp"}],staticClass:"form-control",attrs:{type:"nohp",name:"nohp",id:"nohp",value:""},domProps:{value:t.nohp},on:{input:function(a){a.target.composing||(t.nohp=a.target.value)}}})])]),e("div",{staticClass:"col-12 col-sm-6"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"email"}},[t._v("Email")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],staticClass:"form-control",attrs:{type:"email",name:"email",id:"email"},domProps:{value:t.email},on:{input:function(a){a.target.composing||(t.email=a.target.value)}}})])]),e("div",{staticClass:"col-4"},[e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"indeks"}},[t._v("Indeks")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.indeks,expression:"indeks"}],staticClass:"form-control",attrs:{type:"indeks",name:"indeks",id:"indeks",value:""},domProps:{value:t.indeks},on:{input:function(a){a.target.composing||(t.indeks=a.target.value)}}})])]),t.msg?e("alert",{attrs:{msg:t.msg,classAlert:t.classAlert}}):t._e()],1),e("div",{staticClass:"row"},[e("div",{staticClass:"col-12 "},[e("button",{staticClass:"btn btn-primary",attrs:{type:"submit"}},[t._v(t._s(t.id?"Update":"Create"))]),e("button",{staticClass:"btn btn-secondary float-right",on:{click:function(a){return a.preventDefault(),t.cancel()}}},[t._v("Cancel")])])])])]),t.posts.length>0?e("div",{staticClass:"col-12  mt-5 pt-3 pb-3 bg-white from-wrapper"},[e("h3",[t._v("Data Mahasiswa")]),e("hr"),t._l(t.posts,(function(a,s){return e("PostItem",{key:a.id,attrs:{index:s,post:a},on:{delete:t.deletePost,edit:t.getPost}})}))],2):t._e()])},z=[],B=(e("a434"),function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"row post mb-1"},[e("div",{staticClass:"col-12 col-sm-8"},[e("h6",[t._v("NIM: "+t._s(t.post.nim))]),e("h6",[t._v("Nama: "+t._s(t.post.nama))]),e("h6",[t._v("Alamat: "+t._s(t.post.alamat))]),e("h6",[t._v("Nomor HP: "+t._s(t.post.nohp))]),e("h6",[t._v("Email: "+t._s(t.post.email))]),e("h6",[t._v("Indeks: "+t._s(t.post.indeks))])]),e("div",{staticClass:"col-12 mt-3"},[e("router-link",{staticClass:"btn btn-outline-success mr-2",attrs:{to:"/post/"+t.post.id}},[t._v("View")]),e("button",{staticClass:"btn btn-outline-primary",on:{click:function(a){return t.$emit("edit",t.post.id,t.index)}}},[t._v("Edit")]),e("button",{staticClass:"btn btn-outline-danger float-right",on:{click:function(a){return t.$emit("delete",t.post.id,t.index)}}},[t._v("Delete")])],1),t._m(0)])}),U=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"col-12"},[e("hr")])}],W={props:["post","index"]},J=W,Y=Object(u["a"])(J,B,U,!1,null,null,null),V=Y.exports,G={data:function(){return{msg:null,classAlert:null,id:null,post_index:null,posts:[],nim:"",nama:"",alamat:"",nohp:"",email:"",indeks:""}},components:{Alert:D,PostItem:V},methods:{save:function(){this.id?this.update():this.create()},create:function(){var t=this,a=new FormData;a.append("nim",this.nim),a.append("nama",this.nama),a.append("alamat",this.alamat),a.append("nohp",this.nohp),a.append("email",this.email),a.append("indeks",this.indeks),this.$api.post("/mahasiswa",a).then((function(a){t.msg="Mahasiswa Baru berhasil Ditambahkan!",t.classAlert="success",t.posts.unshift(a.data),t.cancel(!0)})).catch((function(a){t.msg=a.response.data.messages.error,t.classAlert="danger"}))},update:function(){var t=this,a=new FormData;a.append("nim",this.nim),a.append("nama",this.nama),a.append("alamat",this.alamat),a.append("nohp",this.nohp),a.append("email",this.email),a.append("indeks",this.indeks),this.$api.post("/mahasiswa/update/"+this.id,a).then((function(a){t.msg="Data Mahasiswa telah diperbaharui",t.classAlert="success",t.posts[t.post_index]=a.data,t.cancel(!0)})).catch((function(a){t.msg=a.response.data.messages.error,t.classAlert="danger"}))},get:function(){var t=this;this.$api.get("/mahasiswa").then((function(a){t.posts=a.data})).catch((function(a){console.log(a.response),t.msg=a.response.data.messages.error,t.classAlert="danger"}))},getPost:function(t,a){var e=this;this.cancel(),this.id=t,this.post_index=a,this.$api.get("/mahasiswa/"+t).then((function(t){e.nim=t.data.nim,e.nama=t.data.nama,e.alamat=t.data.alamat,e.nohp=t.data.nohp,e.email=t.data.email,e.indeks=t.data.indeks,window.scroll(0,0)}))},deletePost:function(t,a){var e=this;this.$api.delete("/mahasiswa/"+t).then((function(){e.msg="Data mahasiswa berhasil dihapus",e.classAlert="warning",e.cancel(!0),e.posts.splice(a,1),window.scroll(0,0)})).catch((function(t){e.msg=t.response.data.messages.error,e.classAlert="danger"}))},cancel:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.post_index=null,this.id=null,this.nim="",this.nama="",this.alamat="",this.nohp="",this.email="",this.indeks="",t||(this.msg=null,this.classAlert=null)}},created:function(){this.get()}},K=G,Q=Object(u["a"])(K,X,z,!1,null,null,null),Z=Q.exports,tt=function(){var t=this,a=t.$createElement,e=t._self._c||a;return t.post?e("div",{staticClass:"col-12  mt-5 pt-3 pb-3 bg-white from-wrapper"},[e("div",{staticClass:"col-12 col-sm-8"},[e("h6",[t._v("NIM: "+t._s(t.post.nim))]),e("h6",[t._v("Nama: "+t._s(t.post.nama))]),e("h6",[t._v("Alamat: "+t._s(t.post.alamat))]),e("h6",[t._v("Nomor HP: "+t._s(t.post.nohp))]),e("h6",[t._v("Email: "+t._s(t.post.email))]),e("h6",[t._v("Indeks: "+t._s(t.post.indeks))])]),e("div",{staticClass:"col-12 mt-3"},[e("router-link",{staticClass:"btn btn-outline-success mr-2",attrs:{to:"/"}},[t._v("Semua Mahasiswa")])],1)]):t._e()},at=[],et={data:function(){return{post:!1}},methods:{get:function(){var t=this,a=this.$route.params.id;this.$api.get("/mahasiswa/"+a).then((function(a){t.post=a.data})).catch((function(t){console.log(t.response)}))}},created:function(){this.get()}},st=et,nt=Object(u["a"])(st,tt,at,!1,null,null,null),ot=nt.exports;s["a"].use(k["a"]);var it=new k["a"]({routes:[{path:"/",component:Z,name:"Home"},{path:"/post/:id",component:ot,name:"Post"},{path:"/signin",component:M,name:"Signin"},{path:"/signup",component:F,name:"Signup"}],mode:"history"}),rt=it,lt=(e("d3b7"),e("bc3a")),ct=e.n(lt),mt=e("2f62");s["a"].use(mt["a"]);var pt=new mt["a"].Store({state:{isLoggedIn:!1},getters:{loginState:function(t){return t.isLoggedIn}},mutations:{login:function(t){t.isLoggedIn=!0,"Home"!==rt.currentRoute.name&&rt.push("/")},logout:function(t){t.isLoggedIn=!1,localStorage.removeItem("token"),localStorage.removeItem("expires"),rt.push("/signin")}},actions:{login:function(t,a){var e=t.commit;setTimeout((function(){e("logout")}),a),e("login")},logout:function(t){var a=t.commit;a("logout")}}}),ut=ct.a.create({baseURL:"https://tst048backendrest.xyz/api/public/user",headers:{"Content-Type":"application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest"}}),dt=ct.a.create({baseURL:"https://tst048backendrest.xyz/api/public",headers:{"Content-Type":"application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest"}});dt.interceptors.request.use((function(t){var a=localStorage.getItem("token");return a&&(t.headers["Authorization"]="Bearer "+a),t})),dt.interceptors.response.use((function(t){return t}),(function(t){if(401!==t.response.status)return Promise.reject(t);pt.dispatch("logout")})),s["a"].prototype.$guest=ut,s["a"].prototype.$api=dt,s["a"].config.productionTip=!1,new s["a"]({router:rt,guest:ut,store:pt,render:function(t){return t(x)}}).$mount("#app")},"85ec":function(t,a,e){}});
//# sourceMappingURL=app.c8bcc3df.js.map
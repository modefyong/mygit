"use strict"

// ====================
//基础功能函数
// =====================
//用于添加页面自动加载的函数
function addLoadEvent(func){
  var oldonload = window.onload;
  if(typeof window.onload != 'function'){
    window.onload = func;
  }else {
    window.onload = function(){
      oldonload();
      func();
    }
  }
}

//用于向后插入document节点
function insertAfter(newElement, targetElement){
  var parent = targetElement.parentNode;
  if(parent.lastChild == targetElement){
    parent.appendChild(newElement);
  }
  else{
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

//用于向节点添加class
function addClass(element, value){
	if(!element.className){
		element.className = value;
	}else {
		var newClassName = element.className;
		newClassName += " ";
		newClassName += value;
		element.className = newClassName;
	}
}

//动态添加body的id和a标签的class
function hightlightPage(){
  var headers = document.getElementsByTagName("header");
  if(headers.length == 0)return false;
  var navs = headers[0].getElementsByTagName("nav");
  if(navs.length == 0) return false;

  //取得导航链接，循环遍历
  //找到当前页面的那个，高亮显示
  var links = navs[0].getElementsByTagName("a");
  var linkurl;
  for(let i = 0;i < links.length;i++){
    linkurl = links[i].getAttribute("href");
    if(window.location.href.indexOf(linkurl) != -1){
      addClass(links[i], "here");
      //顺便给每个页面的body添加id用于添加不同的header背景图片
      let linktext = links[i].lastChild.nodeValue.toLowerCase();
      document.body.setAttribute("id", linktext);
    }
  }
}
addLoadEvent(hightlightPage);

// ===========================
//实现index页面幻灯片效果
// ===========================
function moveElement(elementID,final_x,final_y,interval){
	if(!document.getElementById) return false;
	if(!document.getElementById(elementID)) return false;
	var elem = document.getElementById(elementID);
	if(elem.movement){
		clearTimeout(elem.movement);
	}
	// 添加安全检查，确保元素具有left,right属性
	if(!elem.style.left){
		elem.style.left = "0px";
	}
	if(!elem.style.right){
		elem.style.right = "0px";
	}

	var xpos = parseInt(elem.style.left);
	var ypos = parseInt(elem.style.right);

	if(xpos == final_x && ypos == final_y){
		return true;
	}

	var dist;
	if(xpos<final_x){
		dist = Math.ceil((final_x-xpos)/10);
		xpos = xpos + dist;
	}
	if(xpos>final_x){
		dist = Math.ceil((xpos-final_x)/10);
		xpos = xpos - dist;
	}
	if(ypos<final_y){
		dist = Math.ceil((final_y-ypos)/10);
		ypos = ypos + dist;
	}
	if(ypos>final_y){
		dist = Math.ceil((ypos-final_y)/10);
		ypos = ypos - dist;
	}

	elem.style.left = xpos + "px";
	elem.style.right = ypos + "px";

	var repeat = "moveElement('"+elementID+"',"+final_x+","+final_y+","+interval+")";
	elem.movement = setTimeout(repeat,interval);
}

function prepareSlideshow(){

  var intro = document.getElementById("intro");
  var slideshow = document.createElement("div");
  slideshow.setAttribute("id","slideshow");
  var preview = document.createElement("img");
  preview.setAttribute("src","images/slideshow.gif")
  preview.setAttribute("alt","a glimpse of what awaits you");
  preview.setAttribute("id","preview");
  slideshow.appendChild(preview);
  insertAfter(slideshow,intro);

// 循环找到a标签，然后通过href值判断要显示的图片，
// 传递相应的位置参数给moveElement
  var links = document.getElementsByTagName("a");
  var destination;
  for(let i = 0;i < links.length; i++){
    links[i].onmouseover = function(){
      destination = this.getAttribute("href");
      if(destination.indexOf("index.html") != -1){
        moveElement("preview",0,0,5);
      }
      if(destination.indexOf("about.html") != -1){
        moveElement("preview",-150,0,5);
      }
      if(destination.indexOf("photos.html") != -1){
        moveElement("preview",-300,0,5);
      }
      if(destination.indexOf("live.html") != -1){
        moveElement("preview",-450,0,5);
      }
      if(destination.indexOf("contact.html") != -1){
        moveElement("preview",-600,0,5);
      }
    }
  }

  //给幻灯片添加边框
  var frame = document.createElement("img");
  frame.setAttribute("src","images/frame.gif");
  frame.setAttribute("alt","");
  frame.setAttribute("id","frame");
  slideshow.appendChild(frame);

}
//判断是否在index页面，是则执行该函数
if(window.location.href.indexOf("index.html") != -1){
  addLoadEvent(prepareSlideshow);
}


// ============================
// 选择性显示about页面的段落
// ============================

//将传入参数对应的段落显示，其他段落隐藏
function showSection(id){
  var sections = document.getElementsByTagName("section");
  for(let i = 0;i < sections.length;i++){
    if(sections[i].getAttribute("id") != id){
      sections[i].style.display = "none";
    } else {
      sections[i].style.display = "block";
    }
  }
}

//将showSection()函数绑定到导航栏中
function prepareInternalnav(){

  var articles = document.getElementsByTagName("article");
  if(articles.length == 0) return false;
  var navs = articles[0].getElementsByTagName("nav");
  if(navs.length == 0) return false;
  var nav = navs[0];
  var links = nav.getElementsByTagName("a");
  for(let i=0;i < links.length; i++){
    //links[i].getAttribute("href").split("#")[0]是空串
    let sectionId = links[i].getAttribute("href").split("#")[1];
    if(!document.getElementById(sectionId)) continue;
    document.getElementById(sectionId).style.display = "none";
    links[i].destination = sectionId;
    links[i].onclick = function(){
      showSection(this.destination);
      return false; //关闭窗口的默认事件？
    }
  }
}
//判断是否在about页面，是则在页面加载时运行该函数
if(window.location.href.indexOf("about.html") != -1){
  addLoadEvent(prepareInternalnav);
}

// =========================
// photos页面相关函数
// ==========================
function showPic(whichPic){
	if(!document.getElementById("placeholder")) return false;
	var source = whichPic.getAttribute("href");
	var placeholder = document.getElementById("placeholder");
	placeholder.setAttribute("src",source);
	if(!document.getElementById("description")) return false;
	if(whichPic.getAttribute('title')){
		var text = whichPic.getAttribute('title');
	}else{
		var text="";
	}
	var description = document.getElementById("description");
	if(description.firstChild.nodeType == 3){
		description.firstChild.nodeValue = text;
	}
	return true;
}

function preparePlaceholder(){
	if(!document.createElement) return false;
	if(!document.createTextNode) return false;
	if(!document.getElementById) return false;
	if(!document.getElementById("imagegallery")) return false;

	var placeholder = document.createElement("img");
	placeholder.setAttribute("src","images/placeholder.gif");
	placeholder.setAttribute("alt","my image gallery")
	placeholder.setAttribute("id","placeholder");

	var description = document.createElement("p");
	description.setAttribute("id","description");
	var desctext = document.createTextNode("Choose an image");
	description.appendChild(desctext);
	var gallery = document.getElementById("imagegallery");
	insertAfter(description,gallery);
	insertAfter(placeholder,description);
}

function preparGallery(){
  var gallery = document.getElementById("imagegallery");
  var links = gallery.getElementsByTagName("a");
  for(let i = 0;i < links.length;i++){
    links[i].onclick = function(){
      //将onclick事件绑定到相应的元素，但是分离了HTML和JS
      //如果showPic执行失败，则不取消默认行为，否则返回false，取消浏览器的默认行为
      return !showPic(this);
    }
  }
}

if(window.location.href.indexOf("photos.html") != -1){
  addLoadEvent(preparePlaceholder);
  addLoadEvent(preparGallery);
}

// =============================
// live页面相关函数
// ==============================

//鼠标所在行突出显示
function stripeTables(){
  var tables = document.getElementsByTagName("table");
  if(tables.length == 0) return false;

  for(let i = 0;i < tables.length; i++){
    let rows = tables[i].getElementsByTagName("tr");
    let odd = false;
    for(let j = 0;j < rows.length; j++){
      if(odd){
        addClass(rows[j],"odd")
        odd = false;
      }
      else odd = true;
    }
  }
}

function highlightRows(){
  var rows = document.getElementsByTagName("tr");
  for(let i = 0;i < rows.length; i++){
    rows[i].oldClassName = rows[i].className;
    rows[i].onmouseover = function(){
      addClass(this, "highlight");
    }
    rows[i].onmouseout = function(){
      this.className = this.oldClassName;
    }
  }
}

function displayAbbreviations(){
  //将所有缩略词标签保存到abbreviations里，
  //通过循环取出title和text放到defs里
  var abbreviations = document.getElementsByTagName("abbr");
  if(abbreviations.length < 1)return false;
  var defs = [];
  for(let i = 0;i < abbreviations.length;i++){
    let current_abbr = abbreviations[i];
    if(current_abbr.childNodes.length < 1) continue;
    let definition = current_abbr.getAttribute("title");
    let key = current_abbr.lastChild.nodeValue;
    defs[key] = definition;
  }

  //动态创建列表标签元素
  var dList = document.createElement("dl");
  //循环遍历将defs中的内容添加到列表元素里
  for(let key in defs){
    var definition = defs[key];
    var dt = document.createElement("dt");
    var dt_text = document.createTextNode(key);
    dt.appendChild(dt_text);
    var dd = document.createElement("dd");
    var dd_text = document.createTextNode(definition);
    dd.appendChild(dd_text);

    dList.appendChild(dt);
    dList.appendChild(dd);
  }

  //将动态创建的标签添加到页面article中
  if(dList.childNodes.length < 1) return false;
  var header = document.createElement("h3");
  var headText = document.createTextNode("Abbreviations");
  header.appendChild(headText);
  var articles = document.getElementsByTagName("article");
  if(articles.length == 0) return false;
  var container = articles[0];
  container.appendChild(header);
  container.appendChild(dList);
}
//判断是否在live页面,是则加载相关函数
if(window.location.href.indexOf("live.html") != -1){
  addLoadEvent(stripeTables);
  addLoadEvent(highlightRows);
  addLoadEvent(displayAbbreviations);
}

// =====================
//contact页面相关函数
// =====================

//让字段标签获得焦点(感觉现在已经没有必要了,记录一下代码)
function focusLabels(){
  var labels = document.getElementsByTagName("label");
  for(let i = 0;i < labels.length;i++){
    if(!labels[i].getAttribute("for")) continue;
    labels[i].onclick = function(){
      let id = this.getAttribute("for");
      if(!document.getElementById(id)) return false;
      let element = document.getElementById(id);
      element.focus();
    };
  }
}

//form属性
//取得占位符的值作为作为临时value
function resetFields(whichform){
  for(let i = 0;i < whichform.elements.length; i++){
    let element = whichform.elements[i];
    if(element.type == "submit")continue;
    let check = element.placeholder || element.getAttribute("placeholder");
    if(!check)continue;
    //获得焦点,清空占位符
    element.onfocus = function(){
      let text = this.placeholder || this.getAttribute("placeholder");
      if(this.value == text){
        this.className = "";
        this.value = "";
      }
    }
    //失去焦点,如果没有输入信息,重新将占位符填上
    element.onblur = function(){
      if(this.value == ""){
        this.className = "placeholder";
        this.value = this.placeholder || this.getAttribute("placeholder");
      }
    }
    element.onblur();
  }
}

function isEmail(field){
  return (field.value.indexOf("@") != -1 && field.value.indexOf(".") != -1);
}

function prepareForms(){
  for(let i = 0;i < document.forms.length;i++){
    let thisform = document.forms[i];
    resetFields(thisform);
    thisform.onsubmit = function(){
      if(!validateForm(this)) {
        return false;
      }
      let article = document.getElementsByTagName("article")[0];
      if(submitFormWithAjax(this, article))return false;
      return true;
    };
  }
}

//表单验证
function validateForm(whichform){
  for(let i = 0;i < whichform.elements.length; i++){
    let element = whichform.elements[i];
    if(element.required == "required"){
      if(!isFilled(element)){
        alert("Please fill in the "+ element.name+" field.");
        return false;
      }
    }
    if(element.type == "email"){
      if(!isEmail(element)){
        alert("The " + element.name + " field must be a valid email address.");
        return false;
      }
    }
  }
  return true;
}

//通过Ajax部分改变页面
function getHTTPObject(){
  if(typeof XMLHttpRequest == "undefined"){
    XMLHttpRequest = function(){
      try{
        return new ActiveXObject("Msxml2.XMLHTTP.6.O");
      }
      catch(e){}
      try{
        return new ActiveXObject("Msxml2.XMLHTTP.3.O");
      }
      catch(e){}
      try{
        return new ActiveXObject("Msxml2.XMLHTTP");
      }
      catch(e){}
      return false;
    }
  }
  return new XMLHttpRequest();
}
//删除所有子元素并添加一个加载图标
function displayAjaxLoading(element){
  while(element.hasChildNodes()){
    element.removeChild(element.lastChild);
  }
  var content = document.createElement("img");
  content.setAttribute("src","images/loading.gif");
  content.setAttribute("alt","Loading...");
  element.appendChild(content);
}
//拦截表单
function submitFormWithAjax(whichform, thetarget){
  var request = getHTTPObject();
  if(!request) {
    return false;
  }
  displayAjaxLoading(thetarget);

  var dataParts = [];
  var element;

  for(let i = 0;i < whichform.elements.length; i++ ){
    element = whichform.elements[i];
    dataParts[i] = element.name + "=" + encodeURIComponent(element.value);
  }
  var data = dataParts.join("&");
  request.open("POST", whichform.getAttribute("action"), true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.onreadystatechange =function(){
    if(request.readyState == 4){
      if(request.status == 200 || request.status == 0){
        let matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
        if(matches.length > 0){
          thetarget.innerHTML = matches[1];
        }else{
          thetarget.innerHTML = "<p>0ops, there was an error. Sorry.</p>";
        }
      }else{
        thetarget.innerHTML = "<p>" + request.statusText +"</p>";
      }
    }
  };
  request.send(data);
  return true;
}



if(window.location.href.indexOf("contact.html") != -1){
  addLoadEvent(focusLabels);
  addLoadEvent(prepareForms);
}